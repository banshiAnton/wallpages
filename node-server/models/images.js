module.exports = (sequelize, DataTypes) => {
    return sequelize.define("images", {

        file: { type: DataTypes.STRING, unique: true, allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Name must be not empty"
                }
            }
        },

        tags: { type: DataTypes.STRING, allowNull: false, 
            set(tagsArr) {
                this.setDataValue('tags', tagsArr.join(' '))
            },
            get() {
                return this.getDataValue('tags') ? this.getDataValue('tags').split(' ') : [];
            }
        },

        mimetype: { type: DataTypes.STRING, defaultValue: 'image/jpeg', allowNull: false },

        isPublish: { type: DataTypes.BOOLEAN, defaultValue: false },

    });
}