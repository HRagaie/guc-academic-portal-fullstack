import React, { useState, useEffect } from 'react'
import { Card, Container, Row, Col, Button } from 'react-bootstrap'
import axios from 'axios'
import backendLink from '../keys_dev'
import '../Styles/AddEditViewMember.css'
import { useHistory } from 'react-router-dom'

export default function AddEditViewRoom(props) {
  const token = localStorage.getItem('Token')
  const [facultyDetails, setFacultyDetails] = useState({
    name: '',
  })
  const history = useHistory()
  const [type, setType] = useState('')
  const facultyId = props.facultyId
  const [error, setError] = useState('')

  useEffect(() => {
    setType(props.type)
  }, [])

  useEffect(() => {
    if (type !== 'create') {
      axios({
        method: 'POST',
        url: `${backendLink}/faculty/viewFaculty`,
        headers: {
          'auth-token': token,
        },
        data: {
          facultyId: facultyId,
        },
      })
        .then((response) => {
          console.log(response)
          setFacultyDetails({
            name: response.data.faculty.name,
          })
        })
        .catch((err) => {
          console.log(err.response)
        })
    }
  }, [])

  const handleChange = (e) => {
    const name = e.target.name
    const value = e.target.value
    setFacultyDetails((prevState) => {
      return {
        ...prevState,
        [name]: value,
      }
    })
  }

  const handleClick = (e) => {
    e.preventDefault()
    if (type === 'create') {
      axios({
        method: 'POST',
        url: `${backendLink}/faculty/addFaculty`,
        headers: {
          'auth-token': token,
        },
        data: facultyDetails,
      })
        .then((response) => {
          console.log(response)
          setError('')
          setFacultyDetails({
            name: '',
          })
          props.setFacultiesListState('list')
        })
        .catch((err) => {
          const code = err.response.data.code
          const message = err.response.data.message
          setError(message)
        })
    } else if (type === 'edit') {
      const updateBody = {}
      updateBody.id = facultyId
      updateBody.name = facultyDetails.name
      axios({
        method: 'PUT',
        url: `${backendLink}/faculty/updateFaculty`,
        headers: {
          'auth-token': token,
        },
        data: updateBody,
      })
        .then((response) => {
          console.log(response)
          setError('')
          setType('view')
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
      {type === 'view' && (
        <button
          className='addEditViewMember-editButton'
          onClick={() => setType('edit')}
        >
          Edit Faculty
        </button>
      )}
      <Card className='addEditViewMember-card'>
        <Card.Body>
          <Container>
            <Row xs={12}>
              <Col xs={12}>
                <p className='addEditViewMember-header'>Faculty Information</p>
              </Col>
            </Row>
            <Row>
              <Col xs={3}>
                <p className='addEditViewMember-label'>Name*</p>
              </Col>
              <Col xs={9}>
                {type === 'view' ? (
                  <p>{facultyDetails.name}</p>
                ) : (
                  <input
                    className='addEditViewMember-input'
                    name='name'
                    type='text'
                    placeholder='Enter Faculty Name'
                    value={facultyDetails.name}
                    onChange={handleChange}
                    autoComplete='off'
                  />
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
                    {type === 'create' ? 'Add Faculty' : 'Edit Faculty'}
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
