
const { Op } = require('sequelize');
module.exports = (sequelize, type) => {

    const Chapter = sequelize.define('Chapter', {
        id: {
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        /* raw_id: {
             type: type.INTEGER,
             references: {
               model: 'Contents',
               key: 'id'
             }
         }, */
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
            get () {
                return `Chapter ${this.getDataValue('order')}`
            }
          }


    }, {
        timestamps: true,
    });

    Chapter.prototype.reOrder = function () {
        
        return sequelize.models.Chapter.findAll({
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
                if(c.order === runningNr){
                    ++runningNr
                    c.update({order: runningNr}).then(c => c.save())
                }
                    
                
            })
            
            return runningNr
        })


    }

    Chapter.prototype.toJson = function (length_only) {
        let ret = this.dataValues
        ret.title = this.title
        
        // LENGTH_ONLY drops the replaces content data with string length / paragraph count
        const conts = ['raw', 'baidu', 'sogou', 'proofread'].filter(c => ret[c])
        for (var i in conts) {
            ret.title = ret[conts[i]].title || ret.title
            
            if (length_only === "paragraphs")
                ret[conts[i]] = ret[conts[i]].content ? ret[conts[i]].content.split("\n").length : null
            else if(length_only)
                ret[conts[i]] = ret[conts[i]].content ? ret[conts[i]].content.length : null
            
            
        }

        return ret
    }

    Chapter.associate = models => {
        /* Chapter.hasMany(models.Content, {
            as: 'contents',
            foreignKey: 'chapter_id',
            allowNull: false
        }) */
        Chapter.belongsTo(models.Content, {
            as: 'raw',
            foreignKey: 'raw_id',
            //targetKey: 'id',
            constraints: false
        })

        Chapter.belongsTo(models.Content, {
            as: 'proofread',
            foreignKey: 'proofread_id',
            //targetKey: 'id',
            constraints: false
        })

        Chapter.belongsTo(models.Content, {
            as: 'sogou',
            foreignKey: 'sogou_id',
            //targetKey: 'id',
            constraints: false
        })

        Chapter.belongsTo(models.Content, {
            as: 'baidu',
            foreignKey: 'baidu_id',
            // targetKey: 'id',
            constraints: false
        })


        /* Chapter.hasOne(models.Content, {
            as: 'raw',
            targetKey: 'raw_id',
            foreignKey: 'chapter_id',
            constraints: false
            //allowNull: false
        }) */

        /* Chapter.hasMany(models.Content, {
            as: 'proofread',
            targetKey: 'proofread_id',
            foreignKey: 'chapter_id',
            constraints: false
            //allowNull: false
        }) */






        Chapter.belongsTo(models.Novel, {
            onDelete: "CASCADE",
            foreignKey: 'novel_id',
            as: 'novel',
            allowNull: false
        })
    };
    return Chapter
}

