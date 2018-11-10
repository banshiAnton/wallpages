const path = require('path');
const Sequelize = require('sequelize');
const sequelize = new Sequelize( {
    dialect: 'mysql'
});

const Categories = sequelize.import(path.join(__dirname, '/categories.js'))

// const Images = sequelize.define('images', {
//     id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         primaryKey: true,
//         allowNull: false
//     },
//     file: { type: Sequelize.STRING, unique: true, allowNull: false },
//     createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
//     tags: { type: Sequelize.STRING, allowNull: false },
//     category_id: {
//         type: Sequelize.INTEGER,
//         references: {
//             model: Categories,
//             key: 'id'
//         }
//     }
// });

module.exports = (sequelize, DataTypes) => {
    return sequelize.define("images", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        file: { type: DataTypes.STRING, unique: true, allowNull: false },
        createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        tags: { type: DataTypes.STRING, allowNull: false },
        category_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Categories,
                key: 'id'
            }
        }
    })
}