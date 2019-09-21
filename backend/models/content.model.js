module.exports = (seq, type) => {
    //const { Op } = require('sequelize');
    const Model = seq.define('Content', {
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
            singlespace: true,
            defaultValue: "",
        },
        content: {
            type: type.TEXT,
            singlespace: true,
            defaultValue: "",
        },
        quality: {
            type: type.INTEGER,
            validate: {
                min: 0,
                max: 5,
            }
        }

    }, {
        timestamps: true,
    });

    Model.prototype.toJson = function () {
        let ret = this.dataValues


        return ret
    }

    Model.associate = models => {

        Model.belongsTo(models.Chapter, {
            onDelete: "CASCADE",
            foreignKey: 'chapter_id',
            as: 'chapter',
            allowNull: false
        })
    };
    return Model
}

