const { IdnotFound } = require('../constants/errorCodes')
const Faculty = require('../models/facultyModel')
const Department = require('../models/departmentModel')

const addFaculty = async (req, res) => {
  await Faculty.create(req.body)
  return res.json({
    message: 'faculty added successfully',
  })
}
const updateFaculty = async (req, res) => {
  const facultyFound = await Faculty.findById(req.body.id)
  if (!facultyFound) {
    return res.json({
      code: IdnotFound,
      message: 'Faculty Does Not Exist',
    })
  }
  await Faculty.findByIdAndUpdate(
    req.body.id,
    { name: req.body.name },
    function (err) {
      if (err) {
        return res.json({
          code: IdnotFound,
          message: 'IdNotFound',
        })
      } else {
        return res.json({
          message: 'faculty updated successfully',
        })
      }
    }
  )
}
const deleteFaculty = async (req, res) => {
  const facultyFound = await Faculty.findById(req.body.id)
  if (!facultyFound) {
    return res.json({
      code: IdnotFound,
      message: 'Faculty Does Not Exist',
    })
  }

  await facultyFound.remove()
  return res.json({
    message: 'faculty deleted successfully',
  })
}

const getAllFaculties = async (req, res) => {
  try {
    const faculties = await Faculty.find({}).select('_id name')
    return res.json({
      faculties,
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'Internal Server Error',
    })
  }
}

const getFaculty = async (req, res) => {
  try {
    const facultyId = req.body.facultyId
    const faculty = await Faculty.findById(facultyId)
    if (!faculty)
      return res.status(404).json({
        code: IdnotFound,
        message: 'Faculty Does Not Exist',
      })

    return res.json({
      faculty,
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'Internal Server Error',
    })
  }
}

module.exports = {
  addFaculty,
  updateFaculty,
  deleteFaculty,
  getAllFaculties,
  getFaculty,
}
