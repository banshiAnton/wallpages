module.exports = (sequelize, DataTypes) => {
    const Posts = sequelize.define("posts", {

        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        publish_date: {
            type: DataTypes.STRING,
            allowNull: false
        },

        text: {
            type: DataTypes.STRING
        },

        appLinkId: {
            type: DataTypes.ENUM,
            allowNull: false,
            values: ['0', '1', '2']
        },

        images: { type: DataTypes.TEXT, allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Name must be not empty"
                }
        }, set(data) {
            this.setDataValue('images', JSON.stringify(data))
        },
        get() {
            return JSON.parse(this.getDataValue('images'));
        }},
    });

    return Posts;
};