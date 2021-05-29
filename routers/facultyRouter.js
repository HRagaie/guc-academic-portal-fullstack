const express = require('express')
const router = express.Router()

const {
  validateAddFaculty,
  validateUpdateFaculty,
  validateDeleteFaculty,
  validateViewFaculty,
} = require('../validations/facultyValidation')
const {
  addFaculty,
  updateFaculty,
  deleteFaculty,
  getAllFaculties,
  getFaculty,
} = require('../controllers/facultyController')

const verifyToken = require('../authorizations/verifyToken')
const { verifyHR } = require('../authorizations/memberAuthorization')

router.post(
  '/addFaculty',
  validateAddFaculty,
  verifyToken,
  verifyHR,
  addFaculty
)
router.put(
  '/updateFaculty',
  validateUpdateFaculty,
  verifyToken,
  verifyHR,
  updateFaculty
)
router.delete(
  '/deleteFaculty',
  validateDeleteFaculty,
  verifyToken,
  verifyHR,
  deleteFaculty
)

router.get('/viewAllFaculties', verifyToken, getAllFaculties)
router.post('/viewFaculty', validateViewFaculty, verifyToken, getFaculty)
module.exports = router
