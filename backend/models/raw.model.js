module.exports = function (seq, type) {
    //const { Op } = require('sequelize');
    const Model = seq.define('Raw', {
        url: {
            type: type.STRING,
        },
        next: {
            type: type.STRING
        },
        title: {
            type: type.STRING
        },
        content: {
            type: type.STRING
        },
        regex: {
            type: type.STRING
        },
        root: {
            type: type.JSON,
/* 
            ROOT:{   
                image_url: { type: String },
                description: { type: String },
                catalog: { type: String },
                chapters: { type: String }
            } 
*/
        },

    }, {
        timestamps: true,
    });

    return Model
}

