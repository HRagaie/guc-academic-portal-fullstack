import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import CreateCourseForm from './AddEditViewCourse'
import '../Styles/course.css'
export default function AcceptRejectCancelModal(props) {
  const [comment, setComment] = useState('')
  const handleConfirm = () => {
    props.handle(props.id, comment)
    // props.onHide()
  }

  const handleChange = (e) => {
    const value = e.target.value
    setComment(value)
  }
//   className="courseModal" 
  return (
    <div>
      <Modal dialogClassName="courseModal" 
        centered
        show={props.show}
        onHide={props.onHide}
      >
        <Modal.Body>
         <CreateCourseForm />
        </Modal.Body>
      </Modal>
    </div>
  )
}
