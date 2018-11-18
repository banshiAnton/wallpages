const fs = require('fs');
const path = require('path')
const writeFile = require('util').promisify(fs.writeFile);
const sharp = require('sharp');

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
        .then(metadata => sharp(image.data).resize(Math.round(metadata.width / 4), Math.round(metadata.height / 4)).toFile(path.join(pathToFolder, '/small/', image.name)))
        .then(() => ImagesDb.create({file: image.name, tags: image.tags, category_id: image.category}))
        .then(data => {
            console.log('File: ', image.name, ' saved ', data);
            return {res: data.dataValues, success: true};
        })
        .then()
        .catch(error => {
            console.log('error cahtch', error)
            return {error: error.message, success: false}
        })
}

let saveImages = async function(pathToFolder, imagesArr, ImagesDb) {
    let results = [];
    let filesVk = [];
    for(let image of imagesArr) {
        try {
            let res = await makePromiseToSave(pathToFolder, image, ImagesDb);
            res.file = image.name;
            if(res.success) {
                filesVk.push(image.data);
            }
            results.push(res);
        } catch (err) {
        }
    }

    return results;
}


exports.categoryGetRes = categoryGetRes;
exports.saveImages = saveImages;