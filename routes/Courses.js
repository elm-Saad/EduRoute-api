const express = require('express')
const testUser = require('../middleware/testUser')
const router = express.Router()

const {
  showStats,
  createCourse,
  deleteCourse,
  getAllCourses,
  updateCourse,
  getSingleCourse,
} = require('../controllers/courses')


router.route('/').post(testUser,createCourse).get(getAllCourses)

router.route('/stats').get(showStats)


router.route('/:id').get(getSingleCourse).delete(testUser,deleteCourse).patch(testUser,updateCourse)

module.exports = router
