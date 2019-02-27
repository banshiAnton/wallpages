const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser')
const path = require('path');
const fs = require('fs');

if (!fs.existsSync(path.join(__dirname, './static/images'))){
    fs.mkdirSync(path.join(__dirname, './static/images'));
    fs.mkdirSync(path.join(__dirname, './static/images/small'));
}

if(fs.existsSync(__dirname + '/.env')) {
    const env = require('node-env-file');
    env(__dirname + '/.env');
}

console.log('Folders', fs.readdirSync(path.join('/')));

const { errorHandle } = require('./middleware');

const app = express();

const apiRouter = require('./routes/api');
const authRouter = require('./routes/auth');

app.use(express.static(__dirname + '/public/'));
app.use(express.static(__dirname + '/static/'));

app.use(cookieParser());

app.use(bodyParser.urlencoded({extended: false}));
// parse application/json
app.use(bodyParser.json());

app.use(fileUpload());

app.use('/api.images', apiRouter);

app.use('/auth', authRouter);

app.use('/*', function(req, res, next) {
  res.sendFile(path.join(__dirname, '/public/index.html'));
})

app.use(function(error, req, res, next) {
    console.log('Error last', error);
    if ( errorHandle(error, req, res, next) ) {
        return;
    } else if ( error.redirect ) {
        return res.redirect('/admin/');
    }
    res.status(error.status || 200);
    res.json({message: error.message || 'error', success: false, error});
});

app.listen(process.env.PORT);