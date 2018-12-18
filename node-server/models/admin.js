module.exports = (sequelize, DataTypes) => {
    const Admins = sequelize.define("admin", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        vkid: { type: DataTypes.STRING, unique: true, allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Name must be not empty"
                }
            }
        }
    });

    return Admins;
};