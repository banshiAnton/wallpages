const path = require('path');
const fs = require('fs');

const router = require('express').Router();

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