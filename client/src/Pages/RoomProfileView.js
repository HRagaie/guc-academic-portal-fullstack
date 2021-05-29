import React, { useState } from 'react'
import AddEditViewRoom from '../Components/AddEditViewRoom'

export default function RoomProfileView(props) {
  const type = (props.location.state && props.location.state.type) || 'view'
  const roomId = props.location.state.roomId

  return (
    <div className='main-page'>
      <p className='request-heading'>Room Profile</p>
      <div className='horizontalLine'>
        <button className='borderTop-button' autoFocus>
          Room Profile
        </button>
      </div>
      <AddEditViewRoom type={type} roomId={roomId} />
    </div>
  )
}
