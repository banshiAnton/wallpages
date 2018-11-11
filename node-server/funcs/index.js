const fs = require('fs');
const path = require('path')
const Promise_serial = require('promise-serial');

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

let buildSaveFiles = function(filesData) {
    console.log('Func save', filesData);
    return new Promise((res, rej) => {
        let saveArr = [];
        for(let key in filesData) {
            saveArr.push({
                file: key,
                tags: filesData[key].tags,
                category_id: filesData[key].category
            })
        }
        res(saveArr);
    })
}

let fspWrite = function(path, buffer) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, buffer, function(err, res) {
            if(err) return reject(err);
            resolve(res);
        })
    })
}

let makePromiseToSave = function (arrError, pathToFolder, image, ImagesDb) {
    return () => new Promise((resolve, reject) => {
        fspWrite(path.join(pathToFolder, '/', image.name), image.data)
        .then(() => ImagesDb.create({file: image.name, tags: image.tags, category_id: image.category}))
        .then(data => {
            console.log('File: ', image.name, ' saved ', data);
            resolve(data.dataValues);
        })
        .catch(error => {
            console.log('Serial save error', error, ' ', image.name);
            arrError.push({name: image.name, error});
            reject(err);
        })
    })
}

let saveImages = function(pathToFolder, arrError, imagesArr, ImagesDb) {

    let results = [];

    for(let image of imagesArr) {
        results.push(makePromiseToSave(arrError, pathToFolder, image, ImagesDb));
    }

    return Promise_serial(results);
}


exports.categoryGetRes = categoryGetRes;
exports.buildSaveFiles = buildSaveFiles;
exports.fspWrite = fspWrite;
exports.saveImages = saveImages;