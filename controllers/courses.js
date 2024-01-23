const mongoose = require('mongoose')
const moment = require('moment')
const Course = require('../models/Course')
const { BadRequestError, NotFoundError } = require('../errors')
const {StatusCodes} = require('http-status-codes')


/** */
const showStats = async (req,res) =>{

  /**set up aggregate pipeline */
  let stats = await Course.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: '$course_status', count: { $sum: 1 } } },
  ])

  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr;

    acc[title] = count;
    return acc;
  }, {});


  const defaultStats = {
    in_progress: stats.in_progress || 0,
    interview: stats.finished || 0,
    pending: stats.pending || 0,
  };


  let monthlyCourses = await Course.aggregate([

    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 6 },
  ]);

  monthlyCourses = monthlyCourses.map((item) => {
      const { _id: { year, month },count} = item;
      const date = moment().month(month - 1).year(year).format('MMM Y');
      return { date, count };
  }).reverse();

  res.status(StatusCodes.OK).json({ defaultStats, monthlyCourses });
}

//filtering
const getAllCourses = async (req, res) => {
  const {search,status,duration,sort} = req.query

  const QueryObject = {
    createdBy : req.user.userId
  }
  /**start filtering logic */

  /**
   * search | status | duration
   */
   /**search by course name */
   if(search){
    // search for pattern ($regex) && its a case insensitive (i)
    QueryObject.course_name = {$regex:search,$options:'i'}
  }
  /** course_status filter */
  if(status && status!=='all'){
    QueryObject.course_status = status //enum: ['finished', 'pending', 'in_progress'],
  }
  /** course_duration filter */
  if(duration && duration!=='all'){
    QueryObject.course_duration = duration //enum:['more then 10h','between 5h and 10h','between 1h and 5h','less then 1h'],
  }

  let result = Course.find(QueryObject)

  /**
   * sorting
   */
  if(sort ==='latest'){
    result = result.sort('-createdAt')
  }
  if(sort ==='oldest'){
    result = result.sort('createdAt')
  }
  if(sort ==='a-z'){
    result = result.sort('course_name')
  }
  if(sort ==='z-a'){
    result = result.sort('-course_name')
  }

  /**
   * pagination using skip & limit
   */

  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const skip = (page - 1 )* limit

  result = result.skip(skip).limit(limit)
  
  /**end */


  const courses = await result

  const totalCourses = await Course.countDocuments(QueryObject)
  const numOfPages = Math.ceil(totalCourses/limit)


  res.status(StatusCodes.OK).json({ 
    courses,
    totalCourses,
    numOfPages,
    owner:req.user.name
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


  res.status(StatusCodes.CREATED).json({course})

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
  showStats,
  createCourse,
  deleteCourse,
  getAllCourses,
  updateCourse,
  getSingleCourse,
}
