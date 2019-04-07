const sequelizeBaseError = require('sequelize/lib/errors').BaseError;
const util = require('util');
const Sequelize = require('sequelize');
const path = require('path');
const jwt = require('jsonwebtoken');

const { ServerError } = require('../funcs/error');

const sequelize = new Sequelize(process.env.CLEARDB_DATABASE_URL);

const Admins = sequelize.import(path.join(__dirname, '../models/admin'));

const makeApiQuery = function(req, res, next) {
    
    let limOps = {};
    let where = { isPublish: true };

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

const nomalizeArray = function(req, res, next) {

    if( !req.files.images ) {
        throw new ServerError('No images');
    }

    if (!Array.isArray(req.files.images)) {
        req.files.images = [req.files.images];
    }

    next();
}


const parseFilesData = function(req, res, next) {

        let filesData = JSON.parse(req.body.filesData);
        
        console.log('Client data', filesData, 'Files', req.files.images);

        for (let file of req.files.images) {
            
            console.log('File', file);


            if ( !filesData[ file.name ].category ) throw new ServerError('No category selected');

            file.category = filesData[file.name].category;
            file.tags = filesData[file.name].tags;

        }


        console.log('Transformed', req.files.images);

        next();
}

const errorHandle = function(err, req, res, next) {
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

const isInit = function() {
    return function(req, res, next) {
        if(process.env.isInit === 'true') {
            return next();
        } else {
            next({success: false, message: 'Не инициализировано'});
        }
    }
}

const isAuth = function(isOnlyGodAdmin = false) {
    return function(req, res, next) {
        if(req.cookies.admin_data) {

            let decoded = jwt.decode(req.cookies.admin_data);
            // console.log(decoded);

            if ( isOnlyGodAdmin ) {
                if ( decoded.user_id == process.env.vkGodAdminId ) {
                    return next();
                } else {
                    return next({message: 'вы не главный админ'});
                }
            } else if ( decoded.user_id === process.env.vkGodAdminId && !isOnlyGodAdmin ) {
                return next();
            } else {
                Admins.findOne({ where: {vkid: decoded.user_id} })
                .then(data => {
                    // console.log('Find data admin', data);
                    if(data) {
                        return next();
                    } else {
                        console.log('No admin in DB');
                        throw { message: 'нет такого админа' };
                    }
                })
                .catch(err => next(err))
            }
        } else {
            res.json({success: false})
        }
    }
}

exports.nomalizeArray = nomalizeArray;
exports.isInit = isInit;
exports.isAuth = isAuth;
exports.makeApiQuery = makeApiQuery;
exports.errorHandle = errorHandle;
exports.parseFilesData = parseFilesData;