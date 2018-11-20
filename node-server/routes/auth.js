const router = require('express').Router();

router.post('/login', function(req, res, next) {
    if(req.body.pwd === process.env.pwd) {
        res.json({success: true, token: process.env.token})
    } else {
        res.json({success: false})
    }
})

router.get('/user', function(req, res, next) {
    if(req.header('auth') === process.env.token) {
        res.json({success: true})
    } else {
        res.json({success: false})
    }
});

module.exports = router;