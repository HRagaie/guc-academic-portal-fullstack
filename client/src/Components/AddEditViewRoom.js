import React, { useState, useEffect } from 'react'
import { Card, Container, Row, Col, Button } from 'react-bootstrap'
import axios from 'axios'
import backendLink from '../keys_dev'
import '../Styles/AddEditViewMember.css'

export default function AddEditViewRoom(props) {
  const token = localStorage.getItem('Token')
  const [type, setType] = useState('')
  const [roomDetails, setRoomDetails] = useState({
    name: '',
    type: 'noSelect',
    capacity: '',
  })
  const roomId = props.roomId
  const [error, setError] = useState('')

  useEffect(() => {
    setType(props.type)
  }, [])

  const handleChange = (e) => {
    const name = e.target.name
    const value = e.target.value
    setRoomDetails((prevState) => {
      return {
        ...prevState,
        [name]: value,
      }
    })
  }

  useEffect(() => {
    if (type !== 'create') {
      axios({
        method: 'POST',
        url: `${backendLink}/room/viewRoom`,
        headers: {
          'auth-token': token,
        },
        data: {
          roomId: roomId,
        },
      })
        .then((response) => {
          console.log(response)
          setRoomDetails({
            name: response.data.room.name,
            type: response.data.room.type,
            capacity: response.data.room.capacity,
          })
        })
        .catch((err) => {
          console.log(err.response)
        })
    }
  }, [])

  const handleClick = (e) => {
    e.preventDefault()
    if (type === 'create') {
      axios({
        method: 'POST',
        url: `${backendLink}/room/addRoom`,
        headers: {
          'auth-token': token,
        },
        data: roomDetails,
      })
        .then((response) => {
          console.log(response)
          setError('')
          setRoomDetails({
            name: '',
            type: 'noSelect',
            capacity: '',
          })
          props.setRoomsListState('list')
        })
        .catch((err) => {
          const code = err.response.data.code
          const message = err.response.data.message
          setError(message)
        })
    } else {
      const updateBody = {}
      updateBody.roomId = roomId
      updateBody.name = roomDetails.name
      updateBody.capacity = roomDetails.capacity
      updateBody.type = roomDetails.type
      axios({
        method: 'PUT',
        url: `${backendLink}/room/updateRoom`,
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
          Edit Room
        </button>
      )}
      <Card className='addEditViewMember-card'>
        <Card.Body>
          <Container>
            <Row xs={12}>
              <Col xs={12}>
                <p className='addEditViewMember-header'>Room Information</p>
              </Col>
            </Row>
            <Row>
              <Col xs={3}>
                <p className='addEditViewMember-label'>Name*</p>
              </Col>
              <Col xs={9}>
                {type === 'view' ? (
                  <p>{roomDetails.name}</p>
                ) : (
                  <input
                    className='addEditViewMember-input'
                    name='name'
                    type='text'
                    placeholder='Enter Room Name'
                    value={roomDetails.name}
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
                {type === 'view' ? (
                  <p>{roomDetails.type}</p>
                ) : (
                  <select
                    className='addEditViewMember-input'
                    value={roomDetails.type}
                    onChange={handleChange}
                    name='type'
                  >
                    <option disabled selected value='noSelect'>
                      Select Room Type
                    </option>
                    <option value='office'>Office</option>
                    <option value='hall'>Lecture Hall</option>
                    <option value='tutorial'>Tutorial Room</option>
                    <option value='lab'>Lab</option>
                  </select>
                )}
              </Col>
            </Row>
            <Row>
              <Col xs={3}>
                <p className='addEditViewMember-label'>Capacity*</p>
              </Col>
              <Col xs={9}>
                {type === 'view' ? (
                  <p>{roomDetails.capacity}</p>
                ) : (
                  <input
                    className='addEditViewMember-input'
                    name='capacity'
                    type='text'
                    placeholder='Enter Room Capacity'
                    value={roomDetails.capacity}
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
                    {type === 'create' ? 'Add Room' : 'Edit Room'}
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
