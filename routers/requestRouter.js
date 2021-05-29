const express = require('express')
const router = express.Router()
const verifyToken = require('../authorizations/verifyToken')
const {
  verifyTA,
  verifyAcademic,
  verifyHOD,
  verifyInstructorTA,
} = require('../authorizations/memberAuthorization')

const {
  validateAcceptAccidentalLeave,
  validateChangeDayOffRequest,
  validateViewSlotLinkingRequest,
  validateSendAnnualLeaveRequest,
  validateAcceptRejectAnnualLeaveRequest,
  validateCancelAnnualLeaveRequest,
  validateAcceptCompensationLeavesRequest,
  validateViewRequest,
  validateAcceptDayOffRequest,
  validateRejectDayOffRequest,
  validateSickLeavesRequest,
  validateMaternityLeavesRequest,
  validateAccidentalLeave,
  validateAcceptSickLeavesRequest,
  validateRejectSickLeavesRequest,
  validateRejectMaternityLeavesRequest,
  validateAcceptMaternityLeavesRequest,
  validateCancelSickLeavesRequest,
  validateCancelChangeDayOffRequest,
  validateCancelMaternityLeavesRequest,
  validateCompensationLeavesRequest,
  validateSlotLinkingRequest,
  validateAcceptRejectLinkingRequest,
  validateReplcamentRequest,
  validateRejectCompensationLeavesRequest,
  validateCancelCompensationLeaveRequest,
  validateAcceptRejectCancelReplacementRequest,
  validateViewReplacementRequest,
} = require('../validations/requestValidation')

const {
  sendAnnualLeave,
  acceptAnnualLeaveRequest,
  rejectAnnualLeaveRequest,
  cancelAnnualLeaveRequest,
  viewAnnualRequests,

  accidentalLeaveRequest,
  accidentalCancelRequest,
  accidentalRejectRequest,
  accidentalAcceptRequest,
  viewAccidentalRequests,

  maternityLeaveRequest,
  acceptMaternityLeaveRequest,
  rejectMaternityLeaveRequest,
  cancelMaternityLeaveRequest,
  viewMaternityRequests,

  compensationLeaveRequest,
  acceptCompensationLeaveRequest,
  rejectCompensationLeaveRequest,
  viewCompensationRequests,

  sickLeaveRequest,
  acceptSickLeaveRequest,
  rejectSickLeaveRequest,
  cancelSickLeaveRequest,
  viewSickRequests,

  changeDayOffRequest,
  acceptDayOffRequest,
  rejectDayOffRequest,
  cancelChangeDayOffRequest,
  viewChangeDayOffRequests,

  sendSlotLinking,
  acceptSlotLinkingRequest,
  rejectSlotLinkingRequest,
  cancelSlotLinkingRequest,
  viewSlotLinkning,
  viewMySlotLinking,

  sendReplacementRequest,
  cancelCompensationLeaveRequest,
  acceptReplacementRequests,
  rejectReplacementRequests,
  cancelReplacementRequests,
  viewReplacementRequests,
} = require('../controllers/requestController')

router.post(
  '/sendReplacementRequest',
  validateReplcamentRequest,
  verifyToken,
  verifyAcademic,
  sendReplacementRequest
)

router.post(
  '/sendSlotLinking',
  validateSlotLinkingRequest,
  verifyToken,
  verifyAcademic,
  sendSlotLinking
)

router.post(
  '/acceptSlotLinking',
  validateAcceptRejectLinkingRequest,
  verifyToken,
  verifyTA,
  acceptSlotLinkingRequest
)

router.post(
  '/rejectSlotLinking',
  validateAcceptRejectLinkingRequest,
  verifyToken,
  verifyTA,
  rejectSlotLinkingRequest
)

router.post(
  '/cancelSlotLinking',
  validateAcceptRejectLinkingRequest,
  verifyToken,
  verifyAcademic,
  cancelSlotLinkingRequest
)

router.post(
  '/viewSlotLinking',
  validateViewSlotLinkingRequest,
  verifyToken,
  verifyTA,
  viewSlotLinkning
)

router.post(
  '/changeDayOff',
  validateChangeDayOffRequest,
  verifyToken,
  verifyAcademic,
  changeDayOffRequest
)
router.post(
  '/acceptDayOff',
  validateAcceptDayOffRequest,
  verifyToken,
  verifyHOD,
  acceptDayOffRequest
)
router.post(
  '/rejectDayOff',
  validateRejectDayOffRequest,
  verifyToken,
  verifyHOD,
  rejectDayOffRequest
)

router.post(
  '/cancelChangeDayOffRequest',
  validateCancelChangeDayOffRequest,
  verifyToken,
  verifyAcademic,
  cancelChangeDayOffRequest
)

router.post(
  '/sickLeave',
  validateSickLeavesRequest,
  verifyToken,
  verifyAcademic,
  sickLeaveRequest
)
router.post(
  '/maternityLeave',
  validateMaternityLeavesRequest,
  verifyToken,
  verifyAcademic,
  maternityLeaveRequest
)
router.post(
  '/acceptSickLeave',
  validateAcceptSickLeavesRequest,
  verifyToken,
  verifyHOD,
  acceptSickLeaveRequest
)
router.post(
  '/rejectSickLeave',
  validateRejectSickLeavesRequest,
  verifyToken,
  verifyHOD,
  rejectSickLeaveRequest
)
router.post(
  '/acceptMaternityLeave',
  validateAcceptMaternityLeavesRequest,
  verifyToken,
  verifyHOD,
  acceptMaternityLeaveRequest
)
router.post(
  '/rejectMaternityLeave',
  validateRejectMaternityLeavesRequest,
  verifyToken,
  verifyHOD,
  rejectMaternityLeaveRequest
)
router.post(
  '/cancelSickLeaveRequest',
  validateCancelMaternityLeavesRequest,
  verifyToken,
  verifyAcademic,
  cancelSickLeaveRequest
)

