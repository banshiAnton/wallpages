// const Sequelize = require('sequelize');
// const sequelize = new Sequelize( {
//     dialect: 'mysql'
// });

module.exports = (sequelize, DataTypes) => {
    const Categories = sequelize.define("categories", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        name: { type: DataTypes.STRING, unique: true, allowNull: false },
        tags: { type: DataTypes.STRING, allowNull: false, 
            set(tagsArr) {
                this.setDataValue('tags', tagsArr.join(' '))
            },
            get() {
                return this.getDataValue('tags').split(' ');
            }
        }
    }, {
        getterMethods: {
            clientData() {
                return {
                    id: this.get('id'),
                    name: this.get('name'), 
                    tags: this.get('tags')
                }
            }
        }
    });

    return Categories;
};