module.exports = (sequelize, DataTypes) => {
    return sequelize.define("admin", {

        vkid: { type: DataTypes.STRING, unique: true, allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Name must be not empty"
                }
            }
        }
    });
};