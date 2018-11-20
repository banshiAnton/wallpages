const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

let folder = 'test';

const dest = path.join(__dirname, `../public/images/${folder}`);

fs.readdir(dest, function(err, results) {
    //console.log(arguments);
    for(let item of results) {
        if(!fs.lstatSync(path.join(dest, item)).isDirectory()) {
            
            fs.readFile(path.join(dest, item), function(err, buffer) {

                sharp(buffer).
                    resize(600, 340)
                    .toFile(path.join(dest, '/small/', item), function() {
                        console.log(arguments);
                    })

            })

        }
    }
})