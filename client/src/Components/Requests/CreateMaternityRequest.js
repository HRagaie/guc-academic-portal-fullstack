import React, { useState, useEffect } from 'react'
import { Card, Container, Row, Col, Button } from 'react-bootstrap'
import axios from 'axios'
import backendLink from '../../keys_dev'
import '../../Styles/CreateRequest.css'
export default function CreateSickRequest(props) {
  const token = localStorage.getItem('Token')

  const [requestDetails, setRequestDetails] = useState({
    from: '',
    to: '',
    document: '',
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
    e.preventDefault()
    axios({
      method: 'POST',
      url: `${backendLink}/request/maternityLeave`,
      headers: {
        'auth-token': token,
      },
      data: requestDetails,
    })
      .then((response) => {
        console.log(response)
        setError('')
        setRequestDetails({
          from: '',
          to: '',
          document: '',
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
                  Maternity Leave Information
                </p>
              </Col>
            </Row>
            <Row>
              <Col xs={3}>
                <p className='createRequest-label'>From*</p>
              </Col>
              <Col xs={9}>
                <input
                  className='createRequest-input'
                  value={requestDetails.from}
                  onChange={handleChange}
                  name='from'
                  type='date'
                />
              </Col>
            </Row>
            <Row>
              <Col xs={3}>
                <p className='createRequest-label'>To*</p>
              </Col>
              <Col xs={9}>
                <input
                  className='createRequest-input'
                  value={requestDetails.to}
                  onChange={handleChange}
                  name='to'
                  type='date'
                />
              </Col>
            </Row>
            <Row>
              <Col xs={3}>
                <p className='createRequest-label'>Document URL*</p>
              </Col>
              <Col xs={9}>
                <input
                  className='createRequest-input'
                  name='document'
                  type='text'
                  placeholder=''
                  value={requestDetails.document}
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
                  Send Maternity Leave Request
                </button>
              </Col>
            </Row>
          </Container>
        </Card.Body>
      </Card>
    </div>
  )
}
