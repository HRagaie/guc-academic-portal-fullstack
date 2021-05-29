import React, { useState, useEffect } from 'react'
import { Card, Container, Row, Col, Button } from 'react-bootstrap'
import axios from 'axios'
import backendLink from '../keys_dev'
import '../Styles/AddEditViewMember.css'
export default function AddEditViewCourse(props) {
  const token = localStorage.getItem('Token')
  const setCourseListState = props.setCourseListState
  const stateChanged = props.stateChanged
  const setStateChanged = props.setStateChanged
  const [type, setType] = useState(props.type)
  const [courseId, setCourseId] = useState(props.courseId)
  const memberType = props.memberType
  const courseCoverage = props.courseCoverage
  useEffect(() => {
    setType(props.type)
  }, [])

  useEffect(() => {
    console.log(props.courseId)
    setCourseId(props.courseId)
  }, [props.courseId])

  const [courseDetails, setCourseDetails] = useState({
    name: '',
    slotsPerWeek: '',
    department: [],
    departmentIds: [],
  })
  const [availableDepartments, setAvailableDepartments] = useState([])
  const [error, setError] = useState('')
  useEffect(() => {
    // console.log(type)
    // console.log(courseCoverage)
    axios({
      method: 'GET',
      url: `${backendLink}/department/viewAllDepartments`, //$ for writing variable in
      headers: {
        'auth-token': token,
      },
    })
      .then((response) => {
        setAvailableDepartments(response.data.departments)
      })
      .catch((err) => {
        console.log(err.response)
      })
    if (type !== 'create' && courseId !== '') {
      axios({
        method: 'POST',
        url: `${backendLink}/course/viewCourse`,
        headers: {
          'auth-token': token,
        },
        data: {
          courseId: courseId,
        },
      })
        .then((response) => {
          console.log(response)
          const data = response.data
          data['departmentIds'] = []
          data.department.forEach((element) => {
            data['departmentIds'].push(element._id)
          })
          console.log(data)
          setCourseDetails({
            name: data.name,
            slotsPerWeek: data.slotsPerWeek,
            department: data.department,
            departmentIds: data.departmentIds,
          })
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, [courseId, type])

  const handleChange = (e) => {
    const name = e.target.name
    const value =
      name === 'departmentIds'
        ? Array.from(e.target.selectedOptions, (option) => option.value)
        : e.target.value
    setCourseDetails((prevState) => {
      return {
        ...prevState,
        [name]: value,
      }
    })
  }

  const handleClick = (e) => {
    e.preventDefault()
    if (type === 'create') {
      const createBody = courseDetails
      createBody.departmentId = courseDetails.departmentIds
      delete createBody.departmentIds
      delete createBody.department
      console.log(createBody)
      axios({
        method: 'POST',
        url: `${backendLink}/course/addCourse`,
        headers: {
          'auth-token': token,
        },
        data: createBody,
      })
        .then((response) => {
          console.log(response)
          setError('')
          setCourseListState('view')
          setStateChanged(!stateChanged)
        })
        .catch((err) => {
          console.log(err.response)
          const code = err.response.data.code
          const message = err.response.data.message
          setError(message)
        })
    } else if (type === 'edit') {
      console.log(courseDetails)
      let updatedCourse = {}
      updatedCourse.courseId = courseId
      updatedCourse.name = courseDetails.name
      updatedCourse.slotsPerWeek = courseDetails.slotsPerWeek
      updatedCourse.department = courseDetails.departmentIds
      // console.log(updatedCourse)
      axios({
        method: 'PUT',
        url: `${backendLink}/course/updateCourse`,
        headers: {
          'auth-token': token,
        },
        data: updatedCourse,
      })
        .then((response) => {
          console.log(response)
          setError('')
          setCourseDetails({
            name: '',
            slotsPerWeek: '',
            department: [],
            departmentIds: [],
          })
          setType('view')
          // setCourseListState('view')
          //  setStateChanged(!stateChanged)
        })
        .catch((err) => {
          console.log(err.response)
          const code = err.response.data.code
          const message = err.response.data.message
          setError(message)
        })
    }
  }

  return (
    <div>
      {type === 'view' && memberType === 'hr' && (
        <button
          className='addEditViewMember-editButton'
          onClick={() => setType('edit')}
        >
          Edit Course
        </button>
      )}
      <Card className='addEditViewMember-card'>
        <Card.Body>
          <Container>
            <Row xs={12}>
              <Col xs={12}>
                <p className='addEditViewMember-header'>Course Information</p>
              </Col>
            </Row>
            <Row>
              <Col xs={3}>
                <p className='addEditViewMember-label'>Name*</p>
              </Col>
              <Col xs={9}>
                {type === 'view' ? (
                  <p>{courseDetails.name}</p>
                ) : (
                  <input
                    className='addEditViewMember-input'
                    name='name'
                    type='text'
                    placeholder='Enter Course Name'
                    value={courseDetails.name}
                    onChange={handleChange}
                    autoComplete='off'
                  />
                )}
              </Col>
            </Row>
            <Row>
              <Col xs={3}>
                <p className='addEditViewMember-label'>Slots Per Week*</p>
              </Col>
              <Col xs={9}>
                {type === 'view' ? (
                  <p>{courseDetails.slotsPerWeek}</p>
                ) : (
                  <input
                    className='addEditViewMember-input'
                    type='text'
                    name='slotsPerWeek'
                    placeholder='Enter Course Slots Per Week'
                    value={courseDetails.slotsPerWeek}
                    onChange={handleChange}
                    autoComplete='off'
                  />
                )}
              </Col>
            </Row>
            {/* //&&courseCoverage!=undefined */}
            {type == 'view' && courseCoverage != undefined && (
              <Row>
                <Col xs={3}>
                  <p className='addEditViewMember-label'>Course Coverage*</p>
                </Col>
                <Col xs={9}>
                  <p>{courseCoverage}</p>
                </Col>
              </Row>
            )}
            <Row>
              <Col xs={3}>
                <p className='addEditViewMember-label'>Department*</p>
              </Col>
              <Col xs={9}>
                {type === 'view' ? (
                  <ul
                    style={{
                      listStyleType: 'none',
                      padding: '0vw',
                    }}
                  >
                    {courseDetails.department &&
                      courseDetails.department.map((department) => (
                        <li
                          style={{
                            listStyleType: 'none',
                            margin: 0,
                            padding: 0,
                          }}
                        >
                          {department.name}
                        </li>
                      ))}
                  </ul>
                ) : (
                  <select
                    className='addEditViewMember-input'
                    value={courseDetails.departmentIds}
                    onChange={handleChange}
                    name='departmentIds'
                    multiple
                  >
                    <option disabled selected value={[]}>
                      Select Course Department
                    </option>
                    {availableDepartments.map((department) => (
                      <option
                        value={department._id}
                        key={department._id}
                        // selected
                      >
                        {department.name}
                      </option>
                    ))}
                  </select>
                )}
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <p className='addEditViewMember-error'>{error}</p>
              </Col>
            </Row>
            <Row>
              <Col>
                {type !== 'view' && (
                  <button
                    className='addEditViewMember-button'
                    onClick={handleClick}
                  >
                    {type === 'create' ? 'Add Course' : 'Edit Course'}
                  </button>
                )}
              </Col>
            </Row>
          </Container>
        </Card.Body>
      </Card>
    </div>
  )
}
