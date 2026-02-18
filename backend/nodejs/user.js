const { Schema, model } = require('mongoose');

const User = new Schema({
  telegramId: { type: Number, unique: true, required: true },
  username: { type: String, unique: true, required: true },
  registeredDate: { type: Date, default: Date.now, required: true },
});

module.exports = model('User', User);
