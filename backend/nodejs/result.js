const { Schema, model } = require('mongoose');

const Result = new Schema({
  username: { type: String, required: true },
  questionCount: { type: Number, required: true },
  result: { type: Number, required: true },
  date: { type: Date, required: true },
});

module.exports = model('Result', Result);
