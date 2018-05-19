module.exports = function (sequelize, DataTypes) {
    var Activity = sequelize.define("Activity", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
        },
        time: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });

    Activity.associate = function (models) {
        Activity.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }
        });
    };

    return Activity;
};