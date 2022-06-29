const mongoose = require('mongoose');
const Shcema = mongoose.Schema;

const userShcema = new Shcema({
  userRef: { type: Shcema.Types.ObjectId, ref: 'User', require: true },
  courseRef: [{ type: Shcema.Types.ObjectId, ref: 'Course', require: true }]
});

module.exports = mongoose.model('Enroll', userShcema, 'enrolls');
