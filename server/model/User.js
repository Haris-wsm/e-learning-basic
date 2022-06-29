const mongoose = require('mongoose');
const Shcema = mongoose.Schema;
const userShcema = new Shcema({
  username: { type: 'string', require: true },
  code: { type: 'string', require: true },
  password: { type: 'string', require: true },
  image: { type: 'string' },
  email: { type: 'string', require: true },
  subject: { type: 'string', require: true },
  role: { type: 'string', require: true, enum: ['student', 'teacher', 'admin'] }
});

module.exports = mongoose.model('User', userShcema, 'user');
