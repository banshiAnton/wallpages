const path = require('path');
const nconf = require('nconf');

nconf.file({ file: path.join(__dirname, 'default.json') });

module.exports = nconf;