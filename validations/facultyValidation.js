const Joi = require('joi')

const { validationError } = require('../constants/errorCodes')

const validateAddFaculty = (req, res, next) => {
  const addFacultySchema = Joi.object({
    name: Joi.string().required(),
  })
  const checkSchema = addFacultySchema.validate(req.body)

  if (checkSchema.error) {
    return res.status(400).json({
      code: validationError,
      message: checkSchema.error.details[0].message,
    })
  }
  next()
}

const validateUpdateFaculty = (req, res, next) => {
  const updateFacultySchema = Joi.object({
    name: Joi.string().required(),
    id: Joi.string().length(24).required(),
  })
  const checkSchema = updateFacultySchema.validate(req.body)
  if (checkSchema.error) {
    return res.status(400).json({
      code: validationError,
      message: checkSchema.error.details[0].message,
    })
  }
  next()
}

const validateDeleteFaculty = (req, res, next) => {
  const deleteFacultySchema = Joi.object({
    id: Joi.string().length(24).required(),
  })
  const checkSchema = deleteFacultySchema.validate(req.body)
  if (checkSchema.error) {
    return res.status(400).json({
      code: validationError,
      message: checkSchema.error.details[0].message,
    })
  }
  next()
}

const validateViewFaculty = (req, res, next) => {
  const viewFacultySchema = Joi.object({
    facultyId: Joi.string().length(24).required(),
  })
  const checkSchema = viewFacultySchema.validate(req.body)
  if (checkSchema.error) {
    return res.status(400).json({
      code: validationError,
      message: checkSchema.error.details[0].message,
    })
  }
  next()
}

module.exports = {
  validateAddFaculty,
  validateUpdateFaculty,
  validateDeleteFaculty,
  validateViewFaculty,
}
