const express = require('express')

const router = express.Router()
const {
  createCourse,
  deleteCourse,
  getAllCourses,
  updateCourse,
  getSingleCourse,
} = require('../controllers/courses')

router.route('/').post(createCourse).get(getAllCourses)

router.route('/:id').get(getSingleCourse).delete(deleteCourse).patch(updateCourse)

module.exports = router
