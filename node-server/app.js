const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser')
const path = require('path');
const fs = require('fs');

if (!fs.existsSync(path.join(__dirname, './public/images'))){
    fs.mkdirSync(path.join(__dirname, './public/images'));
    fs.mkdirSync(path.join(__dirname, './public/images/small'));
}

// const env = require('node-env-file');
// env(__dirname + '/.env');

//console.log(process.env)

const { errorHandle } = require('./middleware');

const app = express();

const apiRouter = require('./routes/api');
const authRouter = require('./routes/auth');

app.use(express.static(__dirname + '/public/'));

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

app.use(function(err, req, res, next) {
    console.log('Error last', err);
    if(errorHandle(err, req, res, next)) {
        return;
    }
    res.status(err.status || 500);
    res.json({message: err.message || 'error'});
});

app.listen(process.env.PORT || 3000);