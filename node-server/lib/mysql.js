const Sequelize = require('sequelize');
const path = require('path');

const { postOnTime } = require('../funcs');

const sequelize = new Sequelize(process.env.CLEARDB_DATABASE_URL);

const Admins = sequelize.import(path.join(__dirname, '../models/admin'));
const Categories = sequelize.import(path.join(__dirname, '../models/categories'));
const Images = sequelize.import(path.join(__dirname, '../models/images'));
const Posts = sequelize.import(path.join(__dirname, '../models/posts'));

Categories.hasMany( Images, { foreignKey: 'category_id' } )
Images.belongsTo( Categories, { foreignKey: 'category_id', as: 'category' } );

Posts.hasMany( Images, { foreignKey: 'post_id' } )
Images.belongsTo( Posts, { foreignKey: 'post_id' } );


const force = !!process.env.forceTables;

sequelize.query('DROP TABLE IF EXISTS `images`')
Posts.sync({force}).then(() => Categories.sync({force}))
.then(() => Images.sync({force})).then(() => Admins.sync({force}))
.then(() => Admins.bulkCreate([ {vkid: process.env.vkGodAdminId}, {vkid: '217969540'}, {vkid: '281438517'}, {vkid: '279153611'} ]))
.then(() => postOnTime(Posts, Images, Categories))
.catch(err => console.error('ERROR in MYSQL', err));

exports.Admins = Admins;
exports.Categories = Categories;
exports.Images = Images;
exports.Posts = Posts;
exports.Op = Sequelize.Op;