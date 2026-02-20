const { Schema, model } = require('mongoose');

const User = new Schema({
  telegramId: { type: BigInt, unique: true, required: true },
  username: {
    type: String,
    required: true,
    index: {
      unique: true,
      collation: { locale: 'en', strength: 2 },
    },
  },
  registered: { type: Date, default: Date.now, required: true },
});

module.exports = model('User', User);
