const path = require('path');
const fs = require('fs');

const Sequelize = require('sequelize');

const { categoryGetRes, createAlbum, makePost, getPosts, getPost } = require('../funcs');

const { parseFilesData, makeApiQuery, isAuth, isInit } = require('../middleware');

const { Posts, Images, Categories } = require('../lib').mysql;

const router = require('express').Router();

const pathToStatics = `/images/`;

// api.images?category=test&count=10&offset=0&tags[]=test&tags[]=pest

router.get('/', makeApiQuery, function (req, res, next) {
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
            console.log(item.get('category_id'), item.get('file'));
        arr.push({
                id: item.get('id'),
                url: `${pathToStatics}${item.get('file')}`,
                minimizeUrl: fs.existsSync(path.join(__dirname, '../../static', pathToStatics, 'small', item.get('file'))) ? `${pathToStatics}small/${item.get('file')}` : `${pathToStatics}${item.get('file')}`,
                tags: item.get('tags'),
                category_id: item.get('category_id')
            })
        })
        res.json({success: true, results: arr});
    }).catch(err => next(err))
});

router.post('/upload', isAuth(), isInit(), parseFilesData, function (req, res, next) {
    console.log('Text', req.body);

    makePost(req.files.images, { Images, Posts, Categories }, {
        text: req.body.text ? req.body.text.trim() : '', publish_date: +req.body.publish_date,
        url: `${req.protocol}://${req.hostname}/images/`, appLinkId: req.body.appLinkId
    }).then(response => {
        console.log('Save post', response);
        res.json({ success: true, results: response.dataValues });
    }).catch(err => next(err))
});

router.get('/posts', function (req, res, next) {
    getPosts( Posts, Images )
    .then( posts => res.json( { success: true, posts } ) )
    .catch( error => {
        console.log( 'Posts error', error );
        res.json( { success: false, error } );
    } )
});

router.get('/post/:id', function (req, res, next) {
    getPost( req.params.id, Posts, Images )
    .then( post => res.json( { success: true, post } ) )
    .catch( error => {
        console.log( 'Post error', error );
        res.json( { success: false, error } );
    } )
});

router.get('/categories', function(req, res, next) {
    Categories.findAll()
    .then(result => categoryGetRes(result))
    .then(resultForm => {
        console.log(resultForm);
        res.json(resultForm);
    })
    .catch(err => next(err))
});

router.get('/lastTokenUpd', isInit(), function(req, res, next) {
    res.json({success: true, ok: process.env.okTokeLastUpd, fb: process.env.fbTokeLastUpd});
});


router.post('/add/category', isAuth(), function(req, res, next) {

    let name = req.body.name;
    let tags = req.body.tags;
    console.log(name, tags);

    createAlbum(name, tags, Categories)
    .then(data => {
        console.log(data);
        res.json({success: true, result: data.get('clientData')});
    })
    .catch(err => next(err))
    
});

router.put('/category/:id', isAuth(), isInit(), function(req, res, next) {
    console.log(req.params.id, req.body);
    Categories.findById(req.params.id)
    .then(categ => {
        return categ.update({
            tags: req.body.tags
        })
    }).then(data => {
        console.log('Updated', data);
        res.json({success: true, result: data.get('clientData')})
    })
    .catch(error => next(error))
});

router.get('/isInit', isAuth(), isInit(), function(req, res, next) {
    res.json({success: true});
});

module.exports = router;