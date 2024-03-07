// user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true,
    required: true,
  },
  name: String,
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        return /\S+@\S+\.\S+/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`,
    },
  },
  role: { type: String, enum: ['advertiser', 'publisher'], default: 'publisher' },
  websiteUrl: String,
  isAdvertiser: { type: Boolean, default: false },
});

module.exports = mongoose.model('User', userSchema);


