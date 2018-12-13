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
        } },
    });

    return Posts;
};