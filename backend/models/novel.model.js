const mongoose = require('mongoose');

const Novel = new mongoose.Schema({
	name: {
		type: String,
		unique: true,
		required: true,
		minlength: 3,
		trim: true
	},
	alias: { // slugified version of the name
		type: String,
		unique: true,
		minlength: 3,
		trim: true,
		sparse: true
	},
	image_url: { 
		type: String,
		default: "/static/dist/default.jpg"
	}, // image of the book
	raw_url: { type: String, trim: true }, // URL to the book
	description: { type: String, maxlength: 1000, trim: true },
},
{
	timestamps: true,
});



module.exports = mongoose.model('Novel', Novel);