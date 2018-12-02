module.exports = (sequelize, DataTypes) => {
    const Admins = sequelize.define("admin", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        email: { type: DataTypes.STRING, unique: true, allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Name must be not empty"
                },
                isEmail: {
                    msg: "Email field must be email"
                }
            }
        }
    });

    return Admins;
};