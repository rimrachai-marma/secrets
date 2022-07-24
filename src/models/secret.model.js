const mongoose = require('mongoose');

const secretSchema = new mongoose.Schema(
  {
    secret: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

const Secret = mongoose.model('Secret', secretSchema);

module.exports = Secret;
