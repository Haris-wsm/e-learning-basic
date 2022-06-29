const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const DateShcema = require('./DateSchema');

const CourseSchema = new Schema(
  {
    name: { type: String, require: true },
    desc: { type: String, require: true },
    image: { type: String },
    owner: { type: Schema.Types.ObjectId, require: true, ref: 'User' },
    professers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    date: [DateShcema],
    lessons: [{ type: Schema.Types.ObjectId, ref: 'lessons' }]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Course', CourseSchema, 'courses');
