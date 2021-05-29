import React, { useState, useEffect } from 'react'
import { Card, Container, Row, Col, Button } from 'react-bootstrap'
import axios from 'axios'
import backendLink from '../../keys_dev'
import '../../Styles/CreateRequest.css'
export default function CreateSickRequest(props) {
  const token = localStorage.getItem('Token')

  const [requestDetails, setRequestDetails] = useState({
    newDayOff: 'noSelect',
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
    requestBody.newDayOff = requestDetails.newDayOff
    if (requestDetails.reason.length !== 0) {
      requestBody.reason = requestDetails.reason
    }
    e.preventDefault()
    axios({
      method: 'POST',
      url: `${backendLink}/request/changeDayOff`,
      headers: {
        'auth-token': token,
      },
      data: requestBody,
    })
      .then((response) => {
        console.log(response)
        setError('')
        setRequestDetails({
          newDayOff: 'noSelect',
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
                  Change Dayoff Information
                </p>
              </Col>
            </Row>
            <Row>
              <Col xs={3}>
                <p className='createRequest-label'>New Dayoff*</p>
              </Col>
              <Col xs={9}>
                <select
                  className='addEditViewMember-input'
                  value={requestDetails.newDayOff}
                  onChange={handleChange}
                  name='newDayOff'
                >
                  <option disabled selected value='noSelect'>
                    Select New Dayoff
                  </option>
                  <option value='saturday'>Saturday</option>
                  <option value='sunday'>Sunday</option>
                  <option value='monday'>Monday</option>
                  <option value='tuesday'>Tuesday</option>
                  <option value='wednesday'>Wednesday</option>
                  <option value='thursday'>Thursday</option>
                </select>
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
                  Send Change Dayoff Request
                </button>
              </Col>
            </Row>
          </Container>
        </Card.Body>
      </Card>
    </div>
  )
}
