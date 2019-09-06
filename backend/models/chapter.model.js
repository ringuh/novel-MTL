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
        order: { type: type.INTEGER, defaultValue: 1 },
        /* raw: { type: type.JSON },
        sogou: { type: type.JSON },
        baidu: { type: type.JSON }, */

        //title: { type: type.STRING },
        //content: { type: type.TEXT },
    }, {
            timestamps: true,
        });
    Chapter.prototype.getContent = function(type) {
        if(type) return this.contents.find(cont => cont.type == type)
        return this.contents
    }

    Chapter.associate = models => {
        Chapter.hasMany(models.Content, {
            as: 'contents',
            foreignKey: 'chapter_id',
            allowNull: false
        })
        Chapter.belongsTo(models.Novel, {
            onDelete: "CASCADE",
            foreignKey: 'novel_id',
            as: 'novel',
            allowNull: false
        })
    };
    return Chapter
}

