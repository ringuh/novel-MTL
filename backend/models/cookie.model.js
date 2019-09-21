module.exports = (seq, type) => {
    //const { Op } = require('sequelize');
    
    const Model = seq.define('Cookie', {
        id: {
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        key: {
            type: type.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
            lowercase: true
        },
        value: {
            type: type.TEXT,
            singlespace: true,
        },

    }, {
        timestamps: true,
    });

    Model.prototype.toJson = function () {
        let ret = this.dataValues


        return ret
    }

    Model.associate = models => {

        Model.belongsTo(models.User, {
            onDelete: "CASCADE",
            foreignKey: 'user_id',
            as: 'user',
            //allowNull: false
        })
    };
    return Model
}

