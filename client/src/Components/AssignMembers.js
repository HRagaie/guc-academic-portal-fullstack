import React, { useState, useEffect } from 'react'
import { Card, Container, Row, Col, Button } from 'react-bootstrap'
import axios from 'axios'
import backendLink from '../keys_dev'
// import '../Styles/options.css'
import '../Styles/ProfileView.css'
import '../Styles/ListView.css'
import '../Styles/sidebar.css'
import '../Styles/AddEditViewMember.css'
import CloseIcon from '../Images/cancel.png'
import AssignToCourseModal from './Modals/AssignToCourseModal'
import Create from './Layout/Create'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import Collapse from 'react-bootstrap/Collapse'

export default function AssignMembers(props) {
  const [open, setOpen] = useState(false)
  const token = localStorage.getItem('Token')
  const type = localStorage.getItem('type')
  const memberId = localStorage.getItem('memberId')
  const [courseId, setCourseId] = useState('')
  const [memberAssignments, setMemberAssignments] = useState([])
  const [assignModal, setAssignModal] = useState(false)
  const [availableMembers, setAvailableMembers] = useState([])
  const [statusChanged, setStatusChanged] = useState(false)
  const handleCloseModal = () => {
    setAssignModal(false)
  }
  const handleDelete = (assignmentId) => {
    console.log(assignmentId)
    let reqBody = {}
    let url =
      type === 'head of department'
        ? `${backendLink}/course/deleteCourseInstructor`
        : `${backendLink}/member/removeTaAssignment`
    if (type === 'head of department')
      reqBody['courseAssignmentId'] = assignmentId
    else reqBody['assignmentId'] = assignmentId

    axios({
      method: 'DELETE',
      url,
      headers: {
        'auth-token': token,
      },
      data: reqBody,
    })
      .then((response) => {
        console.log(response)
        setStatusChanged(!statusChanged)
      })
      .catch((err) => {
        console.log(err.response)
      })
  }

  //for views
  useEffect(() => {
    setCourseId(props.courseId)
  }, [props.courseId])

  useEffect(() => {
    if (courseId !== '') {
      axios({
        method: 'POST',
        url: `${backendLink}/course/viewMemberInCourseHOD`,
        headers: {
          'auth-token': token,
        },
        data: {
          courseId,
        },
      })
        .then((response) => {
          console.log(response)
          const members = []
          if (type === 'head of department') {
            response.data.forEach((element) => {
              element.member.type === 'instructor' &&
                members.push({
                  name: element.member.name,
                  id: element.member._id,
                  assignment: element._id,
                })
            })
          } else {
            response.data.forEach((element) => {
              element.member.type === 'teaching assistant' &&
                members.push({
                  name: element.member.name,
                  id: element.member._id,
                  assignment: element._id,
                })
            })
          }
          console.log(members)
          setMemberAssignments(members)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, [courseId, statusChanged])

  const checkMemberInArray = (id) => {
    console.log(id, memberAssignments)
    for (let i = 0; i < memberAssignments.length; i++)
      if (memberAssignments[i].id === id) return false
    return true
  }

  useEffect(() => {
    axios({
      method: 'GET',
      url: `${backendLink}/department/viewMemberInDepartment`,
      headers: {
        'auth-token': token,
      },
    })
      .then((response) => {
        console.log(response)
        const members = []
        response.data.department.membersPerDepartment.forEach((element) => {
          if (type === 'head of department') {
            element.type === 'instructor' &&
              checkMemberInArray(element._id) &&
              members.push(element)
          } else if (type === 'instructor') {
            element.type === 'teaching assistant' &&
              checkMemberInArray(element._id) &&
              members.push(element)
          }
        })
        setAvailableMembers(members)
      })
      .catch((err) => {
        console.log(err.response)
      })
  }, [memberAssignments])
  const handleChange = (e) => {
    if (type === 'head of department') {
      axios({
        method: 'post',
        url: `${backendLink}/faculty/viewAllFaculties`,
        headers: {
          'auth-token': token,
        },
      })
        .then((response) => {
          console.log(response)
          //   setHeaders(['Name', 'Action'])
          //   setFacultiesList(response.data.faculties)
          //   setAttributes(['name'])
        })
        .catch((err) => {
          console.log(err)
        })
    }
    if (type === 'Instructor') {
    }
  }
  // let v = ['samer', 'george', 'marc']
  const x = (
    <>
      <button
        onClick={() => setOpen(!open)}
        aria-controls='example-collapse-text'
        aria-expanded={open}
        className='addEditViewMember-editButton'
      >
        {type === 'head of department' ? 'Instructors' : 'Teaching Assistants'}
      </button>

      <Collapse in={open}>
        <div id='example-collapse-text'>
          <ul>
            {memberAssignments.map((member) => (
              <li className='listt'>
                <table>
                  <tbody>
                    <tr>
                      <td style={{ width: '10vw' }}>
                        <p
                          style={{
                            marginBottom: '0vw',
                            marginRight: '2vw',
                            fontSize: '1.5vw',
                          }}
                        >
                          {member.name}
                        </p>
                      </td>
                      <td>
                        <img
                          src={CloseIcon}
                          alt=''
                          style={{ width: '1vw', cursor: 'pointer' }}
                          onClick={() => handleDelete(member.assignment)}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </li>
            ))}
          </ul>
        </div>
      </Collapse>
    </>
  )

  // let prpath=props.path
  return (
    <>
      <div style={{ width: '50vw', margin: '2vh' }}>
        <Create
          type={
            type === 'head of department' ? 'Instructor' : 'Teaching Assistant'
          }
          setAssignModal={setAssignModal}
        />
      </div>
      {x}
      <AssignToCourseModal
        show={assignModal}
        onHide={handleCloseModal}
        availableMembers={availableMembers}
        type={type}
        courseId={courseId}
        statusChanged={statusChanged}
        setStatusChanged={setStatusChanged}
      />
    </>
  )
}

//     </>
//   )
// }

// {
//   /* <div className='options'>
// <img className='icon' src={props.iconSrc}/>
// <Link className='link' to={props.to}>
//   {props.to}
// </Link>
// </div> */
// }
