const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Models

const AttachmentModel = require('./Attachments');

// Services

const LessonSchema = new Schema(
  {
    name: { type: String, require: true },
    purposes: [String],
    duration: { type: Number, require: true },
    link: { type: String },
    adder: { type: mongoose.Types.ObjectId, require: true, ref: 'user' },
    courseRef: { type: mongoose.Types.ObjectId, require: true, ref: 'courses' },
    attachments: [{ type: mongoose.Types.ObjectId, ref: 'attachments' }],
    assignments: [{ type: Schema.Types.ObjectId, ref: 'Assignment' }]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Lesson', LessonSchema, 'lessons');
