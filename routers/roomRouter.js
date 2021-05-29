const express = require('express')
const router = express.Router()
const {
  validateRoom,
  validateRoomU,
  validateRoomD,
  validateViewRoom,
} = require('../validations/roomValidation')
const {
  addRoom,
  updateRoom,
  deleteRoom,
  getAllOffices,
  getAllRooms,
  getNonOfficeRooms,
  getRoom,
} = require('../controllers/roomController')

const verifyToken = require('../authorizations/verifyToken')
const { verifyHR } = require('../authorizations/memberAuthorization')

router.post('/addRoom', validateRoom, verifyToken, verifyHR, addRoom)
router.put('/updateRoom', validateRoomU, verifyToken, verifyHR, updateRoom)
router.delete('/deleteRoom', validateRoomD, verifyToken, verifyHR, deleteRoom)
router.get('/viewAllOffices', verifyToken, getAllOffices)
router.get('/viewAllRooms', verifyToken, getAllRooms)
router.post('/viewRoom', validateRoomD, verifyToken, getRoom)
router.get('/getRooms', verifyToken, getNonOfficeRooms)
module.exports = router
