const router = require('express').Router();
const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');
const path = require('path');

const FormData = require('form-data');

const { isAuth } = require('../middleware/');

const { getAlbums } = require('../funcs');

const { Posts, Images, Categories, Admins } = require('../mysqllib');

let makeSetup = () => getAlbums()
                     .then(bToCreate => Categories.bulkCreate(bToCreate))
                     .then(() => Categories.findAll());


Admins.sync({force: true})
.then(res => console.log(res))
.then(() => Admins.create({vkid: process.env.vkGodAdminId}))
.then(data => console.log(data.get('vkid')))
.catch(err => console.error('ERROR in MYSQL', err));

router.post('/admin', function(req, res, next) {
    console.log('Post Admin Data', req.body);
    Admins.create({vkid: +req.body.vkid.trim()})
    .then(result => {
        console.log('Admin Saved', result);
        res.json({success: true});
    }).catch(err => next(err))
})

router.get('/admin', isAuth, function(req, res, next) {
    res.json({success: true})
});

router.get('/authLinks', function(req, res, next) {

    let OKScope = 'LONG_ACCESS_TOKEN,VALUABLE_ACCESS,PHOTO_CONTENT,GROUP_CONTENT';
    let FBScope = 'groups_access_member_info,publish_to_groups';
    let VKScope = 'friends,notify,photos,audio,video,stories,pages,notes,status,wall,ads,offline,docs,groups,notifications,stats,email,market';
    let INSTScope = 'basic,public_content,likes';

    res.json({
        vk: `https://oauth.vk.com/authorize?client_id=${process.env.vkClientId}&display=page&redirect_uri=${process.env.rUrl}&scope=${VKScope}&response_type=code&v=5.92`,
        ok: `https://connect.ok.ru/oauth/authorize?client_id=${process.env.okAppId}&scope=${OKScope}&response_type=code&redirect_uri=${process.env.okrUrl}`,
        fb: `https://www.facebook.com/v3.2/dialog/oauth?client_id=${process.env.fbAppId}&redirect_uri=${process.env.fbRUrl}&scope=${FBScope}`,
        inst: `https://api.instagram.com/oauth/authorize/?client_id=${process.env.instAppId}&redirect_uri=${process.env.instRUrl}&scope=${INSTScope}&response_type=code`
    })
});

router.get('/vkcb', function(req, res, next) {
    console.log(req.query);
    let url = `https://oauth.vk.com/access_token?client_id=${process.env.vkClientId}&redirect_uri=${process.env.rUrl}&client_secret=${process.env.vkClientSecret}&code=${req.query.code}&v=5.92`;
    fetch(url)
    .then(data => data.json())
    .then(data => {
        console.log('VK TOKEN', data);
        return Admins.findOne({ where: {vkid: data.user_id} })
        .then(result => {
            if(result) {
                // process.env.vktoken = data.access_token;
                console.log('SET NEW VK TOKEN', process.env.vktoken);
                jwt.sign(data, process.env.secretJWT, {algorithm: 'HS256'}, function(err, token) {
                    if(!err) {
                        res.cookie('admin_data', token, {path: '/', httpOnly: false, maxAge: 30 * 24 * 60 * 60 * 1000 })
                        res.redirect('/admin/setup/');
                    }
                })
            }
        })
    })
    .catch(err => {
        console.log('Auth err', err);
        next(err);
    });
})


router.get('/okcb', function(req, res, next) {
    console.log(req.query);
    let url = `https://api.ok.ru/oauth/token.do?code=${req.query.code}&client_id=${process.env.okAppId}&client_secret=${process.env.okprKey}&redirect_uri=${process.env.okrUrl}&grant_type=authorization_code`
    fetch(url, { method: 'post' })
    .then(data => data.json())
    .then(data => {
        console.log('OK TOKEN', data);
        process.env.okRToken = data.refresh_token;
        res.redirect('/admin/setup/');
    })
    .catch(err => {
        console.log(err);
        res.json(err);
    })
});

router.get('/fbcb', function(req, res, next) {
    console.log(req.query);
    fetch(`https://graph.facebook.com/v3.2/oauth/access_token?client_id=${process.env.fbAppId}&redirect_uri=${process.env.fbRUrl}&client_secret=${process.env.fbAppSec}&code=${req.query.code}`)
    .then(data => data.json())
    .then(data => {
        console.log('FB TOKEN', data);
        return fetch(`https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.fbAppId}&client_secret=${process.env.fbAppSec}&fb_exchange_token=${data.access_token}`)
    }).then(data => data.json())
    .then(data => {
        console.log('FB long-live-TOKEN', data);
        process.env.fbToken = data.access_token;
        res.cookie('fb_data', data.access_token, { path: '/', httpOnly: false, maxAge: 30 * 24 * 60 * 60 * 1000 });
        res.redirect('/admin/setup/');
    })
    .catch(err => {
        console.log(err);
        res.json(err);
    })
});

router.get('/instcb', function(req, res, next) {
    console.log('Insta code', req.query);

    let  body = new FormData();
    body.append('client_id', process.env.instAppId);
    body.append('grant_type', 'authorization_code');
    body.append('redirect_uri', process.env.instRUrl);
    body.append('client_secret', process.env.instAppSec);
    body.append('code', req.query.code);

    fetch(`https://api.instagram.com/oauth/access_token`, {method: 'post', body})
    .then(data => data.json())
    .then(data => {
        console.log('Insta data', data, data.access_token);
        res.redirect('/admin/setup/');
    })
    .catch(err => {
        console.log(err);
        res.json(err);
    })
});

router.get('/makeSetup', isAuth, function(req, res, next) {
    makeSetup()
    .then(data => {
        data.forEach(item => {
            console.log(item.get('name'), item.get('vkId'), item.get('okId'), item.get('fbId'), item.get('tags'));
        });
        res.redirect('/admin/');
    })
    .catch(err => {
        console.error('ERROR in MYSQL', err);
        res.json({error: err, success: false});
    });
});

module.exports = router;