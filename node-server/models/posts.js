module.exports = (sequelize, DataTypes) => {
    return sequelize.define("posts", {

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
        }
    });
};