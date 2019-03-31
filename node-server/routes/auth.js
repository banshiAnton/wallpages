const router = require('express').Router();
const fetch = require('node-fetch');

const FormData = require('form-data');

const { isAuth } = require('../middleware/');

const { vkAuthCB, makeSetup } = require('../funcs');

const { Categories, Admins, Op } = require('../lib').mysql;

router.post('/admin', function(req, res, next) {
    console.log('Post Admin Data', req.body);
    Admins.create({vkid: +req.body.vkid.trim()})
    .then(result => {
        console.log('Admin Saved', result);
        res.json({success: true});
    }).catch(err => next(err))
});

router.delete('/admin/:id', isAuth(true), function(req, res, next) {
    console.log('Params', req.params.id);
    Admins.destroy({
        where: {
            id: req.params.id
        }
    }).then(result => {
        console.log('Result del', result);
        res.json({success: true});
    })
    .catch(err => next(err))
})

router.get('/admins', isAuth(true), function(req, res, next) {
    Admins.findAll({
        where: {
            vkid: {
                [Op.ne]: process.env.vkGodAdminId
            }
        }
    })
    .then(admins => {
        console.log(admins);
        admins.map(user => {
            return {
                id: user.get('id'),
                vkid: user.get('vkid')
            }
        });
        res.json({admins, success: true});
    }).catch(err => next(err))
});

router.get('/admin', isAuth(), function(req, res, next) {
    res.json({success: true});
});

router.get('/isMainAdmin', isAuth(true), function(req, res, next) {
    res.json({success: true});
});

router.get('/authLinks', function(req, res, next) {

    let OKScope = 'LONG_ACCESS_TOKEN,VALUABLE_ACCESS,PHOTO_CONTENT,GROUP_CONTENT';
    let FBScope = 'groups_access_member_info,publish_to_groups';
    // let VKScope = 'friends,notify,photos,audio,video,stories,pages,notes,status,wall,ads,offline,docs,groups,notifications,stats,email,market';
    // let INSTScope = 'basic+likes+public_content';
    let VKScope = 'friends,photos,pages,status,offline,groups,stats,email';

    res.json({
        vk: `https://oauth.vk.com/authorize?client_id=${process.env.vkClientId}&display=page&redirect_uri=${process.env.rUrl}&scope=${VKScope}&response_type=code&v=5.92`,
        ok: `https://connect.ok.ru/oauth/authorize?client_id=${process.env.okAppId}&scope=${OKScope}&response_type=code&redirect_uri=${process.env.okrUrl}`,
        fb: `https://www.facebook.com/v3.2/dialog/oauth?client_id=${process.env.fbAppId}&redirect_uri=${process.env.fbRUrl}&scope=${FBScope}`,
        // inst: `https://api.instagram.com/oauth/authorize/?client_id=${process.env.instAppId}&redirect_uri=${process.env.instRUrl}&response_type=code&scope=${INSTScope}`
    })
});

router.get('/vkcb', function(req, res, next) {
    console.log(req.query);
    let url = `https://oauth.vk.com/access_token?client_id=${process.env.vkClientId}&redirect_uri=${process.env.rUrl}&client_secret=${process.env.vkClientSecret}&code=${req.query.code}&v=5.92`;
    fetch(url)
    .then(data => data.json())
    .then(data => vkAuthCB(data, Admins))
    .then(token => {
        res.cookie('admin_data', token, {path: '/', httpOnly: false, maxAge: 30 * 24 * 60 * 60 * 1000 })
        res.redirect('/admin/');
    })
    .catch(err => {
        console.log('Auth err', err);
        err.redirect = true;
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
        if(!data.refresh_token) {
            throw data;
        }
        process.env.okRToken = data.refresh_token;
        process.env.okTokeLastUpd = Date.now() + '';
        res.redirect('/admin/setup/');
    })
    .catch(err => {
        console.log(err);
        err.redirect = true;
        next(err);
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
        if(!data.access_token) {
            throw data;
        }
        process.env.fbToken = data.access_token;
        process.env.fbTokeLastUpd = Date.now() + '';
        
    }).then(() => fetch(`https://graph.facebook.com/v3.2/me?access_token=${process.env.fbToken}`))
    .then(data => data.json())
    .then(data => res.cookie('fb_info', JSON.stringify(data), {path: '/', httpOnly: false, maxAge: 30 * 24 * 60 * 60 * 1000 }))
    .then(() => res.redirect('/'))
    .catch(err => {
        console.log(err);
        err.redirect = true;
        next(err);
    })
});

// router.get('/instcb', function(req, res, next) {
//     console.log('Insta code', req.query);

//     let  body = new FormData();
//     body.append('client_id', process.env.instAppId);
//     body.append('grant_type', 'authorization_code');
//     body.append('redirect_uri', process.env.instRUrl);
//     body.append('client_secret', process.env.instAppSec);
//     body.append('code', req.query.code);

//     fetch(`https://api.instagram.com/oauth/access_token`, {method: 'post', body})
//     .then(data => data.json())
//     .then(data => {
//         console.log('Insta data', data, data.access_token);
//         res.redirect('/admin/setup/');
//     })
//     .catch(err => {
//         console.log(err);
//         res.json(err);
//     })
// });

router.get('/makeSetup', isAuth(), function(req, res, next) {

    console.log(process.env.isInit, !!process.env.isInit);

    if(!process.env.vktoken || !process.env.okRToken || !process.env.fbToken) {
        return next({success: false, message: 'Нет всех токенов'});
    } else if(!!process.env.isInit) {
        return next({success: false, message: 'Уже инициализировано'});
    }

    makeSetup(Categories)
    .then(data => {
        let results = [];
        data.forEach(item => {
            console.log(item.get('name'), item.get('vkId'), item.get('okId'), item.get('fbId'), item.get('tags'));
            results.push({name: item.get('name'), vkId: item.get('vkId'), okId: item.get('okId'), fbId: item.get('fbId'), tags: item.get('tags')});
        });
        process.env.isInit = true;
        res.json({results, success: true});
    })
    .catch(err => {
        console.error('ERROR in MYSQL', err);
        next(err);
    });
});

module.exports = router;