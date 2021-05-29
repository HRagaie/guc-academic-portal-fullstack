import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import { Autocomplete } from '@material-ui/lab'
import { TextField } from '@material-ui/core'
import backendLink from '../../keys_dev'
import axios from 'axios'

export default function AssignToCourseModal(props) {
  const [member, setMember] = useState('')
  const [allMembers, setAllMembers] = useState([])

  useEffect(() => {
    setAllMembers(props.availableMembers)
  }, [props.availableMembers])

  const handleConfirm = () => {
    console.log(props.type)
    console.log(member)
    const token = localStorage.getItem('Token')
    const courseId = props.courseId
    let url = ''
    const reqBody = {}
    if (props.type === 'head of department') {
      url = `${backendLink}/course/assignCourseInstructor`
      reqBody['courseId'] = courseId
      reqBody['instructorId'] = member
    } else {
      url = `${backendLink}/member/assignTaToCourse`
      reqBody['course'] = courseId
      reqBody['member'] = member
    }

    console.log(reqBody)
    axios({
      method: 'POST',
      url,
      headers: {
        'auth-token': token,
      },
      data: reqBody,
    })
      .then((response) => {
        console.log(response)
        handleHide()
        props.setStatusChanged(!props.statusChanged)
      })
      .catch((err) => {
        console.log(err.response)
      })
  }

  const handleChange = (e, value) => {
    console.log(value)
    setMember(value._id)
  }

  const handleHide = () => {
    setMember('')
    props.onHide()
  }

  return (
    <div>
      <Modal
        centered
        show={props.show}
        onHide={handleHide}
        className='acceptRejectCancelModal-all'
      >
        <Modal.Body>
          <p className='acceptRejectCancelModal-title'>
            Assign {props.type === 'head of department' ? 'Instructor' : 'TA'}
            To Course
          </p>
          <Autocomplete
            id='combo-box-demo'
            options={props.availableMembers}
            getOptionLabel={(option) => option.name}
            style={{ width: 300 }}
            onChange={handleChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label='Available Options'
                variant='outlined'
              />
            )}
          />
          <p className='acceptRejectCancelModal-paragraph'>
            {/* Are You Sure You Want To {props.type} This Request? */}
          </p>
          {props.type === 'reject' && (
            <input
              type='text'
              className='acceptRejectCancelModal-input'
              placeholder='Leave A Comment'
              //   value={comment}
              onChange={handleChange}
            />
          )}
          <p className='acceptRejectCancelModal-error'>{props.error}</p>
          <button
            onClick={handleConfirm}
            className='acceptRejectCancelModal-btn'
          >
            Confirm
          </button>
          <span
            className='acceptRejectCancelModal-span'
            onClick={() => props.onHide()}
          >
            Cancel
          </span>
        </Modal.Body>
      </Modal>
    </div>
  )
}
