const path = require('path');
const Sequelize = require('sequelize');
const sequelize = new Sequelize('wallpages', 'root', '', {
    dialect: 'mysql',
    host: "localhost",
    port: 3306,
});

const Categories = sequelize.import(path.join(__dirname, '../models/categories'));
const Images = sequelize.import(path.join(__dirname, '../models/images'));

// Categories.sync({force: true}).then(() => {
// }).then((res) => {
//     console.log(res);
//     Images.sync({force: true}).then(() => {
//     }).then((res) => {
//         console.log(res);
//         sequelize.close();
//     }).catch(err => {
//         console.error('ERROR in MYSQL',err);
//     });
// }).catch(err => {
//     console.error('ERROR in MYSQL', err);
// });
Categories.hasMany(Images, {foreignKey: 'category_id'})
Images.belongsTo(Categories, {foreignKey: 'category_id'})

Images.findAll({ include: [{model: Categories, required: true}]}).then(result => {
    console.log(result);
}).catch(err => console.log('Error', err));
