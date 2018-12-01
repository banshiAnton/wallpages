const router = require('express').Router();
const fetch = require('node-fetch');

router.get('/login', function(req, res, next) {
    // if(req.body.pwd === process.env.pwd) {
    //     res.json({success: true, token: process.env.token})
    // } else {
    //     res.json({success: false})
    // }
    console.log(req.query);
    let url = `https://oauth.vk.com/access_token?client_id=6753227&redirect_uri=http://localhost:3000/auth/login&client_secret=${'EWn0xSb2tHbVKamgESWq'}&code=${req.query.code}&v=5.92`;
    fetch(url)
    .then(data => data.json())
    .then(data => {
        console.log(data);
        let url = `https://api.vk.com/method/users.get?user_id=${data.user_id}&access_token=${data.access_token}&v=5.52`;
        return fetch(url);
    }).then(data => data.json())
    .then(data => {
        console.log(data);
        res.json(data)
    })
    .catch(err => console.log('Auth err', err));
    
})

router.get('/user', function(req, res, next) {
    if(req.header('auth') === process.env.token) {
        res.json({success: true})
    } else {
        res.json({success: false})
    }
});

module.exports = router;