// ad.js
const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
  title: String,
  description: String,
  imageUrl: String,
  linkUrl: String,
  type: {
    type: String,
    enum: ['native', 'banner', 'interstitial', 'app open', 'rewarded interstitial'],
    default: 'banner',
  },
  isActive: { type: Boolean, default: true },
  requests: { type: Number, default: 0 },
  impressions: { type: Number, default: 0 },
  budget: { type: Number, default: 0 },
  moneySpent: { type: Number, default: 0 },
  tags: {
    type: [String],
    validate: {
      validator: function(v) {
        return v.length > 0 && v.length <= 5;
      },
      message: 'Tags must be an array of length 1 to 5',
    },
    required: true,
  },
  adId: {
    type: String,
    unique: true,
    required: true,
  },
});

module.exports = mongoose.model('Ad', adSchema);
