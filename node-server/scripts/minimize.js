const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

let folder = 'test';

const dest = path.join(__dirname, `../public/images/`);

fs.readdir(dest, function(err, results) {
    //console.log(arguments);
    for(let item of results) {
        if(!fs.lstatSync(path.join(dest, item)).isDirectory()) {
            
            fs.readFile(path.join(dest, item), function(err, buffer) {

                sharp(buffer).metadata()
                .then(metadata => sharp(buffer).resize(Math.round(metadata.width / 8), Math.round(metadata.height / 8)).toFile(path.join(__dirname, `../public/images/`, '/small/', item)))

            })

        }
    }
})