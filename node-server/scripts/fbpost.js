const FB = require('fb');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const fetch = require('node-fetch');
const express = require('express');

const app = express();

FB.options({version: 'v3.2'});

let appId = '2003681286592482';
let appSecret = 'a63c25cef4dfe415879c493058fafca5';
let gId = '289420848357181';
let rUrl = 'http://localhost:3000/cb';

// let app_fb = FB.extend({appId: appId, appSecret: appSecret});

let tokenApp = '2228257290791812|ieMCBCVEQGE0mZSKy2i4taOKdiU';
let token = 'EAAflqFgKteIBAOjSVmZB0HJlBTx3RhXEzWE3zHZC2JptfpNS8AlZC6fXaBnCVubk8JN7l4FuRDZAQELzNy67sjfCeBTyu9jxROd4XDJxS3LU7HgcFXIsZAu8ozcDZANwc0xdrcedeWJZBZBr1HrZC8EVvkhrPKaJdbwIKeAyD9z1nzsBq3UXsETpH60EYX89eGlFFckkMy4iopwZDZD';

let url = 'https://images.pexels.com/photos/46710/pexels-photo-46710.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';


// let form = new FormData();

FB.setAccessToken(token);


// let photoBuffer1 = fs.readFileSync(path.join(__dirname, '/../public/images/1542833487658_$RQ3M8LP.jpg'));
// let photoBuffer2 = fs.readFileSync(path.join(__dirname, '/../public/images/1542833414396_$RPQQNGT.jpg'));
// let photoBuffer3 = fs.readFileSync(path.join(__dirname, '/../public/images/1542838905245_$RJ94NZT.jpg'));

// form.append('file3', photoBuffer3, {
//     filepath: path.join(__dirname, '/../public/images/1542833414396_$RPQQNGT.jpg'),
//     contentType: 'image/jpeg'
// });

// form.append('message', "test post");

// fetch(`https://graph.facebook.com/v3.2/${gId}/photos?access_token=${token}`, {
//     method: 'POST',
//     body:   form,
//     headers: form.getHeaders(),
// }).then(res => res.json())
// .then(res => console.log(res))
// .catch(err => console.log('Error post', err))

let alId = '289794064986526';
let pId = '289793524986580';

// FB.api(`${gId}/feed`, 'post', { message: "test post shedul"}, function(res) {
//     console.log(res);
// });

app.get('/', function(req ,res ,next) {
    res.end(`<a href="https://www.facebook.com/v3.2/dialog/oauth?
    client_id=${appId}
    &redirect_uri=${rUrl}">Test</a>`);
});

app.get('/cb', function(req ,res, next) {
    res.end('cb');
});

app.listen(3000);

  //child_attachments: ['https://www.facebook.com/photo.php?fbid=199012910978830','https://www.facebook.com/photo.php?fbid=199012577645530']