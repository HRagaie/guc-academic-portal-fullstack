import React, { useState, useEffect } from 'react'
import { Card, Container, Row, Col, Button } from 'react-bootstrap'
import axios from 'axios'
import backendLink from '../keys_dev'
import '../Styles/AddEditViewMember.css'
import { useHistory } from 'react-router-dom'

export default function AddEditViewDepartment(props) {
  const token = localStorage.getItem('Token')
  const [departmentDetails, setDepartmentDetails] = useState({
    name: '',
    faculty: 'noSelect',
    facultyName: '',
  })
  const [availableFaculties, setAvailableFaculties] = useState([])
  const history = useHistory()
  const [type, setType] = useState('')
  const departmentId = props.departmentId
  const [error, setError] = useState('')

  useEffect(() => {
    setType(props.type)
  }, [])

  useEffect(() => {
    axios({
      method: 'GET',
      url: `${backendLink}/faculty/viewAllFaculties`,
      headers: {
        'auth-token': token,
      },
    })
      .then((response) => {
        console.log(response)
        setAvailableFaculties(response.data.faculties)
      })
      .catch((err) => {
        console.log(err)
      })
    if (type !== 'create') {
      axios({
        method: 'POST',
        url: `${backendLink}/department/viewDepartment`,
        headers: {
          'auth-token': token,
        },
        data: {
          departmentId: departmentId,
        },
      })
        .then((response) => {
          console.log(response)
          setDepartmentDetails({
            name: response.data.department.name,
            faculty: response.data.department.faculty._id,
            facultyName: response.data.department.faculty.name,
          })
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, [type])

  const handleChange = (e) => {
    const name = e.target.name
    const value = e.target.value
    setDepartmentDetails((prevState) => {
      return {
        ...prevState,
        [name]: value,
      }
    })
  }

  const handleClick = (e) => {
    e.preventDefault()
    if (type === 'create') {
      const reqBody = departmentDetails
      delete reqBody.facultyName
      axios({
        method: 'POST',
        url: `${backendLink}/department/addDepartment`,
        headers: {
          'auth-token': token,
        },
        data: reqBody,
      })
        .then((response) => {
          console.log(response)
          setError('')
          setDepartmentDetails({
            name: '',
            faculty: 'noSelect',
            facultyName: '',
          })
          props.setDepartmentsListState('list')
        })
        .catch((err) => {
          const code = err.response.data.code
          const message = err.response.data.message
          setError(message)
        })
    } else if (type === 'edit') {
      const updateBody = {}
      updateBody.id = departmentId
      updateBody.name = departmentDetails.name
      updateBody.faculty = departmentDetails.faculty
      axios({
        method: 'PUT',
        url: `${backendLink}/department/updateDepartment`,
        headers: {
          'auth-token': token,
        },
        data: updateBody,
      })
        .then((response) => {
          console.log(response)
          setError('')
          setDepartmentDetails({
            name: '',
            faculty: 'noSelect',
            facultyName: '',
          })
          setType('view')
        })
        .catch((err) => {
          const code = err.response.data.code
          const message = err.response.data.message
          setError(message)
        })
    }
  }
  return (
    <div>
      {type === 'view' && (
        <button
          className='addEditViewMember-editButton'
          onClick={() => setType('edit')}
        >
          Edit Department
        </button>
        
      )}
      <Card className='addEditViewMember-card'>
        <Card.Body>
          <Container>
            <Row xs={12}>
              <Col xs={12}>
                <p className='addEditViewMember-header'>
                  Department Information
                </p>
              </Col>
            </Row>
            <Row>
              <Col xs={3}>
                <p className='addEditViewMember-label'>Name*</p>
              </Col>
              <Col xs={9}>
                {type === 'view' ? (
                  <p>{departmentDetails.name}</p>
                ) : (
                  <input
                    className='addEditViewMember-input'
                    name='name'
                    type='text'
                    placeholder='Enter Department Name'
                    value={departmentDetails.name}
                    onChange={handleChange}
                    autoComplete='off'
                  />
                )}
              </Col>
            </Row>
            <Row>
              <Col xs={3}>
                <p className='addEditViewMember-label'>Faculty*</p>
              </Col>
              <Col xs={9}>
                {type === 'view' ? (
                  <p>{departmentDetails.facultyName}</p>
                ) : (
                  <select
                    className='addEditViewMember-input'
                    value={departmentDetails.faculty}
                    onChange={handleChange}
                    name='faculty'
                  >
                    <option disabled value='noSelect'>
                      Select Faculty
                    </option>
                    {availableFaculties.map((faculty) => (
                      <option value={faculty._id} key={faculty._id}>
                        {faculty.name}
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
                    {type === 'create' ? 'Add Department' : 'Edit Department'}
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
