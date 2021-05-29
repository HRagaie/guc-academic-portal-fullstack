import React, { useState, useEffect } from 'react'
import { Card, Container, Row, Col, Button } from 'react-bootstrap'
import axios from 'axios'
import backendLink from '../../keys_dev'
import '../../Styles/CreateRequest.css'
export default function CreateSickRequest(props) {
  const token = localStorage.getItem('Token')

  const [requestDetails, setRequestDetails] = useState({
    absentDate: '',
    reason: '',
  })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const name = e.target.name
    const value = e.target.value
    setRequestDetails((prevState) => {
      return {
        ...prevState,
        [name]: value,
      }
    })
  }

  const handleClick = (e) => {
    const requestBody = {}
    requestBody.absentDate = requestDetails.absentDate
    if (requestDetails.reason.length !== 0) {
      requestBody.reason = requestDetails.reason
    }
    e.preventDefault()
    axios({
      method: 'POST',
      url: `${backendLink}/request/accidentalLeaveRequest`,
      headers: {
        'auth-token': token,
      },
      data: requestBody,
    })
      .then((response) => {
        console.log(response)
        setError('')
        setRequestDetails({
          absentDate: '',
          reason: '',
        })
      })
      .catch((err) => {
        const code = err.response.data.code
        const message = err.response.data.message
        setError(message)
      })
  }
  return (
    <div>
      <Card className='createRequest-card'>
        <Card.Body>
          <Container>
            <Row xs={12}>
              <Col xs={12}>
                <p className='createRequest-header'>
                  Accidental Request Information
                </p>
              </Col>
            </Row>
            <Row>
              <Col xs={3}>
                <p className='createRequest-label'>Absent Date*</p>
              </Col>
              <Col xs={9}>
                <input
                  className='createRequest-input'
                  value={requestDetails.absentDate}
                  onChange={handleChange}
                  name='absentDate'
                  type='date'
                />
              </Col>
            </Row>
            <Row>
              <Col xs={3}>
                <p className='createRequest-label'>Reason</p>
              </Col>
              <Col xs={9}>
                <input
                  className='createRequest-input'
                  name='reason'
                  type='text'
                  placeholder=''
                  value={requestDetails.reason}
                  onChange={handleChange}
                  autoComplete='off'
                />
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <p className='createRequest-error'>{error}</p>
              </Col>
            </Row>
            <Row>
              <Col>
                <button className='createRequest-button' onClick={handleClick}>
                  Send Accidental Leave Request
                </button>
              </Col>
            </Row>
          </Container>
        </Card.Body>
      </Card>
    </div>
  )
}
