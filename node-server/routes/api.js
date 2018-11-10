const path = require('path');
const fs = require('fs');

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

router.post('/upload', function(req, res, next) {
    console.log(req.body);
    req.body.filesData = JSON.parse(req.body.filesData);
    next();
}, function (req, res, next) {
    console.log('Work!', req.body, req.files);
    res.json({success: true});
});

router.post('/add/category', function(req, res, next) {
    let category = req.body.category;
    fs.mkdir(path.join(__dirname, `../public/images/${category}/`), function() {
        console.log(arguments);
        fs.mkdir(path.join(__dirname, `../public/images/${category}/small`), function(err) {
            console.log(arguments);
        })
    })
});

module.exports = router;