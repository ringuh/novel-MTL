module.exports = (seq, type) => {
    const { Op } = require('sequelize');

    const Model = seq.define('Chapter', {
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

        title: {
            type: type.VIRTUAL,
            get() {
                return `Chapter ${this.getDataValue('order')}`
            }
        }


    }, {
        timestamps: true,
    });

    Model.prototype.reOrder = function () {

        return seq.models.Chapter.findAll({
            where: {
                novel_id: this.novel_id,
                id: { [Op.not]: this.id },
                order: { [Op.gte]: this.order }
            },
            order: [["order", "ASC"],
            ["id", "ASC"]]
        }).then(chapters => {
            let runningNr = parseInt(this.order)
            chapters.forEach(c => {
                if (c.order === runningNr) {
                    ++runningNr
                    c.update({ order: runningNr }).then(c => c.save())
                }


            })

            return runningNr
        })


    }

    Model.prototype.toJson = function (length_only) {
        let ret = this.dataValues
        ret.title = this.title

        // LENGTH_ONLY drops the replaces content data with string length / paragraph count
        const conts = ['raw', 'baidu', 'sogou', 'proofread'].filter(c => ret[c])
        for (var i in conts) {
            ret.title = ret[conts[i]].title || ret.title
            
            if (length_only === "paragraphs")
                ret[conts[i]] = ret[conts[i]].content ? ret[conts[i]].content.split("\n").length : null
            else if (length_only)
                ret[conts[i]] = ret[conts[i]].content ? ret[conts[i]].content.length : null


        }

        return ret
    }

    Model.associate = models => {
        Model.belongsTo(models.Content, {
            as: 'raw',
            foreignKey: 'raw_id',
            //targetKey: 'id',
            constraints: false
        })

        Model.belongsTo(models.Content, {
            as: 'proofread',
            foreignKey: 'proofread_id',
            //targetKey: 'id',
            constraints: false
        })

        Model.belongsTo(models.Content, {
            as: 'sogou',
            foreignKey: 'sogou_id',
            //targetKey: 'id',
            constraints: false
        })

        Model.belongsTo(models.Content, {
            as: 'baidu',
            foreignKey: 'baidu_id',
            // targetKey: 'id',
            constraints: false
        })

        Model.belongsTo(models.Novel, {
            onDelete: "CASCADE",
            foreignKey: 'novel_id',
            as: 'novel',
            allowNull: false
        })
    };
    return Model
}

