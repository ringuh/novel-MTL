module.exports = (sequelize, type) => {

    const Content = sequelize.define('Content', {
        id: {
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true,
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
            singlespace: true,
        },
        content: { 
            type: type.TEXT,
            singlespace: true,
        },
    }, {
            timestamps: true,
        });

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

