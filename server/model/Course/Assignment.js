const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AssignmentSchema = new Schema(
  {
    title: { type: String, require: true },
    content: { type: String, require: true },
    date: { type: String, require: true },
    type: {
      type: String,
      require: true,
      enum: ['Quiz', 'Homework'],
      default: 'Homework'
    },
    attachments: [String],
    ref: { type: Schema.Types.ObjectId, require: true, ref: 'Lesson' },
    courseRef: { type: Schema.Types.ObjectId, require: true, ref: 'Course' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Assignment', AssignmentSchema, 'assignments');
