const Course = require('../models/courseModel')
const CourseAssignment = require('../models/courseAssignment')
const Member = require('../models/memberModel')
const Department = require('../models/departmentModel')
const {
  courseNotInDepartment,
  courseNotFound,
  notInstructor,
  departmentDoesnotExist,
  entryAlreadyExist,
  catchError,
  entryNotExist,
  IdnotFound,
  assignmentDoesNotExist,
  userNotFound,
  courseDoesNotExist,
} = require('../constants/errorCodes')
const { memberRoles } = require('../constants/constants')
const {
  find,
  findByIdAndRemove,
  findByIdAndDelete,
} = require('../models/courseModel')
const SlotAssignment = require('../models/slotAssignmentModel')
const departmentModel = require('../models/departmentModel')
const courseModel = require('../models/courseModel')
const addCourse = async (req, res) => {
  try {
    // const isthereDepartment = await Department.findById(req.body.departmentId)
    // if (!isthereDepartment)
    //   return res.status(400).json({
    //     message: 'department Does not Exist error',
    //     code: departmentDoesnotExist,
    //   })
    const oldCourse = await Course.findOne({
      name: req.body.name,
      slotsPerWeek: req.body.slotsPerWeek,
    })

    if (!oldCourse) {
      const course = new Course({
        name: req.body.name,
        slotsPerWeek: req.body.slotsPerWeek,
        department: req.body.departmentId,
      })
      await course.save()
    } else {
      const newCourse = {}
      const array = oldCourse.department
      if (array.includes(req.body.departmentId))
        return res.status(400).json({
          message: 'entry is Already Exist',
          code: entryAlreadyExist,
        })
      array.push(req.body.departmentId)
      newCourse.department = array
      await Course.findOneAndUpdate({ _id: oldCourse._id }, newCourse)
    }

    return res.json({ message: 'Course added' })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'catch error',
      code: catchError,
    })
  }
}

const updateCourse = async (req, res) => {
  try {
    const newCourse = {}
    if (req.body.name) newCourse.name = req.body.name
    if (req.body.slotsPerWeek) newCourse.slotsPerWeek = req.body.slotsPerWeek
    newCourse.department = req.body.department
    await Course.findOneAndUpdate({ _id: req.body.courseId }, newCourse)

    return res.json({ message: 'Course updated' })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'catch error',
      code: catchError,
    })
  }
}

const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findOneAndRemove({ _id: req.body.courseId })
    if (!course)
      return res.status(404).json({
        message: 'course does not exist',
        code: entryNotExist,
      })
    return res.json({ message: 'Course deleted' })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'catch error',
      code: catchError,
    })
  }
}
const assignCourseInstructor = async (req, res) => {
  try {
    //   check member is instructor
    const member = await Member.findOne({
      _id: req.body.instructorId,
      type: {
        $in: [memberRoles.INSTRUCTOR, memberRoles.HOD],
      },
    })
    if (!member)
      return res.status(404).json({
        message: ' not Instructor',
        code: notInstructor,
      })

    const course = await Course.findById(req.body.courseId)
    if (!course)
      return res.status(404).json({
        message: 'Not A Course',
        code: courseNotFound,
      })

    // const x= await Department.find().populate('coursesPerDepartment')
    // res.send((x))
    //   department of hod is department  of course
    const isCourseInDepartment = await Member.findById(
      req.member.memberId
    ).populate({
      path: 'department',
      populate: {
        path: 'coursesPerDepartment',
        match: { _id: req.body.courseId },
      },
    })
    if (isCourseInDepartment.department.coursesPerDepartment.length == 0)
      return res.status(400).json({
        message: 'course id Not In Department',
        code: courseNotInDepartment,
      })
    courseAss = CourseAssignment({
      role: memberRoles.INSTRUCTOR,
      course: req.body.courseId,
      member: req.body.instructorId,
    })
    const repeatedItem = await CourseAssignment.findOne({
      role: memberRoles.INSTRUCTOR,
      course: req.body.courseId,
      member: req.body.instructorId,
    })
    if (repeatedItem)
      return res.status(400).json({
        message: 'entry is Already Exist',
        code: entryAlreadyExist,
      })

    await courseAss.save()
    return res.json({
      message: 'Instuctor Assigned To Course Successfully',
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'catch error',
      code: catchError,
    })
  }
}

const deleteCourseInstructor = async (req, res) => {
  try {
    // const member = await Member.findOne({
    //   _id: req.body.instructorId,
    //   type: memberRoles.INSTRUCTOR,
    // })
    // if (!member)
    //   return res.status(404).json({
    //     message: ' not Instructor',
    //     code: notInstructor,
    //   })

    // const course = await Course.findById(req.body.courseId)
    // if (!course)
    //   return res.status(404).json({
    //     message: 'No A Course',
    //     code: courseNotFound,
    //   })
    // const repeatedItem = await CourseAssignment.findOneAndDelete({
    //   role: memberRoles.INSTRUCTOR,
    //   course: req.body.courseId,
    //   member: req.body.instructorId,
    // })
    // if (!repeatedItem)
    //   return res.status(400).json({
    //     message: 'entry is not Exist',
    //     code: entryNotExist,
    //   })

    const checkAssignmentFound = await CourseAssignment.findById(
      req.body.courseAssignmentId
    )
    if (!checkAssignmentFound) {
      return res.status(404).json({
        code: assignmentDoesNotExist,
        message: 'Course Assignment Does Not Exist',
      })
    }
    await CourseAssignment.findByIdAndDelete(req.body.courseAssignmentId)
    return res.json({
      message: 'Instuctor removed from Course Successfully',
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'catch error',
      code: catchError,
    })
  }
}

