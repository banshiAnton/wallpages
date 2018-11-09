const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const path = require('path');

const app = express();

const apiRouter = require('./routes/api');

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({extended: false}));
// parse application/json
app.use(bodyParser.json());

app.use(fileUpload());

app.post('/upload', function (req, res, next) {
  req.body.filesData = JSON.parse(req.body.filesData);
  next();
},function (req, res, next) {
  console.log('Work!', req.body, req.files);
  res.json({success: true});
});

app.use('/api.images', apiRouter);

app.use('/*', function(req, res, next) {
  res.sendFile(path.join(__dirname, '/public/index.html'));
})

app.use(function(err, req, res, next) {

    console.log('Error last', err);

    res.status(err.status || 500);
    res.json({message: err.message || 'error'});
  });

app.listen(process.env.PORT || 3000);