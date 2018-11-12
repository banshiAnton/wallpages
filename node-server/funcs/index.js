const fs = require('fs');
const path = require('path')
const writeFile = require('util').promisify(fs.writeFile);

let categoryGetRes = function(seqRes, cb) {
    let res = {};
    res.count = seqRes.count;
    res.categories = seqRes.rows.map(category => {
        return {
            id: category.get('id'),
            name: category.get('name'), 
            tags: category.get('tags')
        }
    });
    res.success = true;
    cb(res);
}


let makePromiseToSave = function (pathToFolder, image, ImagesDb) {

    return new Promise((res, rej) => {
            if(!image.mimetype.match(/^image\//)) throw new Error('Type must be image');
            res();
        })
        .then(() => writeFile(path.join(pathToFolder, '/', image.name), image.data))
        .then(() => ImagesDb.create({file: image.name, tags: image.tags, category_id: image.category}))
        .then(data => {
            console.log('File: ', image.name, ' saved ', data);
            return {res: data.dataValues, success: true};
        })
        .catch(error => {
            console.log('error cahtch', error)
            return {error: error.message, success: false}
        })
}

let saveImages = async function(pathToFolder, imagesArr, ImagesDb) {
    let results = [];
    for(let image of imagesArr) {
        try {
            let res = await makePromiseToSave(pathToFolder, image, ImagesDb);
            res.file = image.name;
            results.push(res);
        } catch (err) {
        }
    }

    return results;
}


exports.categoryGetRes = categoryGetRes;
exports.saveImages = saveImages;