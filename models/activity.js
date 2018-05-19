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
            type: DataTypes.INT,
            allowNull: false
        }
    });

    Activity.associate = function (models) {
        // We're saying that a Post should belong to an Author
        // A Post can't be created without an Author due to the foreign key constraint
        Activity.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }
        });
    };

    return Activity;
};