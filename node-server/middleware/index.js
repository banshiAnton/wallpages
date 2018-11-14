const sequelizeBaseError = require('sequelize/lib/errors').BaseError;

let parseFilesData = function (req, res, next) {
    req.body.filesData = JSON.parse(req.body.filesData);
    next();
}

let groupFileDataToFiles = function(req, res, next) {

    console.log(req.body.filesData, req.files);

    if(!Array.isArray(req.files.images)) req.files.images = [req.files.images];

    for(let file of req.files.images) {
        file.category = req.body.filesData[file.name].category;
        file.tags = req.body.filesData[file.name].tags;
        file.name = Date.now() + '_' + file.name;
        file.name.trim();
    }

    console.log('Transformed', req.files);
    next()
}

let errorHandle = function(err, req, res, next) {
    let obj = {sucess: false, errors: []}
    if(err instanceof sequelizeBaseError) {
        for(let error of err.errors) {
            obj.errors.push({message: error.message, key: error.path, value: error.value})
        }

        res.json(obj);
        return true;
    } else {
        return false;
    }
}

exports.errorHandle = errorHandle;
exports.groupFileDataToFiles = groupFileDataToFiles;
exports.parseFilesData = parseFilesData;