const updateCourseInstructor = async (req, res) => {
  try {
    const checkAssignmentFound = await CourseAssignment.findById(
      req.body.courseAssignmentId
    ).populate('course')
    if (!checkAssignmentFound) {
      return res.status(404).json({
        code: assignmentDoesNotExist,
        message: 'Course Assignment Does Not Exist',
      })
    }
    const member = await Member.findById(req.body.newInstructorId)
    if (!member)
      return res.status(404).json({
        message: userNotFound,
        code: 'User Not Found',
      })

    if (member.type !== memberRoles.INSTRUCTOR) {
      return res.status(403).json({
        code: notInstructor,
        message: 'New Member is not Instructor',
      })
    }

    const tokenId = req.member.memberId
    console.log(checkAssignmentFound.course.department)
    if (!checkAssignmentFound.course.department.includes(member.department)) {
      return res.status(403).json({
        code: courseNotInDepartment,
        message: 'Course is not in your department',
      })
    }
    // const member2 = await Member.findOne({
    //   _id: req.body.instructorIdAdded,
    //   type: memberRoles.INSTRUCTOR,
    // })
    // if (!member2)
    //   return res.status(404).json({
    //     message: ' not Instructor',
    //     code: notInstructor,
    //   })

    // const course = await Course.findById(req.body.courseId)
    // if (!course)
    //   return res.status(404).json({
    //     message: 'Not A Course',

    //     code: courseNotFound,
    //   })
    // const repeatedItem = await CourseAssignment.findOneAndUpdate(
    //   {
    //     role: memberRoles.INSTRUCTOR,
    //     member: req.body.instructorIdDeleted,
    //     course: req.body.courseId,
    //   },
    //   {
    //     role: memberRoles.INSTRUCTOR,
    //     course: req.body.courseId,
    //     member: req.body.instructorIdAdded,
    //   }
    // )
    // if (!repeatedItem)
    //   return res.status(400).json({
    //     message: 'entry is not Exist',
    //     code: entryNotExist,
    //   })
    await CourseAssignment.findByIdAndUpdate(req.body.courseAssignmentId, {
      $set: { member: req.body.newInstructorId },
    })
    return res.json({
      message: 'Instuctor updated from Course Successfully',
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'catch error',
      code: catchError,
    })
  }
}

const viewMemberInCourse = async (req, res) => {
  try {
    const courseId = req.body.courseId
    const course = await Course.findById(courseId)
    if (!course)
      return res.status(404).json({
        message: 'Not A Course',
        code: courseNotFound,
      })

    const me = await Member.findById(req.member.memberId).populate({
      path: 'department',
      populate: {
        path: 'coursesPerDepartment',
        select: '_id',
        match: { _id: courseId },
      },
    })
    if (me.department.coursesPerDepartment.length == 0)
      return res.status(400).json({
        message: 'course id Not In HIS/HER Department',
        code: courseNotInDepartment,
      })

    const out = await CourseAssignment.find({ course: courseId })
      // .select('member')
      .populate('member')

    if (out.length == 0)
      return res.json({
        code: courseNotFound,
        message: 'No assignments for this course ',
      })

    res.json(out)
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'catch error',
      code: catchError,
    })
  }
}

const viewMemberSlotsInCourse = async (req, res) => {
  try {
    const courseId = req.body.courseId
    const course = await Course.findById(courseId)
    if (!course)
      return res.status(404).json({
        message: 'Not A Course',
        code: courseNotFound,
      })
    const me = await Member.findById(req.member.memberId).populate({
      path: 'department',
      populate: {
        path: 'coursesPerDepartment',
        select: '_id',
        match: { _id: courseId },
      },
    })
    if (me.department.coursesPerDepartment.length == 0)
      return res.status(400).json({
        message: 'course id Not In Department',
        code: courseNotInDepartment,
      })

    const memberSlotAssignment = await SlotAssignment.find({
      course: courseId,
    }).populate(['member', 'room', 'course'])

    res.json(memberSlotAssignment)
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'catch error',
      code: catchError,
    })
  }
}
const viewCourse = async (req, res) => {
  try {
    const courseId = req.body.courseId
    const course = await Course.findById(courseId).populate('department')
    if (!course)
      return res.json({
        message: 'No A Course',
        code: courseNotFound,
      })
    return res.json(course)
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'catch error',
      code: catchError,
    })
  }
}