router.post(
  '/cancelMaternityLeaveRequest',
  validateCancelSickLeavesRequest,
  verifyToken,
  verifyAcademic,
  cancelMaternityLeaveRequest
)

router.post(
  '/accidentalAcceptRequest',
  validateAcceptAccidentalLeave,
  verifyToken,
  verifyHOD,
  accidentalAcceptRequest
)
router.post(
  '/accidentalRejectRequest',
  validateRejectDayOffRequest,
  verifyToken,
  verifyHOD,
  accidentalRejectRequest
)
router.post(
  '/accidentalCancelRequest',
  validateAcceptAccidentalLeave,
  verifyToken,
  verifyAcademic,
  accidentalCancelRequest
)

router.post(
  '/sendAnnualLeaveRequest',
  validateSendAnnualLeaveRequest,
  verifyToken,
  verifyAcademic,
  sendAnnualLeave
)

router.post(
  '/acceptAnnualLeaveRequest',
  validateAcceptRejectAnnualLeaveRequest,
  verifyToken,
  verifyHOD,
  acceptAnnualLeaveRequest
)
router.post(
  '/rejectAnnualLeaveRequest',
  validateAcceptRejectAnnualLeaveRequest,
  verifyToken,
  verifyHOD,
  rejectAnnualLeaveRequest
)

router.post(
  '/cancelAnnualLeaveRequest',
  validateCancelAnnualLeaveRequest,
  verifyToken,
  verifyAcademic,
  cancelAnnualLeaveRequest
)

router.post(
  '/accidentalLeaveRequest',
  validateAccidentalLeave,
  verifyToken,
  verifyAcademic,
  accidentalLeaveRequest
)
router.post(
  '/compensationLeaveRequest',
  validateCompensationLeavesRequest,
  verifyToken,
  verifyAcademic,
  compensationLeaveRequest
)

router.post(
  '/acceptCompensationLeaveRequest',
  validateAcceptCompensationLeavesRequest,
  verifyToken,
  verifyHOD,
  acceptCompensationLeaveRequest
)

router.post(
  '/rejectCompensationLeaveRequest',
  validateRejectCompensationLeavesRequest,
  verifyToken,
  verifyHOD,
  rejectCompensationLeaveRequest
)

router.post(
  '/viewChangeDayOffRequestsInDep',
  validateViewRequest,
  verifyToken,
  verifyHOD,
  viewChangeDayOffRequests
)

router.post(
  '/viewAnnualRequestsInDep',
  validateViewRequest,
  verifyToken,
  verifyHOD,
  viewAnnualRequests
)

router.post(
  '/viewAccidentalRequestsInDep',
  validateViewRequest,
  verifyToken,
  verifyHOD,
  viewAccidentalRequests
)

router.post(
  '/viewSickRequestsInDep',
  validateViewRequest,
  verifyToken,
  verifyHOD,
  viewSickRequests
)

router.post(
  '/viewMaternityRequestsInDep',
  validateViewRequest,
  verifyToken,
  verifyHOD,
  viewMaternityRequests
)

router.post(
  '/viewCompensationRequestsInDep',
  validateViewRequest,
  verifyToken,
  verifyHOD,
  viewCompensationRequests
)

router.post(
  '/viewMyChangeDayoffRequests',
  validateViewRequest,
  verifyToken,
  verifyAcademic,
  viewChangeDayOffRequests
)

router.post(
  '/viewMyAnnualRequests',
  verifyToken,
  verifyAcademic,
  viewAnnualRequests
)

router.post(
  '/viewMyAccidentalRequests',
  validateViewRequest,
  verifyToken,
  viewAccidentalRequests
)

router.post(
  '/viewMySickRequests',
  validateViewRequest,
  verifyToken,
  viewSickRequests
)

router.post(
  '/viewMyMaternityRequests',
  validateViewRequest,
  verifyToken,
  viewMaternityRequests
)

router.post(
  '/viewMyCompensationRequests',
  validateViewRequest,
  verifyToken,
  verifyAcademic,
  viewCompensationRequests
)

router.post(
  '/viewMySlotLinkingRequests',
  validateViewSlotLinkingRequest,
  verifyToken,
  verifyAcademic,
  viewMySlotLinking
)

router.post(
  '/cancelCompensationLeaveRequest',
  validateCancelCompensationLeaveRequest,
  verifyToken,
  verifyAcademic,
  cancelCompensationLeaveRequest
)

router.post(
  '/acceptReplacementRequest',
  validateAcceptRejectCancelReplacementRequest,
  verifyToken,
  verifyAcademic,
  acceptReplacementRequests
)

router.post(
  '/rejectReplacementRequest',
  validateAcceptRejectCancelReplacementRequest,
  verifyToken,
  verifyAcademic,
  rejectReplacementRequests
)

router.post(
  '/cancelReplacementRequest',
  validateAcceptRejectCancelReplacementRequest,
  verifyToken,
  verifyAcademic,
  cancelReplacementRequests
)

router.post(
  '/viewReplacementRequests',
  validateViewReplacementRequest,
  verifyToken,
  verifyAcademic,
  viewReplacementRequests
)

module.exports = router
