const mongoose = require('mongoose')

const CourseSchema = new mongoose.Schema(
  {
    instructor: {
      type: String,
      required: [true, 'Please provide company name'],
      maxlength: 50,
    },
    course_name: {
      type: String,
      required: [true, 'Please provide position'],
      maxlength: 100,
    },
    course_status: {
      type: String,
      enum: ['finished', 'pending', 'in progress'],
      default: 'pending',
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user'],
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Course', CourseSchema)
