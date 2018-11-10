const Sequelize = require('sequelize');
const sequelize = new Sequelize( {
    dialect: 'mysql'
});

// const Categories = sequelize.define('categories', {
//     id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         primaryKey: true,
//         allowNull: false
//     },
//     name: { type: Sequelize.STRING, unique: true, allowNull: false },
//     tags: { type: Sequelize.STRING, allowNull: false },
// });

module.exports = (sequelize, DataTypes) => {
    return sequelize.define("categories", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        name: { type: DataTypes.STRING, unique: true, allowNull: false },
        tags: { type: DataTypes.STRING, allowNull: false },
    })
}