import React, { useState } from 'react'
import AddEditViewFaculty from '../Components/AddEditViewFaculty'

export default function DepartmentProfileView(props) {
  const type = (props.location.state && props.location.state.type) || 'view'
  const facultyId = props.location.state.facultyId

  return (
    <div className='main-page'>
      <p className='request-heading'>Faculty Profile</p>
      <div className='horizontalLine'>
        <button className='borderTop-button' autoFocus>
          Faculty Profile
        </button>
      </div>
      <AddEditViewFaculty type={type} facultyId={facultyId} />
    </div>
  )
}
