import React, { useState, useEffect } from 'react'
import { Card, Container, Row, Col, Button } from 'react-bootstrap'
import axios from 'axios'
import backendLink from '../keys_dev'
import '../Styles/AddEditViewMember.css'
import { useHistory } from 'react-router-dom'

export default function AddMissingSign(props) {
  const token = localStorage.getItem('Token')
  const [signDetails, setSignDetails] = useState({
    date: 'noSelect',
    hours: 'noSelect',
    mins: 'noSelect',
    type: 'noSelect',
  })
  const memberId = props.memberId
  const history = useHistory()
  const [type, setType] = useState('')
  const facultyId = props.facultyId
  const [error, setError] = useState('')

  const hours = []
  for (let i = 7; i <= 19; i++) hours.push(i)

  const mins = []
  for (let i = 0; i <= 59; i++) mins.push(i)

  const handleChange = (e) => {
    const name = e.target.name
    const value = e.target.value
    setSignDetails((prevState) => {
      return {
        ...prevState,
        [name]: value,
      }
    })
  }

  const handleClick = (e) => {
    e.preventDefault()
    const reqBody = {}
    reqBody.memberId = memberId
    reqBody.type = signDetails.type
    reqBody.date = signDetails.date
    reqBody.time = signDetails.hours + ':' + signDetails.mins
    axios({
      method: 'POST',
      url: `${backendLink}/member/addMissingSign`,
      headers: {
        'auth-token': token,
      },
      data: reqBody,
    })
      .then((response) => {
        console.log(response)
        if (!response.data.code) {
          setSignDetails({
            date: 'noSelect',
            hours: 'noSelect',
            mins: 'noSelect',
            type: 'noSelect',
          })
        }
        setError('')
      })
      .catch((err) => {
        console.log(err.response)
        const code = err.response.data.code
        const message = err.response.data.message
        setError(message)
      })
  }
  return (
    <div>
      <Card className='addEditViewMember-card'>
        <Card.Body>
          <Container>
            <Row xs={12}>
              <Col xs={12}>
                <p className='addEditViewMember-header'>Add Missing Sign</p>
              </Col>
            </Row>
            <Row>
              <Col xs={3}>
                <p className='addEditViewMember-label'>Date*</p>
              </Col>
              <Col xs={9}>
                <input
                  className='addEditViewMember-input'
                  value={signDetails.date}
                  onChange={handleChange}
                  name='date'
                  type='date'
                />
              </Col>
            </Row>
            <Row>
              <Col xs={3}>
                <p className='addEditViewMember-label'>Hours*</p>
              </Col>
              <Col xs={9}>
                <select
                  className='addEditViewMember-input'
                  value={signDetails.hours}
                  onChange={handleChange}
                  name='hours'
                >
                  <option disabled value='noSelect'>
                    Select Hours
                  </option>
                  {hours.map((hour) => (
                    <option value={hour} key={hour}>
                      {hour}
                    </option>
                  ))}
                </select>
              </Col>
            </Row>
            <Row>
              <Col xs={3}>
                <p className='addEditViewMember-label'>Minutes*</p>
              </Col>
              <Col xs={9}>
                <select
                  className='addEditViewMember-input'
                  value={signDetails.mins}
                  onChange={handleChange}
                  name='mins'
                >
                  <option disabled value='noSelect'>
                    Select Minutes
                  </option>
                  {mins.map((min) => (
                    <option value={min} key={min}>
                      {min}
                    </option>
                  ))}
                </select>
              </Col>
            </Row>
            <Row>
              <Col xs={3}>
                <p className='addEditViewMember-label'>Type*</p>
              </Col>
              <Col xs={9}>
                <select
                  className='addEditViewMember-input'
                  value={signDetails.type}
                  onChange={handleChange}
                  name='type'
                >
                  <option disabled value='noSelect'>
                    Select Type
                  </option>
                  <option value={'signin'}>Sign In</option>
                  <option value={'signout'}>Sign Out</option>
                </select>
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
                    Add Missing Sign
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
