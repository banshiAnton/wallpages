const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const path = require('path');

const app = express();

const sequelizeBaseError = require('sequelize/lib/errors').BaseError;

const apiRouter = require('./routes/api');

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({extended: false}));
// parse application/json
app.use(bodyParser.json());

app.use(fileUpload());

app.use('/api.images', apiRouter);

app.use('/*', function(req, res, next) {
  res.sendFile(path.join(__dirname, '/public/index.html'));
})

app.use(function(err, req, res, next) {
    console.log('Error last', err);
    let obj = {sucess: false, errors: []}
    if(err instanceof sequelizeBaseError) {
        for(let error of err.errors) {
            obj.errors.push({message: error.message, key: error.path, value: error.value})
        }

        return res.json(obj);
    }
    res.status(err.status || 500);
    res.json({message: err.message || 'error'});
  });

app.listen(process.env.PORT || 3000);