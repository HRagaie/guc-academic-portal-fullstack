import React from 'react'

import member from '../../Images/members.png'
import course from '../../Images/course.png'
import department from '../../Images/department.png'
import faculty from '../../Images/faculty.png'
import room from '../../Images/room.png'
import attendance from '../../Images/attendance.png'
import scadule from '../../Images/scadule.png'
import profile from '../../Images/profile.png'
class SidebarElement {
  constructor(name, iconSrc) {
    this.name = name
    this.iconSrc = iconSrc
  }
}
const HROptions = [
  new SidebarElement('My Profile', profile),
  // new SidebarElement('Attendance', attendance),
  new SidebarElement('Member', member),
  new SidebarElement('Course', course),
  new SidebarElement('Department', department),
  new SidebarElement('Faculty', faculty),
  new SidebarElement('Room', room),
]
const RequestOptions = [
  'Compensation Request',
  'Sick Leave Request',
  'Maternity Leave Request',
  'Annual Leave Request',
  'Accidental Leave Request',
  'Slot Linking Request',
  'Replacement Request ',
  'Change Day off Request',
]
const HodInstructorOptions = [
  new SidebarElement('My Profile', profile),
  new SidebarElement('My Schedule', scadule),
  // new SidebarElement('Attendance', attendance),
  new SidebarElement('Member', member),
  new SidebarElement('Course', course),
]
const TAOptions = [
  new SidebarElement('My Profile', profile),
  new SidebarElement('My Schedule', scadule),
  // new SidebarElement('Attendance', attendance),
  new SidebarElement('Course', course),
]
export { HROptions, RequestOptions, HodInstructorOptions, TAOptions }
