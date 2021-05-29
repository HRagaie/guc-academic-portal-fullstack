const { string } = require('joi')
const Joi = require('joi')
const { validationError } = require('../constants/errorCodes')

const validateAddDepartment = (req, res, next) => {
  const addDepartmentSchema = Joi.object({
    name: Joi.string().required(),
    faculty: Joi.string().length(24).required(),
  })
  const checkSchema = addDepartmentSchema.validate(req.body)
  if (checkSchema.error) {
    return res.status(400).json({
      code: validationError,
      message: checkSchema.error.details[0].message,
    })
  }
  next()
}
const validateUpdateDepartment = (req, res, next) => {
  const updateDepartmentSchema = Joi.object({
    faculty: Joi.string(),
    name: Joi.string(),
    id: Joi.string().length(24).required(),
  })
  const checkSchema = updateDepartmentSchema.validate(req.body)
  if (checkSchema.error) {
    return res.status(400).json({
      code: validationError,
      message: checkSchema.error.details[0].message,
    })
  }
  next()
}

const validateDeleteDepartment = (req, res, next) => {
  const deleteDepartmentSchema = Joi.object({
    id: Joi.string().length(24).required(),
  })
  const checkSchema = deleteDepartmentSchema.validate(req.body)
  if (checkSchema.error) {
    return res.status(400).json({
      code: validationError,
      message: checkSchema.error.details[0].message,
    })
  }
  next()
}

const validateViewMemberDayoff = (req, res, next) => {
  const viewMemberSchema = Joi.object({
    memberId: Joi.string().length(24).required(),
  })
  const checkSchema = viewMemberSchema.validate(req.body)
  if (checkSchema.error) {
    return res.status(400).json({
      code: validationError,
      message: checkSchema.error.details[0].message,
    })
  }
  next()
}

const validateViewDepartment = (req, res, next) => {
  const viewDepSchema = Joi.object({
    departmentId: Joi.string().length(24).required(),
  })
  const checkSchema = viewDepSchema.validate(req.body)
  if (checkSchema.error) {
    return res.status(400).json({
      code: validationError,
      message: checkSchema.error.details[0].message,
    })
  }
  next()
}

module.exports = {
  validateAddDepartment,
  validateUpdateDepartment,
  validateDeleteDepartment,
  validateViewMemberDayoff,
  validateViewDepartment,
}
