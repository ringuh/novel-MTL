const mongoose = require('mongoose');

const Novel = new mongoose.Schema({
 name: { 
 	type: String, 
 	unique: true,
 	required: true,
 	minlength: 3,
 	trim: true
 },
 /*alias: { // slugified version of the name
 	type: String,
 	unique: true,
 	required: true,
 	minlength: 3,
 	trim: true
 },*/
 image_url: String, // image of the book
 raw_directory: String, // URL to the book
 raw_url: String, // URL to the first chapter
 description: { type: String, maxlength: 1000, trim: true },
 


});



module.exports = mongoose.model('Novel', Novel);