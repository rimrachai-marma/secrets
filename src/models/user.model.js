const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const { isEmail } = require('../utilities/validator');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!isEmail(value)) {
          throw new Error('Email is invalid');
        }
      }
    }
  },
  {
    timestamps: true
  }
);

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

module.exports = User;
