//https://vk.com/album-174020407_0
//https://vk.com/public174020407
const fetch = require('node-fetch');
const request = require('request');

//https://pu.vk.com/c844520/upload.php?act=do_add&mid=120638804&aid=-14&gid=174020407&hash=dc3804e0d43a38d88f4798ebf58236a6&rhash=736bfa92f0111aa1593079f6d251cb7f&swfupload=1&api=1&wallphoto=1
//https://api.vk.com/method/photos.getUploadServer?album_id=-174020407_0&group_id=174020407

let token = '259529e526ad1833b2f2bb9849f20398f1dcc51698bf5aa30797922beb9b9d93a061f2dbec016f98fc908';
//let token = '053229300801c3f7ce3495ee886d1ffb836a0fe4b469733b414e02e3132199a57204d78c216cf80efad73';

let tokenGroup = '053229300801c3f7ce3495ee886d1ffb836a0fe4b469733b414e02e3132199a57204d78c216cf80efad73';

let gId = '174020407';
let aId = '257290508';

let cId = '6753227';
let scret = 'EWn0xSb2tHbVKamgESWq';

let rUrl = 'http://127.0.0.1:3000/vk/callback';


//let getServer = `https://api.vk.com/method/photos.getWallUploadServer?&group_id=${gId}&access_token=${token}&v=5.62`;

//let getServer = `https://api.vk.com/method/photos.getWallUploadServer?&album_id=${aId}&group_id=${gId}&access_token=${token}&v=5.62`;

let url = `https://oauth.vk.com/authorize?client_id=${cId}&display=page&scope=photos,audio,video,docs,notes,pages,status,offers,questions,wall,groups,messages,email,notifications,stats,ads,offline,docs,pages,stats,notifications&redirect_uri=https://oauth.vk.com/blank.html&response_type=token&v=5.63`;


const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

// const app = express();

// app.use(bodyParser.urlencoded({extended: false}));
// // parse application/json
// app.use(bodyParser.json());

// app.use(fileUpload());

// app.get('/', function(req, res, next) {
//     res.end(`<a href="${url}">VK</a>`);
// })


// app.get('/vk/callback', function(req, res, next) {
//     fetch(getServer)
//     .then(res => res.json())
//     .then(body => {
//         console.log(body);
//         res.json(body);
//     })
//     .catch(err => {
//         console.log('Promis error', err);
//         res.json(err);
//     })
// })

//app.listen(process.env.PORT || 3000);

//let getServer = `https://api.vk.com/method/photos.getUploadServer?&album_id=${aId}&group_id=${gId}&access_token=${token}&v=5.62`;

const FormData = require('form-data');
const fs = require('fs');
const path = require('path');


//console.log(form.getHeaders());

//console.log('form', form);




// })
// .then(res => res.json())
// .then(data => {
//     console.log(data);
//     let url = `https://api.vk.com/method/photos.save?album_id=${data.aid}&group_id=${data.gid}&server=${data.server}&hash=${data.hash}&photos_list=${data.photos_list}&access_token=${token}&v=5.62`
//     return fetch(url);
// })
// .then(res => res.json())
// .then(body => console.log(body))
// .catch(err => {
//     console.log('Promis error', err);
//     //res.json(err);
// })

//https://oauth.vk.com/blank.html#expires_in=0&access_token_174020407=4081fd82b6f8945475fd03435243c1633cd58a660bb5c138b0d0c1ae96555637fd5534ab1077c2288fed1
let message = "%23pimp";
let attachments = 'video-41492791_456239260';
let owner_id = '-174020407';

//let tok2 = 'https://oauth.vk.com/blank.html#expires_in=0&access_token_174020407=a3928f8e3b5b128621d72191391b6235bd7e5299222a117b9ae391d9dbbf9cac1112a9304cbcaa7fb7cfa';
//let tok3 = 'a3928f8e3b5b128621d72191391b6235bd7e5299222a117b9ae391d9dbbf9cac1112a9304cbcaa7fb7cfa';
//let tok4 = '40db3ada8e9889777adf455fa3e655ed212cdca8a9f395b9cd0fd6eee71ea1fa90d350ff42a247f62bb4d';
//let tok5 = 'f2dafd9e3d812797e86831544afba1d76a5229d6076ab3b75dd0ebafe6e9399f984d13248e859505440bc';
//let tok6 = '4081fd82b6f8945475fd03435243c1633cd58a660bb5c138b0d0c1ae96555637fd5534ab1077c2288fed1';

//let postUrl = `https://api.vk.com/method/wall.post?&owner_id=${owner_id}&message=${message}&attachments=${attachments}&from_group=1&v=5.67&access_token=${token}`;

//let url2 = "https://api.vk.com/api.php?oauth=1&method=wall.post&owner_id="+owner_id+"&message="+message+"&attachments="+attachments+"&v=5.67&access_token="+tokenGroup;

// fetch(postUrl)
// .then(res => res.json())
// .then(body => {
//     console.log(body)
//     console.dir(body.error.request_params);
//     //res.json(body);
// }).catch(err => {
//     console.log('Promis error', err);
//     //res.json(err);
// })


let file1 = fs.readFileSync(path.join(__dirname, './5.jpg'));
let file2 = fs.readFileSync(path.join(__dirname, './6.jpg'));

let form = new FormData();
form.append('file1', file1, {
    filename: '5.jpg', // ... or:
    filepath: path.join(__dirname, './5.jpg'),
    contentType: 'image/jpeg'
});
form.append('file2', file2, {
    filename: '6.jpg', // ... or:
    filepath: path.join(__dirname, './6.jpg'),
    contentType: 'image/jpeg'
});

let getServer = `https://api.vk.com/method/photos.getUploadServer?&album_id=${aId}&group_id=${gId}&access_token=${token}&v=5.62`;

fetch(getServer)
.then(res => res.json())
.then(body => {
    console.log('Upload url', body.response.upload_url);
    return body.response.upload_url;
})
.then(url => {
    return fetch(url, {
        method: 'POST',
        body:    form,
        headers: form.getHeaders(),
    })
})
.then(res => res.json())
.then(data => {
    console.log('Upload resp', data);
    let url = `https://api.vk.com/method/photos.save?album_id=${data.aid}&group_id=${data.gid}&server=${data.server}&hash=${data.hash}&photos_list=${data.photos_list}&access_token=${token}&v=5.62`
    return fetch(url);
})
.then(res => res.json())
.then(res => {
    console.log('Save', res);
    attachments  = res.response.map(photo => `photo${photo.owner_id}_${photo.id}`).join(',');
    console.log('Attacmnts',attachments);
    let postUrl = `https://api.vk.com/method/wall.post?&owner_id=${owner_id}&message=${message}&attachments=${attachments}&from_group=1&v=5.67&access_token=${token}`;
    return fetch(postUrl)
})
.then(res => res.json())
.then(post => console.log('Post', post))
.catch(err => {
    console.log('Promis error', err);
});