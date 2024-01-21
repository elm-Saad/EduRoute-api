//get module 
const Course = require('../models/Course')

const { BadRequestError, NotFoundError } = require('../errors')
const {StatusCodes} = require('http-status-codes')


const getAllCourses = async (req, res) => {
  //course by the user (req.user.userId) handled in the authentication.js

  const courses = await Course.find({createdBy:req.user.userId}).sort('createdAt')

  res.status(StatusCodes.OK).json({
    courses ,
    count:courses.length,
    owner:req.user.name,
  })
}

const getSingleCourse = async (req, res) => {
  const userId = req.user.userId
  const CourseId = req.params.id

  // get from DB
  const singleCourse = await Course.findOne({
    _id:CourseId,
    createdBy:userId
  })

  /**
   *handle CastError if (err.name === 'CastError') in the error-handler 
   */
  if(!singleCourse){
    throw new NotFoundError('No course with is '+ CourseId)
  }

  res.status(StatusCodes.OK).json({singleCourse})
}

const createCourse = async (req, res) => {

  // attach userId to createdBy in Course module
  req.body.createdBy = req.user.userId 

  // add to DB
  const  course = await Course.create(req.body)


  res.status(StatusCodes.CREATED).json({ course})

}

const updateCourse = async (req, res) => {
  // get id of the Course and the userId and body of the req
  const {
    user:{userId},
    params:{id:CourseId},
    body:{instructor,course_name}
  } = req
  

  if(instructor === '' || course_name === ''){
    throw new BadRequestError('course_name or instructor fields cannot be empty')
  }


  const course = await Course.findByIdAndUpdate({
    _id:CourseId,
    createdBy:userId,
  },req.body,{new: true, runValidators:true})

  if(!course){
    throw new NotFoundError('No course with is '+ CourseId)
  }

  res.status(StatusCodes.OK).json({course})
}

const deleteCourse = async (req, res) => {
  // get id of the course and the userId and body of the req
  const {
    user:{userId},
    params:{id:CourseId},
  } = req

  const course = await Course.findOneAndRemove({
    _id:CourseId,
    createdBy:userId,
  })

  if(!course){
    throw new NotFoundError('No course with is '+ CourseId)
  }

  res.status(StatusCodes.OK).json({msg:'course deleted'})
}

module.exports = {
  createCourse,
  deleteCourse,
  getAllCourses,
  updateCourse,
  getSingleCourse,
}
