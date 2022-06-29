const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Models

const AttachmentShcema = new Schema(
  {
    title: { type: String, require: true },
    type: { type: String, require: true, enum: ['video', 'reading'] },
    duration: { type: Number, require: true },
    file: { type: String },
    filename: { type: String, require: true },
    content: { type: String },
    adder: { type: mongoose.Types.ObjectId, require: true, ref: 'user' },
    ref: { type: mongoose.Types.ObjectId, ref: 'lessons' }
  },
  {
    timestamps: true
  }
);

AttachmentShcema.post('remove', async function () {
  // console.log(this.ref);
  await this.model('Lesson').findOneAndUpdate(
    { _id: this.ref },
    {
      $pull: { attachments: this._id }
    }
  );
});

module.exports = mongoose.model('Attachment', AttachmentShcema, 'attachments');
