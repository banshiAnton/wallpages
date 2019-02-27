const Sequelize = require('sequelize');
const path = require('path');

const { postOnTime } = require('../funcs');

const sequelize = new Sequelize(process.env.CLEARDB_DATABASE_URL);

const Admins = sequelize.import(path.join(__dirname, '../models/admin'));
const Categories = sequelize.import(path.join(__dirname, '../models/categories'));
const Images = sequelize.import(path.join(__dirname, '../models/images'));
const Posts = sequelize.import(path.join(__dirname, '../models/posts'));

let force = !!process.env.forceTables;

Posts.sync({force})
.then(() => sequelize.query('DROP TABLE `images`'))
.then(() => Categories.sync({force}))
.then(() => Images.sync({force}))
.then(() => {
    Categories.hasMany(Images, {foreignKey: 'category_id', sourceKey: 'id'})
    Images.belongsTo(Categories,{foreignKey: 'category_id', targetKey: 'id'});
    postOnTime(Posts, path.join(__dirname, `../../static/images`));
})
.catch(err => console.error('ERROR in MYSQL', err));

exports.Admins = Admins;
exports.Categories = Categories;
exports.Images = Images;
exports.Posts = Posts;
exports.Op = Sequelize.Op;
