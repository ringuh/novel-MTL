const mongoose = require('mongoose');

const Chapter = new mongoose.Schema({
    novelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Novel',
        required: true
    },
    chapterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chapter',
    },
    id: { 
        type: Number,
        default: 1,
    },
    type: {
        type: String,
        default: "raw",
    },
    url: {
        type: String,
        minlength: 10,
        trim: true,
    },

    title: {
        type: String,
        trim: true
    },
    content: {
        type: String,
        trim: true
    },
},{
    timestamps: true,
});

module.exports = mongoose.model('Chapter', Chapter);

