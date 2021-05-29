import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal'

export default function AcceptRejectCancelModal(props) {
  const [comment, setComment] = useState('')
  const handleConfirm = () => {
    props.handle(props.id, comment)
  }

  const handleChange = (e) => {
    const value = e.target.value
    setComment(value)
  }

  const handleHide = () => {
    setComment('')
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
            {props.type.substring(0, 1).toUpperCase() +
              props.type.substring(1) +
              ' '}
            Request
          </p>
          <p className='acceptRejectCancelModal-paragraph'>
            Are You Sure You Want To {props.type} This Request?
          </p>
          {props.type === 'reject' && (
            <input
              type='text'
              className='acceptRejectCancelModal-input'
              placeholder='Leave A Comment'
              value={comment}
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
