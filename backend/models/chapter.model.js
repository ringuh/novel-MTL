module.exports = (sequelize, type) => {

    const Chapter = sequelize.define('Chapter', {
        id: {
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        url: {
            type: type.STRING,
            trim: true,
            validate: {
                isUrl: true
            }
        },
        order: { type: type.INTEGER },
        raw: { type: type.JSON },
        title: {
            type: type.STRING,
        },
        sogou: {
            type: type.STRING,
        },
        baidu: {
            type: type.STRING,
        },
        proofread: {
            type: type.STRING,
        }
    }, {
            timestamps: true,
        });

    Chapter.associate = models => {
        Chapter.belongsTo(models.Novel, {
            onDelete: "CASCADE",
            foreignKey: 'novel_id',
            allowNull: false
        })
    };
    return Chapter
}

