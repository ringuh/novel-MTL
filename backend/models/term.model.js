

module.exports = (seq, type) => {
    //const { Op } = require('sequelize');

    const Model = seq.define('Term', {
        id: {
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        prompt: {
            type: type.BOOLEAN,
            defaultValue: false,
            allowNull: false,
            set(val) {
                if (this.getDataValue('to').includes('|')) val = true
                this.setDataValue('prompt', val)
            }
        },
        type: {
            type: type.STRING,
            validate: {
                notEmpty: true,
                isIn: [["raw", "proofread", "translation"]]
            },
            defaultValue: "translation",
            allowNull: false,
            lowercase: true
        },
        from: {
            type: type.TEXT,
            validate: {
                len: [1, 1000],
                notEmpty: true
            },
            allowNull: false,
            trim: true,
            set(val) {
                let arr = val.split("|").map(v => v.trim())
                arr.sort((a, b) => b.length - a.length)
                this.setDataValue('from', arr.join(" | "))
            }
        },
        to: {
            type: type.TEXT,
            validate: {
                len: [0, 1000],
            },
            allowNull: false,
            trim: true,
            singlespace: true,
            set(val) {
                if (val.includes("|"))
                    setTimeout(() => this.setDataValue('prompt', true), 2000)
                this.setDataValue("to", val)
            }
        }
    }, {
        timestamps: true,
    });

    Model.associate = models => {
        Model.belongsTo(models.Novel, {
            onDelete: "CASCADE",
            foreignKey: 'novel_id',
        }),
            Model.belongsTo(models.User, {
                onDelete: "CASCADE",
                foreignKey: 'user_id',
            })
    };
    return Model
}

