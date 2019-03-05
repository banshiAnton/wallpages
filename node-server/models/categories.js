module.exports = (sequelize, DataTypes) => {
    return sequelize.define("categories", {

        vkId: {
            type: DataTypes.STRING,unique: false, allowNull: false, validate: {not: {args: ["\w",'i'], msg: "Name must contain digits"} }
        },

        okId: {
            type: DataTypes.STRING,unique: false, allowNull: false, validate: {not: {args: ["\w",'i'], msg: "Name must contain digits"} }
        },

        fbId: {
            type: DataTypes.STRING,unique: false, allowNull: false, validate: {not: {args: ["\w",'i'], msg: "Name must contain digits"} }
        },

        name: { type: DataTypes.STRING, unique: true, allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Name must be not empty"
                },
                not: {
                    args: ["[0-9 ]",'i'],
                    msg: "Name must not contain digits or spaces"
                },
                len: {
                    args: [3,30],
                    mgs: "Name min length is 3 and max is 30"
                }, 
            }
        },

        tags: { type: DataTypes.STRING, allowNull: false, 
            set(tagsArr) {
                this.setDataValue('tags', tagsArr.join(' '))
            },
            get() {
                return this.getDataValue('tags').length ? this.getDataValue('tags').split(' ') : [];
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
};