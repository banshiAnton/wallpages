const fs = require('fs');
const path = require('path')
const url = require('url');
const writeFile = require('util').promisify(fs.writeFile);
const readFile = require('util').promisify(fs.readFile);
const sharp = require('sharp');
const fetch = require('node-fetch');
const FormData = require('form-data');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

let categoryGetRes = function(seqRes) {
    let res = {};
    res.categories = seqRes.map(category => {
        return category.get('clientData');
    });
    res.success = true;
    return Promise.resolve(res);
}


let makePromiseToSave = function (pathToFolder, image, ImagesDb) {

    return new Promise((res, rej) => {
            if(!image.mimetype.match(/^image\//)) throw new Error('Type must be image');
            res();
        })
        .then(() => writeFile(path.join(pathToFolder, '/', image.name), image.data))
        .then(() => sharp(image.data).metadata())
        .then(metadata => sharp(image.data).resize(Math.round(metadata.width / 8), Math.round(metadata.height / 8)).toFile(path.join(pathToFolder, '/small/', image.name)))
        .then(() => ImagesDb.create({file: image.name, tags: image.tags, category_id: image.category}))
        .then(data => {
            console.log('File: ', image.name, ' saved ', data);
            return {res: data.dataValues, success: true};
        })
        .then()
        .catch(error => {
            console.log('Error cahtch VK', error)
            return {error: error.message, success: false}
        })
}

let getAlbumsVK = function() {
    let url = `https://api.vk.com/method/photos.getAlbums?&owner_id=${-process.env.vkgid}&access_token=${process.env.vktoken}&v=5.92`;
    return fetch(url).then(data => data.json());
}

let createAlbumVK = function(title) {
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
    })

    return fetch(urlCA).then(data => data.json());;
}

let savePhotoVK = function(imgGroup) {

    let form = new FormData();

    imgGroup.files.forEach((img, i) => {
        form.append(`file${i+1}`, img.data, {
            filename: img.name,
            contentType: img.mimetype
        });
    }) 

    let getServer = `https://api.vk.com/method/photos.getUploadServer?&album_id=${imgGroup.vkAid}&group_id=${process.env.vkgid}&access_token=${process.env.vktoken}&v=5.62`;
    return fetch(getServer)
            .then(data => data.json())
            .then(data => data.response.upload_url)
            .then(url => fetch(url, {
                method: 'POST',
                body:    form,
                headers: form.getHeaders(),
            }))
            .then(data => data.json())
            .then(data => {
                console.log('Photos list', data);
                let url = `https://api.vk.com/method/photos.save?album_id=${data.aid}&group_id=${data.gid}&server=${data.server}&hash=${data.hash}&photos_list=${data.photos_list}&access_token=${process.env.vktoken}&v=5.62`
                return fetch(url);
            })
            .then(data => data.json())
            .then(data => {
                console.log(data);
                return data.response.map(photo => `photo${photo.owner_id}_${photo.id}`).join(',');
            })
            .catch(err => null)
}

let postVK = async function(images, ops) {

    console.log('VK start', images);

    let attachments = [];
    let tags = [];

    for(let img in images) {
        let at = await savePhotoVK(images[img]);
        if(at) attachments.push(at);
        tags.push(images[img].tags);
        images[img].files.map(img => img.tags).forEach(tags_ => tags_.forEach(tag => tags.push(tag)));
        console.log('At', attachments);
    }

    console.log('Tags************\n\n', tags);
    let message = tags.map(tag => tag.length ? '#' + tag : '').join('');
    console.log('Message', message);
    attachments  = attachments.join(',');
    console.log('attachments', attachments);
    console.log(ops.publish_date);
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
            publish_date: ops.publish_date,
            v: 5.67
        }
    })
    return fetch(postUrl)
    .then(data => data.json())
    .then(post => {
        console.log('End post', post);
        return {res: post, success: true, vk: 'VK'};
    })
    .catch(error => {
        console.log('Promis error VK', error);
        return {error, success: false, vk: 'VK'};
    });
}

