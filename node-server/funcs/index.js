const fs = require('fs');
const path = require('path')
const url = require('url');
const writeFile = require('util').promisify(fs.writeFile);
const sharp = require('sharp');
const fetch = require('node-fetch');
const FormData = require('form-data');

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

let savePhotoVK = function(img) {

    let form = new FormData();

    form.append(`file1`, img.data, {
        filename: img.name,
        contentType: img.mimetype
    });

    let getServer = `https://api.vk.com/method/photos.getUploadServer?&album_id=${img.vkAid}&group_id=${process.env.vkgid}&access_token=${process.env.vktoken}&v=5.62`;
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
                return data.response.map(photo => `photo${photo.owner_id}_${photo.id}`).join('');
            })
            .catch(err => null)
}

let postVK = async function(images) {

    console.log('VK start', images);

    let attachments = [];

    for(let image of images) {

        let at = await savePhotoVK(image);
        if(at) attachments.push(at);
        console.log('At', attachments);
    }

    let message = images.map(img => img.tags.map(tag => `#${tag}`).join('')).join('');
    console.log('Message', message);
    attachments  = attachments.join(',');
    console.log('attachments', attachments);
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

let postTelegram = function(images) {
    console.log('Tel post start', process.env.telToken, process.env.telGroup);

    let media = [];

    let form = new FormData();
    images.forEach( (image, i) => {
        let name = `file${i+1}`;
        form.append(name, image.data, {
            filename: image.name,
            contentType: image.mimetype
        });
        media.push({type: 'photo', media: `attach://${name}`})
    })

    form.append('media', JSON.stringify(media));
    form.append('chat_id', process.env.telGroup);

    return fetch(`https://api.telegram.org/bot${process.env.telToken}/sendMediaGroup`, {
        method: "POST",
        body: form,
        headers: form.getHeaders(),
    })
    .then(res => res.json())
    .then(res => {
        console.log(res);
        return {res, success: true, telegram: 'telegram'}
    })
    .catch(error => {
        console.log('Promis error telegram', error);
        return {error, success: false, telegram: 'telegram'};
    });
}

let saveImages = async function(pathToFolder, imagesArr, ImagesDb) {
    let results = [];
    let filesSaved = [];
    for(let image of imagesArr) {
        try {
            let res = await makePromiseToSave(pathToFolder, image, ImagesDb);
            res.file = image.name;
            if(res.success) {
                filesSaved.push(image);
            }
            results.push(res);
        } catch (err) {
        }
    }

    try {
        let res = await postVK(filesSaved);
        results.push(res);
    } catch (err) {
    }

    try {
        let res = await postTelegram(filesSaved);
        results.push(res);
    } catch (err) {
    }

    return results;
}

exports.categoryGetRes = categoryGetRes;
exports.saveImages = saveImages;
exports.createAlbumVK = createAlbumVK;
exports.getAlbumsVK = getAlbumsVK;