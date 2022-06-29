const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DateShcema = new Schema({
  day: { type: String, require: true },
  start: { type: String, require: true },
  end: { type: String, require: true }
});

module.exports = DateShcema;
