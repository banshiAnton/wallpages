module.exports = (sequelize, DataTypes) => {
    const Posts = sequelize.define("posts", {
        pTime: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        jsonData: { type: DataTypes.TEXT, allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Name must be not empty"
                }
        }, set(data) {
            this.setDataValue('jsonData', JSON.stringify(data))
        },
        get() {
            return JSON.parse(this.getDataValue('jsonData'));
        }},
    });

    return Posts;
};