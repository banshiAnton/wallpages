const router = require('express').Router();
const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');
const path = require('path');

const { isAuth } = require('../middleware/');

const sequelize = new Sequelize(process.env.CLEARDB_DATABASE_URL);

const Admins = sequelize.import(path.join(__dirname, '../models/admin'));

Admins.sync({force: true})
.then(res => console.log(res))
.then(() => Admins.create({vkid: process.env.vkGodAdminId}))
.then(data => console.log(data.get('vkid')))
.catch(err => console.error('ERROR in MYSQL', err));

router.get('/login', function(req, res, next) {
    console.log(req.query);
    let url = `https://oauth.vk.com/access_token?client_id=${process.env.vkClientId}&redirect_uri=${process.env.rUrl}&client_secret=${process.env.vkClientSecret}&code=${req.query.code}&v=5.92`;
    fetch(url)
    .then(data => data.json())
    .then(data => {
        console.log(data);
        return Admins.findOne({ where: {vkid: data.user_id} })
        .then(result => {
            if(result) {
                jwt.sign(data, process.env.secretJWT, {algorithm: 'HS256'}, function(err, token) {
                    if(!err) {
                        res.cookie('admin_data', token, {path: '/', httpOnly: false, maxAge: 30 * 24 * 60 * 60 * 1000 })
                        res.redirect('/admin/');
                    }
                })
            }
        })
        .catch(err => {
            console.log('Auth err', err);
            next(err);
        });
    })
    .catch(err => {
        console.log('Auth err', err);
        next(err);
    });
})

//let url = `https://api.vk.com/method/users.get?user_id=${data.user_id}&access_token=${data.access_token}&fields=screen_name&v=5.52`;

router.post('/admin', function(req, res, next) {
    console.log(req.body);
    Admins.create({vkid: +req.body.vkid.trim()})
    .then((result) => {
        console.log(result);
        res.json({success: true});
    }).catch(err => next(err))
})

router.get('/admin', isAuth, function(req, res, next) {
    res.json({success: true})
});

router.get('/vkAuthLink', function(req, res, next) {
    res.json({link: `https://oauth.vk.com/authorize?client_id=${process.env.vkClientId}&display=page&redirect_uri=${process.env.rUrl}&scope=friends,notify,photos,audio,video,stories,pages,notes,status,wall,ads,offline,docs,groups,notifications,stats,email,market&response_type=code&v=5.92`});
});

router.get('/okAuthLink', function(req, res, next) {
    let scope = 'LONG_ACCESS_TOKEN,VALUABLE_ACCESS,PHOTO_CONTENT,GROUP_CONTENT';
    res.json({link: `https://connect.ok.ru/oauth/authorize?client_id=${process.env.okAppId}&scope=${scope}&response_type=code&redirect_uri=${process.env.okrUrl}`});
});

router.get('/okcb', function(req, res, next) {
    console.log(req.query);
    let url = `https://api.ok.ru/oauth/token.do?code=${req.query.code}&client_id=${process.env.okAppId}&client_secret=${process.env.okprKey}&redirect_uri=${process.env.okrUrl}&grant_type=authorization_code`
    fetch(url, { method: 'post' })
    .then(data => data.json())
    .then(data => {
        console.log('\n\n***Access***\n\n',data);
        process.env.okRToken = data.refresh_token;
        res.redirect('/admin/');
    })
    .catch(err => {
        console.log(err);
        res.json(err);
    })
});

router.get('/fbAuthLink', function(req, res, next) {
    res.json({link: `https://www.facebook.com/v3.2/dialog/oauth?client_id=${process.env.fbAppId}&redirect_uri=${process.env.fbRUrl}`});
});

router.get('/fbcb', function(req, res, next) {
    console.log(req, req.params, req.query);//req.query.code
    fetch(`https://graph.facebook.com/v3.2/oauth/access_token?
    client_id=${process.env.fbAppId}
    &redirect_uri=${process.env.fbRUrl}
    &client_secret=${process.env.fbAppSec}
    &code=${req.query.code}`)
    .then(data => data.json())
    .then(data => {
        console.log('GET token', data);
        return fetch(`https://graph.facebook.com/me
        ?fields=id,name
        &access_token=${data.access_token}`)
    }).then(data => data.json())
    .then(data => {
        console.log('Get user data', data);
        res.cookie('fb_data', data.name, {path: '/', httpOnly: false, maxAge: 30 * 24 * 60 * 60 * 1000 });
        res.redirect('/admin/');
    })
    .catch(err => {
        console.log(err);
        res.json(err);
    })
    //res.json({q: req.query, p: req.params});
})

module.exports = router;