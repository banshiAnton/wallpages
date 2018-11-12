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

const Categories = sequelize.import(path.join(__dirname, '../models/categories'));
const Images = sequelize.import(path.join(__dirname, '../models/images'));

const router = require('express').Router();

//CREATE TABLE `wallpages`.`categories` ( `id` INT UNSIGNED NOT NULL AUTO_INCREMENT , `name` VARCHAR(50) NOT NULL , `tags` TEXT NOT NULL , PRIMARY KEY (`id`), UNIQUE `category_name_uq` (`name`(50))) ENGINE = InnoDB;
//CREATE TABLE `wallpages`.`images` ( `id` INT UNSIGNED NOT NULL AUTO_INCREMENT , `fileName` TEXT NOT NULL , `tags` TEXT NOT NULL , `category_id` INT UNSIGNED NOT NULL , `created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , PRIMARY KEY (`id`)) ENGINE = InnoDB;
//ALTER TABLE `images` ADD CONSTRAINT `category_id_fk` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
// api.images?category=test&count=10&offset=0

router.get('/', function (req, res, next) {
    console.log(req.query);

    fs.readdir(path.join(__dirname, `../public/images/${req.query.category}/`), function(err, results) {

        if(err) return res.json({success: false});

        results.pop();//удаляем папку small

        let response = [];
        let i = req.query.offset || 0;

        if(i >= results.length) return res.json({success: false});

        for(let image of results.slice(req.query.offset, req.query.count || 10)) {
            response.push({
                url: `/${req.query.category}/${image}`,
                minimizeUrl: `/${req.query.category}/small/${image}`,
                index: ++i
            })
        }

        res.json({success: true, items: response});
    })
});

router.post('/upload', parseFilesData, groupFileDataToFiles, function (req, res, next) {
    saveImages(path.join(__dirname, `../public/images`), req.files.images, Images)
    .then(results => {
        console.log('End', results);
        res.json({success: true, results});
    })
    .catch(error => {
        console.log('Final error', error);
        res.json({success: false, error});
    })
});

router.get('/categories', function(req, res, next) {
    Categories.findAndCountAll().then(result => {
        categoryGetRes(result, (resultForm) => {
            console.log(resultForm);
            res.json(resultForm);
        })
    }).catch(err => {
        console.log('Error category get', err.errors[0]);
        res.json({success: false, error: err.errors[0]});
    })
});

router.post('/add/category', function(req, res, next) {
    let name = req.body.name;
    let tags = req.body.tags;
    console.log(name);
    Categories.create({name, tags}).then((result) => {
        console.log(result);
        // fs.mkdir(path.join(__dirname, `../public/images/${name}/`), function() {
        //     console.log(arguments);
        //     fs.mkdir(path.join(__dirname, `../public/images/${name}/small`), function(err) {
        //         console.log(arguments);
        //         res.json({success: true, name: result.get('name'), tags: result.get('tags')});
        //     })
        // });
        res.json({success: true, name: result.get('name'), tags: result.get('tags')});
    }).catch(err => {
        console.log('Error category', err.errors[0]);
        res.json({success: false, error: err.errors[0]});
    }) 
});

module.exports = router;