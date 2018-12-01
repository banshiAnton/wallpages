const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const FormData = require('form-data');

let token = '617238295:AAFmdgmHHH7742gVoNFrdBb6jpnU8EYzAaI';
let name = '@supercoollink';
let text = 'text from bot';

let p1 = fs.readFileSync(path.join(__dirname, '/../public/images/1542833487658_$RQ3M8LP.jpg'));
let p2 = fs.readFileSync(path.join(__dirname, '/../public/images/1542833414396_$RPQQNGT.jpg'));

let p3 = fs.readFileSync(path.join(__dirname, '/1.png'));

let form = new FormData();

let fID = 'AgADAgADCakxG-qR-UsGG00SpEE-pnL49A4ABICAKrvdSt0Ug9cBAAEC';

form.append('media', p3, {
    filename: '1.png',
    contentType: 'image/png'
});


console.log(form.getHeaders());
let formStr = JSON.stringify(form);

let file1 = {type: 'photo', media: 'attach://file'};
let file2 = {type: 'photo', media: 'attach://file'};

let media = JSON.stringify([file1, file2]);

let form2 = new FormData();

form2.append('file', p3, {
    filename: '1.png',
    contentType: 'image/png'
});

form2.append('chat_id', name);
form2.append('media', media);

console.log(form2.getHeaders());

// console.log(media);

//AgADAgADCakxG-qR-UsGG00SpEE-pnL49A4ABICAKrvdSt0Ug9cBAAEC
//?chat_id=${name}&text=${text}&media=${media}
fetch(`https://api.telegram.org/bot${token}/sendMediaGroup`, {
    method: "POST",
    body: form2,
    headers: form2.getHeaders(),
})
.then(res => res.json())
.then(res => console.log(res))
.catch(err => console.log('Error', err));