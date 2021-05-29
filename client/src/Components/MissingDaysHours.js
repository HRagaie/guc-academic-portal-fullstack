import React, { useState, useEffect } from 'react'
import { Card, Container, Row, Col, Button } from 'react-bootstrap'
import axios from 'axios'
import backendLink from '../keys_dev'
import '../Styles/AddEditViewMember.css'
import { useHistory } from 'react-router-dom'

export default function AddEditViewMember(props) {
  const history = useHistory()
  const token = localStorage.getItem('Token')
  const [type, setType] = useState('')
  const memberId = props.memberId
  const [memberDetails, setMemberDetails] = useState({
    name: '',
    email: '',
    office: 'noSelect',
    department: 'noSelect',
    officeName: '',
    departmentName: '',
    birthdate: '',
    gender: 'noSelect',
    type: 'noSelect',
    dayoff: 'noSelect',
    salary: '',
  })
  const [availableDepartments, setAvailableDepartments] = useState([])
  const [availableOffices, setAvailableOffices] = useState([])
  const [error, setError] = useState('')
  const [stateChanged, setStateChanged] = useState(false)

  useEffect(() => {
    setType(props.type)
  }, [])

  useEffect(() => {
    axios({
      method: 'GET',
      url: `${backendLink}/room/viewAllOffices`,
      headers: {
        'auth-token': token,
      },
    })
      .then((response) => {
        setAvailableOffices(response.data.offices)
      })
      .catch((err) => {
        console.log(err)
      })

    axios({
      method: 'GET',
      url: `${backendLink}/department/viewAllDepartments`,
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
    if (type !== 'create') {
      console.log(type, ' ', memberId)
      axios({
        method: 'POST',
        url: `${backendLink}/member/viewMember`,
        headers: {
          'auth-token': token,
        },
        data: {
          memberId,
        },
      })
        .then((response) => {
          console.log(response)
          const responseBody = response.data.data

          setMemberDetails({
            name: responseBody.name,
            email: responseBody.email,
            office: responseBody.office && responseBody.office._id,
            department: responseBody.department && responseBody.department._id,
            officeName: responseBody.office && responseBody.office.name,
            departmentName:
              responseBody.department && responseBody.department.name,
            birthdate:
              responseBody.birthdate && responseBody.birthdate.split('T'),
            gender: responseBody.gender,
            type: responseBody.type,
            dayoff: responseBody.dayoff,
            salary: responseBody.salary,
          })
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, [stateChanged])

  const handleChange = (e) => {
    const name = e.target.name
    const value = e.target.value
    setMemberDetails((prevState) => {
      return {
        ...prevState,
        [name]: value,
      }
    })
  }

  const handleClick = (e) => {
    e.preventDefault()
    if (type === 'create') {
      const reqBody = memberDetails
      delete reqBody.officeName
      delete reqBody.departmentName
      if (reqBody.birthdate === '') delete reqBody.birthdate
      if (reqBody.department === 'noSelect') delete reqBody.department
      axios({
        method: 'POST',
        url: `${backendLink}/member/addMember`,
        headers: {
          'auth-token': token,
        },
        data: reqBody,
      })
        .then((response) => {
          console.log(response)
          setError('')
          setMemberDetails({
            name: '',
            email: '',
            office: 'noSelect',
            department: 'noSelect',
            birthdate: '',
            gender: 'noSelect',
            type: 'noSelect',
            dayoff: 'noSelect',
            salary: '',
          })
          props.setMembersListState && props.setMembersListState('list')
        })
        .catch((err) => {
          console.log(err.response)
          const code = err.response.data.code
          const message = err.response.data.message
          setError(message)
        })
    } else {
      const updateBody = memberDetails
      console.log(updateBody)
      updateBody.memberId = memberId
      updateBody.office = memberDetails.office
      delete updateBody.officeName
      delete updateBody.departmentName
      axios({
        method: 'PUT',
        url: `${backendLink}/member/updateMember`,
        headers: {
          'auth-token': token,
        },
        data: updateBody,
      })
        .then((response) => {
          console.log(response)
          setError('')
          setType('view')
          setStateChanged(!stateChanged)
        })
        .catch((err) => {
          const code = err.response.data.code
          const message = err.response.data.message
          setError(message)
        })
    }
    setError('')
  }
  return (
    <div>
      {props.memberId === null && (
        <button
          className='addEditViewMember-editButton'
          onClick={() => setType('edit')}
        >
          Edit My Profile
        </button>
      )}
      <Card className='addEditViewMember-card'>
        <Card.Body>
          <Container>
            <Row xs={12}>
              <Col xs={12}>
                <p className='addEditViewMember-header'>Member Information</p>
              </Col>
            </Row>
            <Row>
              <Col xs={3}>
                <p className='addEditViewMember-label'>Name*</p>
              </Col>
              <Col xs={9}>
                {type === 'view' || (type === 'edit' && !props.memberId) ? (
                  <p>{memberDetails.name}</p>
                ) : (
                  <input
                    className='addEditViewMember-input'
                    name='name'
                    type='text'
                    placeholder='Enter Staff Member Name'
                    value={memberDetails.name}
                    onChange={handleChange}
                    autoComplete='off'
                  />
                )}
              </Col>
            </Row>
            <Row>
              <Col xs={3}>
                <p className='addEditViewMember-label'>Email*</p>
              </Col>
              <Col xs={9}>
                {type === 'view' ? (
                  <p>{memberDetails.email}</p>
                ) : (
                  <input
                    className='addEditViewMember-input'
                    type='text'
                    name='email'
                    placeholder='Enter Staff Member Email'
                    value={memberDetails.email}
                    onChange={handleChange}
                    autoComplete='off'
                  />
                )}
              </Col>
            </Row>
            <Row>
              <Col xs={3}>
                <p className='addEditViewMember-label'>Type*</p>
              </Col>
              <Col xs={9}>
                {type === 'view' || (type === 'edit' && !props.memberId) ? (
                  <p>{memberDetails.type}</p>
                ) : (
                  <select
                    className='addEditViewMember-input'
                    value={memberDetails.type}
                    onChange={handleChange}
                    name='type'
                  >
                    <option disabled selected value='noSelect'>
                      Select Member Type
                    </option>
                    <option value='hr'>HR</option>
                    <option value='teaching assistant'>
                      Teaching Assistant
                    </option>
                    <option value='instructor'>Instructor</option>
                    <option value='head of department'>
                      Head Of Department
                    </option>
                  </select>
                )}
              </Col>
            </Row>
            <Row>
              <Col xs={3}>
                <p className='addEditViewMember-label'>Gender*</p>
              </Col>
              <Col xs={9}>
                {type === 'view' || (type === 'edit' && !props.memberId) ? (
                  <p>{memberDetails.gender}</p>
                ) : (
                  <select
                    className='addEditViewMember-input'
                    value={memberDetails.gender}
                    onChange={handleChange}
                    name='gender'
                  >
                    <option disabled selected value='noSelect'>
                      Select Member Gender
                    </option>
                    <option value='male'>Male</option>
                    <option value='female'>Female</option>
                  </select>
                )}
              </Col>
            </Row>
            <Row>
              <Col xs={3}>
                <p className='addEditViewMember-label'>Department*</p>
              </Col>
              <Col xs={9}>
                {type === 'view' || (type === 'edit' && !props.memberId) ? (
                  <p>{memberDetails.departmentName || 'No Department'}</p>
                ) : (
                  <select
                    className='addEditViewMember-input'
                    value={memberDetails.department}
                    onChange={handleChange}
                    name='department'
                  >
                    <option disabled selected value='noSelect'>
                      Select Member Department
                    </option>
                    {availableDepartments.map((department) => (
                      <option value={department._id} key={department._id}>
                        {department.name}
                      </option>
                    ))}
                  </select>
                )}
              </Col>
            </Row>
            <Row>
              <Col xs={3}>
                <p className='addEditViewMember-label'>Office*</p>
              </Col>
              <Col xs={9}>
                {type === 'view' || (type === 'edit' && !props.memberId) ? (
                  <p>{memberDetails.officeName || 'No Office'}</p>
                ) : (
                  <select
                    className='addEditViewMember-input'
                    value={memberDetails.office}
                    onChange={handleChange}
                    name='office'
                  >
                    <option disabled selected value='noSelect'>
                      Select Member Office
                    </option>
                    {availableOffices.map((office) => (
                      <option value={office._id} key={office._id}>
                        {office.name}
                      </option>
                    ))}
                  </select>
                )}
              </Col>
            </Row>
            <Row>
              <Col xs={3}>
                <p className='addEditViewMember-label'>Birthdate</p>
              </Col>
              <Col xs={9}>
                {type === 'view' ? (
                  <p>
                    {memberDetails.birthdate
                      ? memberDetails.birthdate.toString().substring(0, 10)
                      : '-'}
                  </p>
                ) : (
                  <input
                    className='addEditViewMember-input'
                    value={memberDetails.birthdate}
                    onChange={handleChange}
                    name='birthdate'
                    type='date'
                  />
                )}
              </Col>
            </Row>
            <Row>
              <Col xs={3}>
                <p className='addEditViewMember-label'>Salary*</p>
              </Col>
              <Col xs={9}>
                {type === 'view' || (type === 'edit' && !props.memberId) ? (
                  <p>{memberDetails.salary}</p>
                ) : (
                  <input
                    className='addEditViewMember-input'
                    name='salary'
                    type='text'
                    placeholder='Enter Staff Member Salary'
                    value={memberDetails.salary}
                    onChange={handleChange}
                    autoComplete='off'
                  />
                )}
              </Col>
            </Row>
            <Row>
              <Col xs={3}>
                <p className='addEditViewMember-label'>Dayoff*</p>
              </Col>
              <Col xs={9}>
                {type === 'view' || (type === 'edit' && !props.memberId) ? (
                  <p>{memberDetails.dayoff}</p>
                ) : (
                  <select
                    className='addEditViewMember-input'
                    value={memberDetails.dayoff}
                    onChange={handleChange}
                    name='dayoff'
                  >
                    <option disabled selected value='noSelect'>
                      Select Member Dayoff
                    </option>
                    <option value='saturday'>Saturday</option>
                    <option value='sunday'>Sunday</option>
                    <option value='monday'>Monday</option>
                    <option value='tuesday'>Tuesday</option>
                    <option value='wednesday'>Wednesday</option>
                    <option value='thursday'>Thursday</option>
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
                    {type === 'create' ? 'Add Member' : 'Edit Member'}
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
