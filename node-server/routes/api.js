const path = require('path');
const fs = require('fs');

const { categoryGetRes, saveImages, createAlbumVK, getAlbumsVK, telPostOnPTime } = require('../funcs');

const { parseFilesData, groupFileDataToFiles, makeApiQuery, isAuth } = require('../middleware');

const Sequelize = require('sequelize');
console.log(process.env.CLEARDB_DATABASE_URL);
const sequelize = new Sequelize(process.env.CLEARDB_DATABASE_URL);

const sequelizeBaseError = require('sequelize/lib/errors').BaseError;

const Admins = sequelize.import(path.join(__dirname, '../models/admin'));

const Categories = sequelize.import(path.join(__dirname, '../models/categories'));
const Images = sequelize.import(path.join(__dirname, '../models/images'));
const Posts = sequelize.import(path.join(__dirname, '../models/posts'));

Posts.sync({force: true}).then(() => sequelize.query('DROP TABLE `images`'))
.then(res => {
    console.log(res);
    telPostOnPTime(Posts, path.join(__dirname, `../public/images`))
    return Categories.sync({force: true})
})
.then((res) => {
    console.log(res);
    return Images.sync({force: true});
}).then((res) => {
    console.log(res);
    Categories.hasMany(Images, {foreignKey: 'category_id', sourceKey: 'id'})
    Images.belongsTo(Categories,{foreignKey: 'category_id', targetKey: 'id'});
    return getAlbumsVK();
}).then(data => {
    console.log(data);
    let bToCreate = data.response.items.map(item => {
        return {name: item.title, vkId: item.id, tags: []}
    })
    return Categories.bulkCreate(bToCreate);
}).then(() => { // Notice: There are no arguments here, as of right now you'll have to...
    return Categories.findAll();
}).then(categs => {
    categs.forEach(item => {
        console.log(item.get('name'), item.get('tags'), item.get('vkId'));
    })
})
.catch(err => console.error('ERROR in MYSQL', err));


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
    include: [{model: Categories, required: true}],
    order: [
        ['updatedAt', 'DESC']
    ]
    };

    queryObj = Object.assign(req.queryOps.limOps, queryObj);

    Images.findAll(queryObj)
    .then(result => {
        let arr = [];
        result.forEach(item => {
            console.log('Test', item.get('category_id'), item.get('file'));
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

router.post('/upload', isAuth, parseFilesData, groupFileDataToFiles, function (req, res, next) {
    console.log('Url', req.url, req.host, req.hostname);
    saveImages(path.join(__dirname, `../public/images`), req.files.images, {Images, Posts}, { publish_date: req.body.publish_date, url: `http://${req.host}:${process.env.PORT}/images` })
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

router.delete('/category/:id',isAuth, function(req, res, next) {
    console.log(req.params);
    Images.destroy({
        where: {
            category_id: +req.params.id
        }
    }).then(data => {
        console.log('Delete images', data);
        return Categories.destroy({
            where: {
                id: +req.params.id
            }
        })
    }).then(data => {
        console.log('Delete categoty', data);
        res.json({success: true});
    })
    .catch(error => res.json({success: false, error}))
});

router.post('/add/category', isAuth, function(req, res, next) {
    let name = req.body.name;
    let tags = req.body.tags;
    console.log(name, tags);

    createAlbumVK(name)
    .then(data => Categories.create({name, tags, vkId: data.response.id}))
    .then(result => {
        console.log(result);
        res.json({success: true, name: result.get('name')});
    })
    .catch(err => next(err))
    
});

router.put('/category/:id', isAuth, function(req, res, next) {
    console.log(req.params.id, req.body);
    Categories.findById(req.params.id)
    .then(categ => {
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