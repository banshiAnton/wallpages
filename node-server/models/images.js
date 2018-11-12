const path = require('path');
const Sequelize = require('sequelize');
const sequelize = new Sequelize( {
    dialect: 'mysql'
});

const Categories = sequelize.import(path.join(__dirname, '/categories.js'))

module.exports = (sequelize, DataTypes) => {
    const Images = sequelize.define("images", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        file: { type: DataTypes.STRING, unique: true, allowNull: false },
        createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        tags: { type: DataTypes.STRING, allowNull: false, 
            set(tagsArr) {
                this.setDataValue('tags', tagsArr.join(' '))
            },
            get() {
                return this.getDataValue('tags').split(' ');
            }
        },
        category_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Categories,
                key: 'id'
            },
            allowNull: false
        }
    });

    return Images;
}