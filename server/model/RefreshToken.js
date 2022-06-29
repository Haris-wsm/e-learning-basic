const mongoose = require('mongoose');
const Shcema = mongoose.Schema;

const refreshSchema = new Shcema(
  {
    token: { type: String, required: true },
    userId: { type: Shcema.Types.ObjectId, ref: 'User' }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Refresh', refreshSchema, 'tokens');
