const mongoose = require('mongoose');

const User = new mongoose.Schema({
  name: { 
  	type: String, 
  	required: false, 
  	unique: true
  },
  googleId: {
    type: String,
    required: true,
    unique: true
  },

  user_class: { type: String },
  date_created: { type: Date, required: true },
  last_login: { type: Date, required: false },
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', User);

