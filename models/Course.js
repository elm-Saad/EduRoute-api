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
      enum: ['finished', 'pending', 'in_progress'],
      default: 'pending',
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user'],
    },
    course_duration:{
      type:String,
      enum:['more then 10h','between 5h and 10h','between 1h and 5h','less then 1h'],
      default:'more then 10h'
     },
     Gol:{
      type:String,
      default:'better person',
      require:true,
     }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Course', CourseSchema)
