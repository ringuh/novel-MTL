module.exports = (sequelize, type) => {
    const Term = sequelize.define('Term', {
        id: {
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        prompt: {
            type: type.BOOLEAN,
            defaultValue: false
        },

        from: {
            type: type.STRING,
            validate: {
                len: [1, 100],
                notEmpty: true
            },
            allowNull: false,
            trim: true,
        },

        to: {
            type: type.TEXT,
            validate: {
                len: [0, 500],
            },
            allowNull: false,
            trim: true,
        }

    }, {
            timestamps: true,
        });

    Term.associate = models => {
        Term.belongsTo(models.Novel, {
            onDelete: "CASCADE",
            foreignKey: 'novel_id',
        }),
        Term.belongsTo(models.User, {
            onDelete: "CASCADE",
            foreignKey: 'novel_id',
        })
    };
    return Term
}
