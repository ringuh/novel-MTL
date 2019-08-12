const mongoose = require('mongoose');

const User = new mongoose.Schema({
  name: { 
  	type: String, 
  	sparse: true, 
  	unique: true
  },
  googleId: {
    type: String,
    required: true,
    unique: true
  },
  icon: { 
    type: String,
    trim: true
  },
  user_class: { type: String },

  last_login: { type: Date, required: false },
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', User);

