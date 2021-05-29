import React, { useState } from 'react'
import AddEditViewDepartment from '../Components/AddEditViewDepartment'

export default function DepartmentProfileView(props) {
  const type = (props.location.state && props.location.state.type) || 'view'
  const departmentId = props.location.state.departmentId

  return (
    <div className='main-page'>
      <p className='request-heading'>Department Profile</p>
      <div className='horizontalLine'>
        <button className='borderTop-button' autoFocus>
          Department Profile
        </button>
      </div>
      <AddEditViewDepartment type={type} departmentId={departmentId} />
    </div>
  )
}
