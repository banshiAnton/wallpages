const path = require('path');
const fs = require('fs');

const { categoryGetRes, saveImages } = require('../funcs');

const { parseFilesData, groupFileDataToFiles } = require('../middleware');

const Sequelize = require('sequelize');
const sequelize = new Sequelize('wallpages', 'root', '', {
    dialect: 'mysql',
    host: "localhost",
    port: 3306,
});

const sequelizeBaseError = require('sequelize/lib/errors').BaseError;

const Categories = sequelize.import(path.join(__dirname, '../models/categories'));
const Images = sequelize.import(path.join(__dirname, '../models/images'));

Categories.hasMany(Images, {foreignKey: 'category_id', targetKey: 'id'})
Images.belongsTo(Categories, {foreignKey: 'category_id', targetKey: 'id'});

const router = require('express').Router();

//CREATE TABLE `wallpages`.`categories` ( `id` INT UNSIGNED NOT NULL AUTO_INCREMENT , `name` VARCHAR(50) NOT NULL , `tags` TEXT NOT NULL , PRIMARY KEY (`id`), UNIQUE `category_name_uq` (`name`(50))) ENGINE = InnoDB;
//CREATE TABLE `wallpages`.`images` ( `id` INT UNSIGNED NOT NULL AUTO_INCREMENT , `fileName` TEXT NOT NULL , `tags` TEXT NOT NULL , `category_id` INT UNSIGNED NOT NULL , `created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , PRIMARY KEY (`id`)) ENGINE = InnoDB;
//ALTER TABLE `images` ADD CONSTRAINT `category_id_fk` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
// api.images?category=test&count=10&offset=0&tags[]=test&tags[]=pest

router.get('/', function (req, res, next) {
    console.log(req.query);

    const pathToStatics = `/images/`;

    Categories.findById( +req.query.category, { include: [{model: Images, required: true}], offset: +req.query.offset, limit: +req.query.count})
    .then(result => {
        let arr = [];
         console.log(result.get('id')); result.get('images').forEach(item => {
            console.log(item.dataValues);
            arr.push({
                id: item.get('id'),
                url: `${pathToStatics}${item.get('file')}`,
                minimizeUrl: `${pathToStatics}small/${item.get('file')}`
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
    Categories.findAll().then(result => {
        categoryGetRes(result, (resultForm) => {
            console.log(resultForm);
            resultForm.categories.forEach(item => console.log(item.tags))
            res.json(resultForm);
        })
    }).catch(err => next(err))
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