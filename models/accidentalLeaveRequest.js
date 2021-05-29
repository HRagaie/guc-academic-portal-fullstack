const mongoose = require('mongoose')

const accidentalLeaveRequestSchema = new mongoose.Schema({
  absentDate: Date,
  reason: String,
  status: String,
  dateSubmitted: Date,
  comment: String,
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
  },
})

module.exports = mongoose.model(
  'AccidentalLeaveRequest',
  accidentalLeaveRequestSchema
)
