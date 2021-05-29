const express = require('express')
const router = express.Router()

const {
  validateMemberPerAllCoursesorSpecific,
  validateMemberPerCourse,
  validateCourseInstructorU,
  validateCourse,
  validateCourseU,
  validateCourseInstructor,
  validateCourseInstructorD,
} = require('../validations/courseValidation')
const {
  viewInstructorSlotsInCourse,
  viewCourseCoverageInstructor,
  viewCourseCoverageHOD,
  viewCourseHOD,
  viewOneCourseCoverageHOD,
  viewMemberSlotsInCourse,
  viewMemberInCourse,
  updateCourseInstructor,
  deleteCourseInstructor,
  addCourse,
  updateCourse,
  deleteCourse,
  viewCourse,
  assignCourseInstructor,
  viewCoursesInDep,
  viewAllCourses,
  viewMyCourses,
} = require('../controllers/courseController')

const verifyToken = require('../authorizations/verifyToken')
const {
  verifyHR,
  verifyInstructor,
  verifyHOD,
  verifyAcademic,
  verifyInstructorHOD,
} = require('../authorizations/memberAuthorization')

router.post('/addCourse', validateCourse, verifyToken, verifyHR, addCourse)

router.put(
  '/updateCourse',
  validateCourseU,
  verifyToken,
  verifyHR,
  updateCourse
)
router.delete(
  '/deleteCourse',
  validateCourseU,
  verifyToken,
  verifyHR,
  deleteCourse
)

router.post(
  '/assignCourseInstructor',
  validateCourseInstructor,
  verifyToken,
  verifyHOD,
  assignCourseInstructor
)

router.delete(
  '/deleteCourseInstructor',
  validateCourseInstructorD,
  verifyToken,
  verifyHOD,
  deleteCourseInstructor
)

router.put(
  '/updateCourseInstructor',
  validateCourseInstructorU,
  verifyToken,
  verifyHOD,
  updateCourseInstructor
)

router.post(
  '/viewMemberInCourseHOD',
  validateMemberPerCourse,
  verifyToken,
  verifyAcademic,
  viewMemberInCourse
)
router.post(
  '/viewMemberSlotsInCourse',
  validateMemberPerCourse,
  verifyToken,
  verifyAcademic,
  viewMemberSlotsInCourse
)
router.post(
  '/viewOneCourseCoverageHOD',
  validateMemberPerCourse,
  verifyToken,
  verifyInstructorHOD,
  viewOneCourseCoverageHOD
)
router.post(
  '/viewCourse',
  validateMemberPerCourse,
  verifyToken,
  viewCourse
)
router.get(
  '/viewCourseCoverageHOD',
  verifyToken,
  verifyHOD,
  viewCourseCoverageHOD
)

router.get('/viewCourseHOD', verifyToken, verifyHOD, viewCourseHOD)

router.get('/viewAllCourses', verifyToken, verifyHR, viewAllCourses)
router.get('/viewMyCourses', verifyToken, verifyAcademic, viewMyCourses)
router.get(
  '/viewCourseCoverageInstructor',
  verifyToken,
  verifyInstructor,
  viewCourseCoverageInstructor
)
router.post(
  '/viewInstructorSlotsInCourse',
  verifyToken,
  verifyInstructor,
  validateMemberPerAllCoursesorSpecific,
  viewInstructorSlotsInCourse
)
router.post(
  '/viewMemberInCourseInstructor',
  verifyToken,
  verifyInstructor,
  validateMemberPerCourse,
  viewMemberInCourse
)

router.get(
  '/viewCoursesInMyDepartment',
  verifyToken,
  verifyHOD,
  viewCoursesInDep
)

module.exports = router
