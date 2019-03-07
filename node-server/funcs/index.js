const fs = require('fs');
const path = require('path')
const url = require('url');

const jwt = require('jsonwebtoken');

const util = require('util');

const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);

const sharp = require('sharp');
const fetch = require('node-fetch');

const FormData = require('form-data');
const Sequelize = require('sequelize');

const ok = require('ok.ru');
const graph = require('fbgraph');
const md5 = require('md5');

const okGet = util.promisify(ok.get);
const okRefresh = util.promisify(ok.refresh);

const graphGet = util.promisify(graph.get);
const graphPost = util.promisify(graph.post);

const Op = Sequelize.Op;

const parallel = require('promise-parallel');

const { ServerError } = require('./error');

const pathToSave = path.join(__dirname, '../../static/images');

const config = require('../config');

const appLinkStr = (id) => `
Наше приложение в Google play market:
${config.get(`AppLinks:${id}:link`)}`;

const getTagsStr = function ( categories , sep = '' ) {

    let tags = [];

    for ( let category of categories ) {
        tags = tags.concat( category.get( 'tags' ) );
        category.dataValues.images.forEach( image => tags = tags.concat( image.get( 'tags' ) ) );
    }

    return tags.map( tag => '#' + tag ).join( sep );
}

const getSigOk = function(obj, token) {
    let sec = md5(token + process.env.okprKey);
    let baseStr = '';
    for(let param of Object.keys(obj).sort()) {
        baseStr += `${param}=${obj[param]}`;
    }

    baseStr += sec;

    return md5(baseStr);
}

const vkAuthCB = function(data, Admins) {
    if(!data || !data.user_id) {
        return Promise.reject('vk data error');
    }

    delete data.access_token;

    return Admins.findOne({ where: {vkid: data.user_id} })
            .then(result => {
                if(!result) {
                    throw new Error('no admin with id');
                }
                return jwt.sign(data, process.env.secretJWT, {algorithm: 'HS256'});
            });
};

let okAppOprions = {
    applicationSecretKey: process.env.okprKey,
    applicationKey: process.env.okpbKey,
    applicationId: process.env.okAppId,
};

ok.setOptions(okAppOprions);

const categoryGetRes = function(seqRes) {
    let res = {};
    res.categories = seqRes.map(category => {
        return category.get('clientData');
    });
    res.success = true;
    return Promise.resolve(res);
}

const imgCutResolution = function (image, pathToFolder) {
    return function(metadata) {

            const mulResolution = metadata.width * metadata.height;
            const mulMin_16_9_Res = 1280 * 720;
            const mulMin_16_10_Res = 1280 * 800;
        
            if(mulResolution <= mulMin_16_9_Res || mulResolution <= mulMin_16_10_Res) {
                return writeFile(path.join(pathToFolder, '/', image.name), image.data)
            }
        
            const props_16_9 = 1.78;
            const props_16_10 = 1.6;

            let promisesArr = [writeFile(path.join(pathToFolder, '/', image.name), image.data)];
        
            if(metadata.width < metadata.height) {
                let props = parseFloat((metadata.height / metadata.width).toFixed(2));
                if(props === props_16_9) {
                    promisesArr.push(sharp(image.data).resize(720, 1280).toFile(path.join(pathToFolder, '/small/', image.name)));
                } else if(props === props_16_10) {
                    promisesArr.push(sharp(image.data).resize(800, 1280).toFile(path.join(pathToFolder, '/small/', image.name)));
                }
            } else {
                let props = parseFloat((metadata.width / metadata.height).toFixed(2));
                if(props === props_16_9) {
                    promisesArr.push(sharp(image.data).resize(1280, 720).toFile(path.join(pathToFolder, '/small/', image.name)));
                } else if(props === props_16_10) {
                    promisesArr.push(sharp(image.data).resize(1280, 800).toFile(path.join(pathToFolder, '/small/', image.name)));
                }
            }

            if(promisesArr.length == 1) {
                promisesArr.push(sharp(image.data).resize(Math.round(metadata.width / 1.5), Math.round(metadata.height / 1.5)).toFile(path.join(pathToFolder, '/small/', image.name)));
            }

            return parallel(promisesArr);
    }
};

