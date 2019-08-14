const mongoose = require('mongoose');

const RootSchema = new mongoose.Schema({ 
    image_url: { type: String },
    description: { type: String },
    catalog: { type: String },
    chapters: { type: String },
})

const Raw = new mongoose.Schema({
    url: { 
        type: String,
        minlength: 1,
        trim: true,
    },
    next: { type: String },
    title: { type: String },
    content: { type: String },
    regex: { type: String },
    root: RootSchema,
    
},{
    timestamps: true,
});

module.exports = mongoose.model('Raw', Raw);