let telPostOnPTime = function(Posts, pathToFolder) {
    setInterval(() => {
        let time = Math.ceil(Date.now() / 1000);
        Posts.findAll({
            where: {
                pTime: {
                    [Op.lte]: time
                }
            }
        }).then(data => {
            console.log('POSTS****', data)
            if(data.length) {
                return postTelegram(JSON.parse(data[0].get('jsonData')), pathToFolder)
            }
        })
        .then(res => {
            console.log(res);
            return Posts.destroy({
                where: {
                    pTime: {
                        [Op.lte]: time
                    }
                }
            })
        }).then(res => console.log(res))
        .catch(error => console.log('Find db error', error))
    }, 1000 * 15);
}

let postTelegram = async function(images, pathToFolder) {

    console.log('Pre data', images);

    let media = [];
    let form = new FormData();
    let i = 1
    for(let image of images) {

        let file = await readFile(path.join(pathToFolder, '/', image.file));
        console.log('File', file);

        let name = `file${i}`;
        form.append(name, file, {
            filename: image.file,
            contentType: image.mimetype
        });
        media.push({type: 'photo', media: `attach://${name}`, caption: image.caption})
        ++i;
    }

    console.log('End media', media);
    form.append('media', JSON.stringify(media));
    form.append('chat_id', process.env.telGroup);

    return fetch(`https://api.telegram.org/bot${process.env.telToken}/sendMediaGroup`, {
        method: "POST",
        body: form,
        headers: form.getHeaders(),
    })
    .then(res => res.json())
}


let postTelegramInDB = function(images, Posts, ops) {
    console.log('Tel post start', process.env.telToken, process.env.telGroup);

    let media = [];

    for(let categ in images) {
        images[categ].files.forEach((img) => {
            media.push({file: img.name, mimetype: img.mimetype, caption: img.tags.map(tag => `#${tag}`).join('') + images[categ].tags.map(tag => `#${tag}`).join('') })
        })
    }

    console.log('\n\n****Media********\n\n', media, JSON.stringify(media));

    return Posts.create({pTime: ops.publish_date, jsonData: JSON.stringify(media)})
    .then(res => {
        console.log(res);
        return {res, success: true, telegram: 'telegram'}
    })
    .catch(error => {
        console.log('Promis error telegram', error);
        return {error, success: false, telegram: 'telegram'};
    });
}

let saveImages = async function(pathToFolder, imagesArr, db, ops) {
    let results = [];

    console.log(imagesArr);
    let filesSaved = [];
    for(let image of imagesArr) {
        try {
            let res = await makePromiseToSave(pathToFolder, image, db.Images);
            res.file = image.name;
            if(res.success) {
                filesSaved.push(image);
            }
            results.push(res);
        } catch (err) {
            console.log('Error Save Db (catch(err))', err);
        }
    }

    console.log(filesSaved);
    let categGroup = {};
    filesSaved.forEach(img => {
        if(!categGroup[img.category]) {
            categGroup[img.category] = {
                files: [img],
            }
            categGroup[img.category] = Object.assign(categGroup[img.category], ops.categOps[img.category])
        } else {
            categGroup[img.category].files.push(img);
        }
    });

    console.log('*********\nCateg Ops', categGroup, '\n********');

    try {
        let res = await postVK(categGroup, ops);
        results.push(res);
    } catch (err) {
        console.log('Error post VK (catch(err))', err);
    }

    try {
        // console.log('Saved**', filesSaved.map(img => {
        //     return {name: img.name, tags: img.tags}
        // }));
        let res = await postTelegramInDB(categGroup, db.Posts, ops);
        results.push(res);
    } catch (err) {
        console.log('Error post Telegram (catch(err))', err);
    }

    return results;
}

exports.categoryGetRes = categoryGetRes;
exports.saveImages = saveImages;
exports.createAlbumVK = createAlbumVK;
exports.getAlbumsVK = getAlbumsVK;
exports.telPostOnPTime = telPostOnPTime;