const viewOneCourseCoverageHOD = async (req, res) => {
  try {
    const courseId = req.body.courseId
    const course = await Course.findById(courseId)
    if (!course)
      return res.json({
        message: 'No A Course',
        code: courseNotFound,
      })
    const me = await Member.findById(req.member.memberId).populate({
      path: 'department',
      populate: {
        path: 'coursesPerDepartment',
        select: '_id',
        match: { _id: courseId },
      },
    })
    if (me.department.coursesPerDepartment.length == 0)
      return res.status(400).json({
        message: 'course id Not In Department',
        code: courseNotInDepartment,
      })

    const memberSlotAssignment = await SlotAssignment.countDocuments({
      course: courseId,
      member: { $ne: undefined },
    })

    const courseObj = await Course.findById(courseId)
    let totalSlots = courseObj.slotsPerWeek
    let coverage = memberSlotAssignment / totalSlots

    return res.json(coverage)
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'catch error',
      code: catchError,
    })
  }
}

const viewCourseCoverageHOD = async (req, res) => {
  try {
    const me = await Member.findById(req.member.memberId).populate({
      path: 'department',
      populate: {
        path: 'coursesPerDepartment',
        select: '_id slotsPerWeek name',
        populate: {
          path: 'slotsAssignments',
          match: { member: { $ne: undefined } },
        },
      },
    })
    let arrAns = []
    console.log(me.department.coursesPerDepartment[0].slotsAssignments)
    me.department.coursesPerDepartment.forEach((element) => {
      let totalSlots = element.slotsPerWeek
      let memberSlotAssignment = element.slotsAssignments.length
      let coverage = memberSlotAssignment / totalSlots
      arrAns.push({
        courseName: element.name,
        Id: element._id,
        Coverage: coverage,
      })
    })
    res.json(arrAns)
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'catch error',
      code: catchError,
    })
  }
}

const viewCourseCoverageInstructor = async (req, res) => {
  try {
    const tokenId = req.member.memberId
    const me = await CourseAssignment.find({ member: tokenId }).populate({
      path: 'course',
      select: '_id slotsPerWeek name',
      populate: {
        path: 'slotsAssignments',
        match: { member: { $ne: undefined } },
      },
    })
    let arrAns = []
    console.log(me)
    me.forEach((element) => {
      let e = element.course
      let totalSlots = e.slotsPerWeek
      let memberSlotAssignment = e.slotsAssignments.length
      let coverage = memberSlotAssignment / totalSlots
      arrAns.push({ courseName: e.name, Id: e._id, Coverage: coverage })
    })
    res.json(arrAns)
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'catch error',
      code: catchError,
    })
  }
}

const viewInstructorSlotsInCourse = async (req, res) => {
  try {
    let matchObj = { member: req.member.memberId }
    if (req.body.courseId) {
      matchObj.course = req.body.courseId
      const checkCourseFound = await courseModel.findById(req.body.courseId)
      if (!checkCourseFound) {
        return res.status(404).json({
          code: courseDoesNotExist,
          message: 'Course Does Not Exist',
        })
      }
    }

    const memberSlotAssignment = await CourseAssignment.find(matchObj)
      .select('course')
      .populate({
        path: 'course',
        select: 'slotsAssignments name',
        populate: {
          path: 'slotsAssignments',
        },
      })
    console.log(memberSlotAssignment)
    res.json(memberSlotAssignment)
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'catch error',
      code: catchError,
    })
  }
}

const viewCoursesInDep = async (req, res) => {
  try {
    const tokenId = req.member.memberId
    const memberDep = await Member.findById(tokenId)
    const courses = await Course.find({
      department: memberDep.department,
    })
    return res.json({
      courses,
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'catch error',
      code: catchError,
    })
  }
}

const viewCourseHOD = async (req, res) => {
  try {
    const me = await Member.findById(req.member.memberId).populate({
      path: 'department',
      populate: {
        path: 'coursesPerDepartment',
        populate: {
          path: 'slotsAssignments',
        },
      },
    })
    console.log(me)
    return res.json(me.department.coursesPerDepartment)
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'catch error',
      code: catchError,
    })
  }
}
const viewAllCourses = async (req, res) => {
  try {
    const me = await Course.find()
    return res.json(me)
  } catch (err) {
    console.log(err.message)
    return res.status(500).json({
      message: 'catch error',
      code: catchError,
    })
  }
}
const viewMyCourses = async (req, res) => {
  try {
    const me = await CourseAssignment.find({
      member: req.member.memberId,
    })
      .select('course')
      .populate('course')

    me.forEach(function (part, index) {
      this[index] = this[index].course
    }, me)
    res.json(me)
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'catch error',
      code: catchError,
    })
  }
}

module.exports = {
  addCourse,
  updateCourse,
  deleteCourse,
  assignCourseInstructor,
  deleteCourseInstructor,
  updateCourseInstructor,
  viewMemberInCourse,
  viewMemberSlotsInCourse,
  viewOneCourseCoverageHOD,
  viewCourseCoverageHOD,
  viewCourseCoverageInstructor,
  viewInstructorSlotsInCourse,
  viewCoursesInDep,
  viewCourseHOD,
  viewAllCourses,
  viewMyCourses,
  viewCourse,
}
