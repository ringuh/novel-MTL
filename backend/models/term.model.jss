const mongoose = require('mongoose');

const TermSchema = new mongoose.Schema({ value: { type: String, trim: true, default: "" }})

const Term = new mongoose.Schema({
    novelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Novel',
    },
    /* userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }, */
    prompt: { type: Boolean, default: false },

    string: {
        type: String,
        minlength: 1,
        trim: true,
    },

    terms: [TermSchema],
    
},{
    timestamps: true,
});

module.exports = mongoose.model('Term', Term);

