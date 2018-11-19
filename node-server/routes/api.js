const path = require('path');
const fs = require('fs');

const { categoryGetRes, saveImages } = require('../funcs');

const { parseFilesData, groupFileDataToFiles, makeApiQuery } = require('../middleware');

const Sequelize = require('sequelize');
// const sequelize = new Sequelize(process.env.sqlDb, process.env.sqlUser, process.env.sqlPassword, {
//     dialect: process.env.sqlDialect,
//     host: process.env.sqlHost,
//     port: process.env.sqlPort,
// });

const sequelize = new Sequelize(process.env.sqlUrl);

const sequelizeBaseError = require('sequelize/lib/errors').BaseError;

const Categories = sequelize.import(path.join(__dirname, '../models/categories'));
const Images = sequelize.import(path.join(__dirname, '../models/images'));

Categories.sync({force: false}).then(() => {
}).then((res) => {
    console.log(res);
    Images.sync({force: false}).then(() => {
    }).then((res) => {
        console.log(res);
        Categories.hasMany(Images, {foreignKey: 'category_id', sourceKey: 'id'})
        Images.belongsTo(Categories,{foreignKey: 'category_id', targetKey: 'id'});
    }).catch(err => {
        console.error('ERROR in MYSQL',err);
    });
}).catch(err => {
    console.error('ERROR in MYSQL', err);
});

// Categories.hasMany(Images, {foreignKey: 'category_id', sourceKey: 'id'})
// Images.belongsTo(Categories,{foreignKey: 'category_id', targetKey: 'id'});

const router = require('express').Router();

// api.images?category=test&count=10&offset=0&tags[]=test&tags[]=pest

router.get('/', makeApiQuery, function (req, res, next) {

    const pathToStatics = `/images/`;
    let reg = req.query.tags ? req.query.tags.join('|') : '.'; 

    let queryObj = {attributes: ['category_id', 'file', [Sequelize.fn('CONCAT', Sequelize.col('`images`.`tags`'), ' ', Sequelize.col('`category`.`tags`')), 'tags']],
    where: {
        $and: [
            Sequelize.where(Sequelize.fn('CONCAT', Sequelize.col('`images`.`tags`'), ' ', Sequelize.col('`category`.`tags`')), {
                [Sequelize.Op.regexp]: reg
            }),
            req.queryOps.where
        ]
    },
    include: [{model: Categories, required: true}]};

    queryObj = Object.assign(req.queryOps.limOps, queryObj);

    Images.findAll(queryObj)
    .then(result => {
        let arr = [];
        console.log('Results', result);
        result.forEach(item => {
            console.log('Test 2', item.get('category_id'), item.get('file'));
        arr.push({
                id: item.get('id'),
                url: `${pathToStatics}${item.get('file')}`,
                minimizeUrl: `${pathToStatics}small/${item.get('file')}`,
                tags: item.get('tags'),
                category_id: item.get('category_id')
            })
        })
        res.json({success: true, results: arr});
    }).catch(err => next(err))
});

router.post('/upload', parseFilesData, groupFileDataToFiles, function (req, res, next) {
    saveImages(path.join(__dirname, `../public/images`), req.files.images, Images)
    .then(results => {
        console.log('End', results);
        res.json({success: true, results});
    })
    .catch(err => next(err))
});

router.get('/categories', function(req, res, next) {
    Categories.findAll()
    .then(result => categoryGetRes(result))
    .then(resultForm => {
        console.log(resultForm);
        resultForm.categories.forEach(item => console.log(item.tags))
        res.json(resultForm);
    })
    .catch(err => next(err))
});

router.post('/add/category', function(req, res, next) {
    let name = req.body.name;
    let tags = req.body.tags;
    console.log(name, tags);
    Categories.create({name, tags}).then((result) => {
        console.log(result);
        res.json({success: true, name: result.get('name'), tags: result.get('tags')});
    }).catch(err => next(err))
});

router.put('/categories/:id', function(req, res, next) {
    console.log(req.params.id, req.body);
    Categories.findById(req.params.id)
    .then(categ => {
        //console.log(categ);
        return categ.update({
            name: req.body.name,
            tags: req.body.tags
        })
    }).then(data => {
        console.log('Updated', data);
        res.json({success: true, result: data.get('clientData')})
    })
    .catch(error => next(error))
});

module.exports = router;