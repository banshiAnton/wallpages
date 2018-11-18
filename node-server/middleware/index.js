const sequelizeBaseError = require('sequelize/lib/errors').BaseError;
const util = require('util');

let makeApiQuery = function(req, res, next) {
    
    let limOps = {};
    let where = {};

    console.log('Query params', req.query);

    if(req.query.category && !req.query.category.match(/\D/i)) {
        where.category_id = +req.query.category;
    }

    if(req.query.count && !req.query.count.match(/\D/i)) {
        limOps.limit = +req.query.count;
    }

    if(req.query.offset && !req.query.offset.match(/\D/i)) {
        limOps.offset = +req.query.offset;
    }

    if(!req.query.tags || !Array.isArray(req.query.tags)) {
        delete req.query.tags;
    } else {
        let newArr = [];
        for(let i = 0; i < req.query.tags.length; ++i) {
            if(req.query.tags[i].length) {
                newArr.push(req.query.tags[i]);
            }
        }
        req.query.tags = newArr;
    }

    // let where = {};
    // if(req.query.category) where.category = req.query.category;
    // if(req.query.category) where.category = req.query.category;


    //res.json(req.query);

    req.queryOps = {where, limOps};

    console.log(req.query);

    next();
}

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

exports.makeApiQuery = makeApiQuery;
exports.errorHandle = errorHandle;
exports.groupFileDataToFiles = groupFileDataToFiles;
exports.parseFilesData = parseFilesData;