const saveToFolderAndDbImages = function ( pathToSave, image, ImagesDb ) {

        return new Promise((res, rej) => {
            if(!image.mimetype.match(/^image\//)) throw new Error('Type must be image');
            res();
        })
        .then( () => sharp( image.data ).metadata())
        .then( imgCutResolution( image, pathToSave ) )
        .then( () => ImagesDb.build( { file: image.name, mimetype: image.mimetype, tags: image.tags, category_id: image.category } ) )
        .then( image => { return { image, success: true }} )
        .catch(error => {
            console.log('Error save images', error);
            return { error, success: false, }
        })
}

const makePost = async function(images, db, ops) {
    let imagesIdArr = [];
    for ( let image of images ) {
        let response = await saveToFolderAndDbImages( pathToSave, image, db.Images );

        console.log( 'Save date to foledr or create instance', response );

        if ( !response.success ) {
            throw new ServerError( response.error.message || 'Error save to folder or db', response.error );
        }

        try {
            let image = await response.image.save();
            imagesIdArr.push(image.dataValues.id)
        } catch ( error ) {
            console.log( 'Save date to Image db', error );
            throw new ServerError( response.error.message || 'Error save to folder or db', response.error );
        }
    }

    return db.Posts.create( { 
                publish_date: ops.publish_date, 
                text: ops.text, images: imagesIdArr, 
                appLinkId: ops.appLinkId 
            } ).then( post => post.setImages( imagesIdArr ) )
}

const getAlbumsOK = function() {
    return okRefresh(process.env.okRToken)
    .then(data => {
        ok.setAccessToken(data.access_token);
        return okGet({ method: 'photos.getAlbums', format: 'json', gid: process.env.okGid }).catch(err => err);
    })
}

const getAlbumsFB = function() {
    graph.setAccessToken(process.env.fbToken);
    return graphGet(`/${process.env.fbGid}/albums`).catch(err => err);
}


const getAlbumsVK = function() {
    let url = `https://api.vk.com/method/photos.getAlbums?&owner_id=${-process.env.vkgid}&access_token=${process.env.vktoken}&v=5.92`;
    return fetch(url).then(data => data.json()).catch(err => err);
}

const getAlbums = async function() {

    let tmp = {};

    let vkAlbums = await getAlbumsVK();

    vkAlbums.response.items.forEach(album => {
        tmp[album.title.toLowerCase()] = {
            tags: [],
            vkId: album.id
        }
    });

    let okAlbums = await getAlbumsOK();
    let fbAlbums = await getAlbumsFB();

    console.log(okAlbums, fbAlbums);

    okAlbums.albums.forEach(album => {
        if(album.title.toLowerCase() == 'разное') {
            tmp['основной'].okId = album.aid;
        } else {
            tmp[album.title.toLowerCase()].okId = album.aid;
        }
    });

    fbAlbums.data.forEach(album => {
        tmp[album.name.toLowerCase()].fbId = album.id;
    });

    tmp['основной'].fbId = process.env.fbGid;

    let toSave = [];
    for(let name in tmp) {
        toSave.push(Object.assign({name}, tmp[name]))
    }

    return toSave;

};

const makeSetup = (Categories) => getAlbums()
                     .then(bToCreate => Categories.bulkCreate(bToCreate))
                     .then(() => Categories.findAll());

const createAlbumVK = function(title) {

    let urlCA = url.format({
        protocol: 'https',
        hostname: 'api.vk.com',
        pathname: '/method/photos.createAlbum',
        query: {
            group_id: process.env.vkgid,
            title,

            access_token: process.env.vktoken,
            v: 5.92
        }
    });

    return fetch(urlCA)
            .then(data => data.json())
            .then(data => {
                return {success: true, data}
            }).catch(err => {
                return {success: false, err}
            });
}

const createAlbumFB = function(name) {

    graph.setAccessToken(process.env.fbToken);

    return graphPost(`/${process.env.fbGid}/albums`, {name})
           .then(data => {
            return {success: true, data};
           })
           .catch(err => {
                return {success: false, err};
           });
}

const createAlbumOK = function(title) {

    return okRefresh(process.env.okRToken)
    .then(data => ok.setAccessToken(data.access_token))
    .then(() => {

        let urlPost = url.format({
            protocol: 'https',
            hostname: 'api.ok.ru',
            pathname: 'fb.do',
            query: {
                application_key: process.env.okpbKey,
                format: 'json',
                method: 'photos.createAlbum',
                gid: process.env.okGid,
                title,
                sig: getSigOk({application_key: process.env.okpbKey, format: 'json', method: 'photos.createAlbum', gid: process.env.okGid, title}, ok.getAccessToken().trim()),
                access_token: ok.getAccessToken().trim()
            }
        });

        return fetch(urlPost)
                .then(data => data.json())
                .then(data => {
                    return {success: true, data}
                }).catch(err => {
                    return {success: false, err}
                });
    })
}

const createAlbum = async function(name, tags, Categories) {

    let check = await Categories.findAll({where: {name}}).then(data => {
        return {success: !!data};
    }).catch(err => {
        console.log('Error add album in db', err);
        return {success: false, err};
    });

    if(!check.success) {
        if(!check.err) {
            check.message = 'Такая категория уже существует';
        }
        throw check;
    };

    let [vk, fb, ok] = await parallel([createAlbumVK(name),
                                       createAlbumFB(name),
                                       createAlbumOK(name)
                                     ]);

    console.log('Data create social', vk, fb, ok);

    if(!vk.success || !fb.success || !ok.success) {
        throw {vk, fb, ok};
    }

    return Categories.create({name, tags, vkId: vk.data.response.id,
                                          fbId: fb.data.id,
                                          okId: ok.data
                                        });

}

const savePhotoVK = function ( category ) {

    let form = new FormData();

    category.images.forEach( ( image, i ) => {

        form.append(`file${i+1}`, image.buffer, {
            filename: image.dataValues.file,
            mimetype: image.dataValues.mimetype
        });

    }) 

    let getServer = `https://api.vk.com/method/photos.getUploadServer?&album_id=${category.vkId}&group_id=${process.env.vkgid}&access_token=${process.env.vktoken}&v=5.62`;

    return fetch( getServer )
            .then( data => data.json()  )
            .then( data => data.response.upload_url )
            .then( url => fetch( url, { method: 'POST', body:    form, headers: form.getHeaders() } ) )
            .then( data => data.json() )
            .then( data => fetch( `https://api.vk.com/method/photos.save?album_id=${data.aid}&group_id=${data.gid}&server=${data.server}&hash=${data.hash}&photos_list=${data.photos_list}&access_token=${process.env.vktoken}&v=5.62` ) )
            .then( data => data.json() )
            .then( data => data.response.map( photo => `photo${photo.owner_id}_${photo.id}`).join( ',' ) )
            .catch( error => error )
}


const postVK = async function ( post, categories ) {

    let promiseUploadPhotos = [];

    for ( let category of categories ) {
        promiseUploadPhotos.push( savePhotoVK( category.dataValues ) );
    }

    let attachments = await parallel( promiseUploadPhotos );
    attachments.push( config.get( `AppLinks:${post.appLinkId}:link` ) );
    attachments = attachments.join( ',' );

    let message = post.text + '\n' + getTagsStr( categories );

    let postUrl = url.format({
        protocol: 'https',
        hostname: 'api.vk.com',
        pathname: '/method/wall.post',
        query: {
            message,
            attachments,
            owner_id: -process.env.vkgid,
            access_token: process.env.vktoken,
            from_group: 1,
            v: 5.67
        }
    })
    return fetch( postUrl )
    .then( data => data.json() )
    .then(post => {
        console.log('End post VK', post);
        if ( !post.response || !post.response.post_id ) {
            throw post;
        }
        return { res: post, success: true };
    })
    .catch(error => {
        console.log('Promis error VK', error);
        return { error, success: false, };
    });
}

const postOK = async function ( post, categories ) {

    let allImages = [];

    for ( let category of categories ) {
        allImages = allImages.concat( category.dataValues.images );
    }

    let text = post.text + '\n\n' + getTagsStr( categories , ' ' ) + appLinkStr( post.appLinkId );

    return okRefresh( process.env.okRToken )
    .then( data => ok.setAccessToken( data.access_token ) )
    .then( () => okGet( { method: 'photosV2.getUploadUrl', count: allImages.length, gid: process.env.okGid } ) )
    .then( data => {

        let form = new FormData();

        allImages.forEach( ( image , i ) => {
            form.append( `pic${i+1}`, image.buffer, {
                filename: image.dataValues.file,
                contentType: image.dataValues.mimetype
            });
        })

        return fetch(data.upload_url, { method: 'post', body: form, headers: form.getHeaders() } );
    })
    .then( data => data.json() )
    .then( data => {

        let at = {
            "media": [
              {
                "type": "photo",
                "list": []
              }, 
              {
                  "type": "text",
                  "text": text
              }
            ]
        };

        for(let id in data.photos) {
            at.media[0].list.push({id: data.photos[id].token});
        }


        let urlPost = url.format({
            protocol: 'https',
            hostname: 'api.ok.ru',
            pathname: 'fb.do',
            query: {
                application_key: process.env.okpbKey,
                format: 'json',
                method: 'mediatopic.post',
                type: 'GROUP_THEME',
                gid: process.env.okGid,
                attachment: JSON.stringify(at),
                sig: getSigOk({application_key: process.env.okpbKey, format: 'json', method: 'mediatopic.post', type: 'GROUP_THEME', gid: process.env.okGid, attachment: JSON.stringify(at)}, ok.getAccessToken().trim()),
                access_token: ok.getAccessToken().trim()
            }
        });

        return fetch( urlPost );

    })
    .then( data => data.json() )
    .then( post => {
        console.log('End post OK', post);
        if ( post instanceof Object ) {
            throw post;
        }
        return { res: post, success: true };
    })
    .catch(error => {
        console.log('Promis error OK', error);
        return { error, success: false };
    });
}

const postOKAlbum = async function ( post, categories ) {

    await okRefresh(process.env.okRToken).then(data => ok.setAccessToken(data.access_token));

    let promiseArr = [];

    for ( let category of categories ) {

        let promise = okGet( { method: 'photosV2.getUploadUrl', count: category.dataValues.images.length, gid: process.env.okGid, aid: category.get( 'okId' ) } )
        .then( data => {

            let form = new FormData();

            category.dataValues.images.forEach( ( image , i ) => {
                form.append( `file${i+1}`, image.buffer, {
                    filename: image.dataValues.file,
                    contentType: image.dataValues.mimetype
                });
            })

            return fetch(data.upload_url, { method: 'post', body: form, headers: form.getHeaders() } );
        }).then( data => data.json() )
        .then(async data => {
            
            let arrRes = [];

            for(let id in data.photos) {

                let urlSave = url.format({
                    protocol: 'https',
                    hostname: 'api.ok.ru',
                    pathname: 'fb.do',
                    query: {
                        application_key: process.env.okpbKey,
                        format: 'json',
                        method: 'photosV2.commit',
                        photo_id: id,
                        token: data.photos[id].token,
                        sig: getSigOk({application_key: process.env.okpbKey, format: 'json', method: 'photosV2.commit', photo_id: id, token: data.photos[id].token}, ok.getAccessToken().trim()),
                        access_token: ok.getAccessToken().trim()
                    }
                });


                let reult = await fetch(urlSave).then(data => data.json()).catch(err => err);

                arrRes.push(reult);
            }

            return arrRes;
        })
        .catch(err => err);

        promiseArr.push( promise );

    }

    return parallel( promiseArr );

}

const postFBAlbum = async function ( post, categories ) {

    let promiseArr = [];

    for ( let category of categories ) {

            let categotyTags = category.get( 'tags' );

            for( let image of category.dataValues.images ) {

                let caption = categotyTags.concat( image.get( 'tags' ) ).map( tag => '#' + tag ).join( ' ' );

                let formWall = new FormData();

                formWall.append( 'photo', image.buffer, {
                    filename: image.dataValues.file,
                    contentType: image.dataValues.mimetype
                });

                formWall.append( 'caption', caption );
                formWall.append( 'published', "false" );

                let formAlbum = new FormData();

                formAlbum.append( 'photo', image.buffer, {
                    filename: image.dataValues.file,
                    contentType: image.dataValues.mimetype
                });

                formAlbum.append( 'caption', caption );


                let wall = fetch(`https://graph.facebook.com/v3.2/${process.env.fbGid}/photos?access_token=${process.env.fbToken}`, {
                    method: 'POST',
                    body:   formWall,
                    headers: formWall.getHeaders(),
                }).then( res => res.json() ).catch( err => err )

                let album = fetch(`https://graph.facebook.com/v3.2/${category.get('fbId')}/photos?access_token=${process.env.fbToken}`, {
                    method: 'POST',
                    body:   formAlbum,
                    headers: formAlbum.getHeaders(),
                }).then( res => res.json() ).catch( err => err )

                let promise = parallel([wall, album]).then(([wall, album]) => {
    
                    if ( !wall.id || !album.id ) {
                        throw { wall, album };
                    }
    
                    image.fbPostId = wall.id;
                    console.log( 'FB data post album', wall, album );
                    return { wall, album, success: true };
    
                }).catch( error => {
                    console.log( 'FB promise save error', error );
                    return { error, success: false };
                });
    
                promiseArr.push( promise );

            }

        }

    await parallel( promiseArr );

    return postFBWall( post, categories )
    
}

const postFBWall = async function( post, categories ) {

    let body = {};
    body.message = post.text + '\n' + getTagsStr( categories, ' ' ) + appLinkStr( post.appLinkId );

    let i = 0;

    for ( let category of categories ) {

        category.dataValues.images.forEach( image => { body[ `attached_media[${i++}]` ] = { "media_fbid": image.fbPostId } } )
    }

    console.log( 'FB Post BODY', body );

    return graphPost( `/${process.env.fbGid}/feed`, body )
    .catch(err => err);
}

const postTelegram = async function ( post, categories ) {

    let results = [];

    for ( let category of categories ) {
        for ( let image of category.dataValues.images ) {

            let caption = category.get( 'tags' ).concat( image.get( 'tags' ) ).map( tag => '#' + tag ).join( ' ' );

            let formPhoto = new FormData();

            formPhoto.append('chat_id', process.env.telGroup);
            formPhoto.append('caption', caption);
            formPhoto.append('photo', image.buffer, {
                filename: image.dataValues.file,
                contentType: image.dataValues.mimetype
            });

            let formDoc = new FormData();
            
            formDoc.append('chat_id', process.env.telGroup);
            formDoc.append('caption', caption);
            formDoc.append('document', image.buffer, {
                filename: image.dataValues.file,
                contentType: image.dataValues.mimetype
            });
            formDoc.append('reply_markup', JSON.stringify({
                inline_keyboard: [ [ { text: 'Наше приложение', url: config.get( `AppLinks:${post.appLinkId}:link` ) } ] ]
            }))

            //process.env.appUrl

            let resPhoto = await fetch(`https://api.telegram.org/bot${process.env.telToken}/sendPhoto`, {
                method: "POST",
                body: formPhoto,
                headers: formPhoto.getHeaders(),
            })
            .then(res => res.json())
            .catch(err => {
                console.log('Error photo', err);
                return err;
            });

            results.push( resPhoto );

            console.log('Telegram photo', resPhoto);

            let resDoc = await fetch(`https://api.telegram.org/bot${process.env.telToken}/sendDocument`, {
                method: "POST",
                body: formDoc,
                headers: formDoc.getHeaders(),
            })
            .then(res => res.json())
            .catch(err => {
                console.log('Error doc', err);
                return err;
            });

            results.push( resDoc );

            console.log('Telegram photo', resDoc);

        }
    }

    return results;
}

const postOnTime = function(Posts, Images, Categories) {
    
    let flag = true;

    setInterval(async () => {

        try {

            if ( flag && process.env.isInit ) {

                let currentDate = Date.now();
    
                let posts = await Posts.findAll( { where: { publish_date: { [Op.lte]: currentDate } } } );

                console.log( 'Post on time', posts );

                if( posts && posts.length ) {

                    flag = false;

                    for ( let post of posts ) {

                        let categories = await getCategories( post.dataValues, Images, Categories );

                        console.log( 'Categories', categories );

                        let postsSocial = await postToSocial( post.dataValues, categories );

                        console.log( 'End social', postsSocial );

                        let update = await Images.update( { isPublish: true }, { where: { post_id: post.dataValues.id } } )

                        console.log( 'Update images', update );
                    }

                }
                
                let delPost = await Posts.destroy( { where: { publish_date: { [Op.lte]: currentDate } } } );

                console.log( 'Post on time delete', delPost );
    
                flag = true;
            }

        } catch ( error ) {
            console.log( 'Post on time error', error );
        }

    }, 1000 * 5);
}

const getCategories = async function ( post, Images, Categories ) {

    let categories = await Categories.findAll( {
        attributes: [ 'vkId', 'okId', 'fbId', 'tags' ],
        include: [
            { model: Images, required: true, where: { post_id: post.id, isPublish: false } }
        ]
    } );

    //load buffer

    for ( let category of categories ) {
        for ( let image of category.images ) {
            image.buffer = await readFile( path.join( pathToSave, image.file ) )
        }
    }

    return categories;
}

const postToSocial = function ( post, categories ) {

    return parallel( [ postVK( post, categories ), postOK( post, categories ),
         postTelegram( post, categories ), postOKAlbum( post, categories ), postFBAlbum( post, categories ) ] );

}

const parsePost = async function ( post, text = false ) { 

    post.appLinkId = text ? config.get(`AppLinks:${post.appLinkId}:name`) : +post.appLinkId;
    post.publish_date = new Date( +post.publish_date );

    let images = [];

    for ( let image of post.images ) {

        let category = await image.getCategory( { attributes: [ 'id', 'name', 'tags' ] } );

        image = image.dataValues;

        image.file = await fs.existsSync( path.join( pathToSave, '/small/', image.file ) ) ? `small/${image.file}` : image.file;

        image.category = category.dataValues;

        images.push( image );

    }

    post.images = images;

    return post;
}

const getPost = async function ( id, Posts, Images ) {

    return Posts.findOne( { attributes: [ 'id', 'text', 'appLinkId', 'publish_date' ], where: { id }, include: [
        { model: Images, required: true, attributes: [ 'id', 'file', 'tags', 'category_id' ] }
     ] } ).then( async post => {

        console.log( 'Post', post );

        return await parsePost( post );
    })
}

const getPosts = async function ( Posts, Images ) {

    let response = [];

    return Posts.findAll( { attributes: [ 'id', 'text', 'appLinkId', 'publish_date' ], include: [
        { model: Images, required: true, attributes: [ 'id', 'file', 'tags', 'category_id' ] }
     ] } ).then( async posts => {

        console.log( 'Posts', posts );

        for ( let post of posts ) {

            let postToClient = await parsePost( post, true );

            response.push( postToClient );
        }

        return response;
    })

}

exports.getPost = getPost;
exports.getPosts = getPosts;
exports.makePost = makePost;
exports.vkAuthCB = vkAuthCB;
exports.categoryGetRes = categoryGetRes;
exports.createAlbum = createAlbum;
exports.postOnTime = postOnTime;
exports.getAlbums = getAlbums;
exports.makeSetup = makeSetup;