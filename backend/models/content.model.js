module.exports = (sequelize, type) => {

    const Content = sequelize.define('Content', {
        id: {
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        chapter_id: {
            type: type.INTEGER,
            references: {
                model: 'Chapters',
                key: 'id'
            },
            allowNull: false
        },
        type: {
            type: type.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                isIn: [['raw', 'proofread', 'baidu', 'sogou']]
            },
            lowercase: true
        },
        title: {
            type: type.STRING,
            singlespace: true
        },
        content: {
            type: type.TEXT,
            singlespace: true,
            /* set(val) {
                const sanitizeHtml = require('sanitize-html')
                val = val.replace(/ {2,}/g, ' ')
                    .replace(/\n{2,}/g, '\n')
                val = val.split("\n").filter(p => p.trim().length > 0)
                val = val.map(p => p.trim().replace(/\s+/g, ' ')).join("\n")
                this.setDataValue('content', sanitizeHtml(val, { allowedTags: [] }))
            } */
        },
    }, {
        timestamps: true,
    });

    Content.prototype.toJson = function () {
        let ret = this.dataValues


        return ret
    }

    Content.associate = models => {

        Content.belongsTo(models.Chapter, {
            onDelete: "CASCADE",
            foreignKey: 'chapter_id',
            as: 'chapter',
            allowNull: false
        })
    };
    return Content
}

