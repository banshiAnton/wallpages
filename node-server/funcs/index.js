const fs = require('fs');
const path = require('path')
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

let postVK = function(images) {

    console.log('VK start', images);

    let form = new FormData();
    images.forEach( (image, i) => {
        form.append(`file${i+1}`, image.data, {
            filename: image.name,
            contentType: image.mimetype
        });
    })

    let getServer = `https://api.vk.com/method/photos.getUploadServer?&album_id=${process.env.vkaid}&group_id=${process.env.vkgid}&access_token=${process.env.vktoken}&v=5.62`;
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
                console.log('Photos list', data.photos_list);
                let url = `https://api.vk.com/method/photos.save?album_id=${data.aid}&group_id=${data.gid}&server=${data.server}&hash=${data.hash}&photos_list=${data.photos_list}&access_token=${process.env.vktoken}&v=5.62`
                return fetch(url);
            })
            .then(data => data.json())
            .then(data => {
                let message = images.map(img => img.tags.map(tag => `%23${tag}`).join('')).join('');
                console.log('Message', message, data);
                let attachments  = data.response.map(photo => `photo${photo.owner_id}_${photo.id}`).join(',');
                let postUrl = `https://api.vk.com/method/wall.post?&owner_id=${-process.env.vkgid}&message=${message}&attachments=${attachments}&from_group=1&v=5.67&access_token=${process.env.vktoken}`;
                return fetch(postUrl)
            })
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

let saveImages = async function(pathToFolder, imagesArr, ImagesDb) {
    let results = [];
    let filesVk = [];
    for(let image of imagesArr) {
        try {
            let res = await makePromiseToSave(pathToFolder, image, ImagesDb);
            res.file = image.name;
            if(res.success) {
                filesVk.push(image);
            }
            results.push(res);
        } catch (err) {
        }
    }

    try {
        let res = await postVK(filesVk);
        results.push(res);
    } catch (err) {
    }

    return results;
}

exports.categoryGetRes = categoryGetRes;
exports.saveImages = saveImages;