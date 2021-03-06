const mongoose = require('mongoose')

const annualLeaveRequestSchema = new mongoose.Schema({
  from: Date,
  to: Date,
  comment: String,
  reason: String,
  status: String,
  dateSubmitted: Date,
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
  },
  replacements: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ReplacementRequest',
  }],
})

module.exports = mongoose.model('AnnualLeaveRequest', annualLeaveRequestSchema)
