module.exports = function (seq, type) {


    /* 
    ROOT:{   
        image_url: { type: String },
        description: { type: String },
        catalog: { type: String },
        chapters: { type: String }
   } 
   */

    const Raw = seq.define('Raw', {
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
            type: type.JSON
        },

    }, {
            timestamps: true,
        });

    return Raw
}

