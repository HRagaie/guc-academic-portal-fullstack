const mongoose = require('mongoose')
const AttendanceRecordModel = require('./attendanceRecordModel')
const tokenBlacklistModel = require('./tokenBlacklistModel')
const AccidentalLeaceRequests = require('./accidentalLeaveRequest')
const AnnualLeaveRequests = require('./annualLeaveRequest')
const ChangeDayOffRequests = require('./changeDayOffRequest')
const CompensationLeaveRequests = require('./compensationLeaveRequest')
const CourseAssignment = require('./courseAssignment')
const MaternityLeaveRequests = require('./maternityLeaveRequest')
const SickLeaveRequests = require('./sickLeaveRequest')
const ReplacementRequests = require('./replacementRequest')
const SlotLinkingRequests = require('./slotLinkingRequest')
const SlotAssignment = require('./slotAssignmentModel')
const { memberRoles } = require('../constants/constants')
const departmentModel = require('./departmentModel')

const memberSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  customId: String,
  type: String,
  dayoff: String,
  salary: Number,
  birthdate: Date,
  activated: Boolean,
  gender: String,
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
  },
  office: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
  },
  annualBalanceTaken: Number,
  accidentalDaysTaken: Number,
  dateCreated: Date,
})

memberSchema.virtual('attendanceRecords', {
  ref: 'AttendanceRecord',
  localField: '_id',
  foreignField: 'member',
})

memberSchema.virtual('schedule', {
  ref: 'SlotAssignment',
  localField: '_id',
  foreignField: 'member',
})

memberSchema.virtual('replacements', {
  ref: 'ReplacementRequest',
  localField: '_id',
  foreignField: 'replacementMember',
})

memberSchema.post('remove', async (doc) => {
  console.log(doc)
  await AttendanceRecordModel.deleteMany({ member: doc._id })
  await tokenBlacklistModel.deleteMany({ member: doc._id })
  await AccidentalLeaceRequests.deleteMany({ member: doc._id })
  await AnnualLeaveRequests.deleteMany({ member: doc._id })
  await ChangeDayOffRequests.deleteMany({ member: doc._id })
  await CompensationLeaveRequests.deleteMany({ member: doc._id })
  await CourseAssignment.deleteMany({ member: doc._id })
  await MaternityLeaveRequests.deleteMany({ member: doc._id })
  await ReplacementRequests.deleteMany({ member: doc._id })
  await SickLeaveRequests.deleteMany({ member: doc._id })
  await SlotLinkingRequests.deleteMany({ member: doc._id })
  await SlotAssignment.updateMany(
    { member: doc._id },
    { $unset: { member: '' } }
  )
})

memberSchema.post('save', async (doc) => {
  console.log(doc)
  if (doc.type === memberRoles.HOD) {
    await departmentModel.findByIdAndUpdate(doc.department, {
      $set: { headOfDepartment: doc._id },
    })
  }
})

memberSchema.set('toObject', { virtuals: true })
memberSchema.set('toJSON', { virtuals: true })

module.exports = mongoose.model('Member', memberSchema)
