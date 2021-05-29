const express = require('express')
const router = express.Router()

const {
  validateAddDepartment,
  validateUpdateDepartment,
  validateViewMemberDayoff,
  validateDeleteDepartment,
  validateViewDepartment,
} = require('../validations/departmentValidation')
const {
  viewMember_dayoff_InDepartment,
  viewMemberInDepartment,
  addDepartment,
  viewAllMember_dayoff_InDepartment,
  updateDepartment,
  deleteDepartment,
  getAllDepartments,
  getDepartment,
} = require('../controllers/departmentController')

const verifyToken = require('../authorizations/verifyToken')

const {
  verifyHR,
  verifyHOD,
  verifyInstructor,
  verifyInstructorHOD,
} = require('../authorizations/memberAuthorization')

router.post(
  '/addDepartment',
  validateAddDepartment,
  verifyToken,
  verifyHR,
  addDepartment
)
router.put(
  '/updateDepartment',
  validateUpdateDepartment,
  verifyToken,
  verifyHR,
  updateDepartment
)
router.delete(
  '/deleteDepartment',
  validateDeleteDepartment,
  verifyToken,
  verifyHR,
  deleteDepartment
)
router.get(
  '/viewMemberInDepartment',
  verifyToken,
  verifyInstructorHOD,
  viewMemberInDepartment
)

// router.get(
//   '/viewMemberInInstructorDepartment',
//   verifyToken,
//   verifyInstructor,
//   viewMemberInDepartment
// )

router.get(
  '/viewAllMember_dayoff_InDepartment',
  verifyToken,
  verifyHOD,
  viewAllMember_dayoff_InDepartment
)
router.post(
  '/viewMember_dayoff_InDepartment',
  validateViewMemberDayoff,
  verifyToken,
  verifyHOD,
  viewMember_dayoff_InDepartment
)

router.get('/viewAllDepartments', verifyToken, getAllDepartments)

router.post(
  '/viewDepartment',
  validateViewDepartment,
  verifyToken,
  getDepartment
)

module.exports = router
