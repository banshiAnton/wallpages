const path = require('path');
const Sequelize = require('sequelize');
const sequelize = new Sequelize('wallpages', 'root', '', {
    dialect: 'mysql',
    host: "localhost",
    port: 3306,
});

const Categories = sequelize.import(path.join(__dirname, '../models/categories'));
const Images = sequelize.import(path.join(__dirname, '../models/images'));

Categories.sync({force: false}).then(() => {
}).then((res) => {
    console.log(res);
    Images.sync({force: false}).then(() => {
    }).then((res) => {
        console.log(res);
        sequelize.close();
    }).catch(err => {
        console.error('ERROR in MYSQL',err);
    });
}).catch(err => {
    console.error('ERROR in MYSQL', err);
});
// Categories.hasMany(Images, {foreignKey: 'category_id', targetKey: 'id'})
// Images.belongsTo(Categories, {foreignKey: 'category_id'})

// Images.belongsTo(Categories, {foreignKey: 'category_id', targetKey: 'id'});

// Categories.findAll({ include: [{model: Images, required: true}], where: {
//     name: 'testcategory'
// }}).then(result => {
//     //console.log(result);
//     for(let img of result) { console.log(img.get('id')); img.get('images').forEach(item => console.log(item.dataValues)) };
//     sequelize.close();
// }).catch(err => console.log('Error', err));

// Categories.destroy({
//     where: {
//       id: 3
//     }
//   }).then(result => {
//     console.log(result);
// }).catch(err => console.log('Error', err));;