import React, { useState, useEffect } from 'react'
import axios from 'axios'
import '../Styles/ProfileView.css'
import '../Styles/ListView.css'
import backendLink from '../keys_dev'
import ViewImage from '../Images/ViewImage.png'
import EditImage from '../Images/EditImage.png'
import DeleteImage from '../Images/DeleteImage.png'
import { useHistory } from 'react-router-dom'
import ListView from '../Components/ListView'
import AddEditViewMember from '../Components/AddEditViewMember'
import Filters from '../Components/Filters'
import AttendanceListView from '../Components/ListViews/AttendanceListView'
import AddMissingSign from '../Components/AddMissingSign'

export default function MemberProfileView(props) {
  const [stateChanged, setStateChanged] = useState(false)
  const history = useHistory()
  const token = localStorage.getItem('Token')
  const type =
    (props.location && props.location.state && props.location.state.type) ||
    'view'
  const memberId =
    (props.location && props.location.state && props.location.state.memberId) ||
    localStorage.getItem('memberId')
  const [memberProfileState, setMemberProfileState] = useState('profile')
  const [missingDaysHours, setMissingDaysHours] = useState({
    missingDays: '',
    missingTime: '',
  })
  useEffect(() => {
    axios({
      method: 'POST',
      url: `${backendLink}/member/viewMissingDaysHours`,
      headers: {
        'auth-token': token,
      },
      data: {
        memberId,
      },
    })
      .then((response) => {
        console.log(response)
        setMissingDaysHours({
          missingDays: response.data.result.MissingDays,
          missingTime: response.data.result.MissingHours_minutes,
          extraTime: response.data.result.ExtraHours_minutes,
        })
      })
      .catch((err) => {
        console.log(err.response)
      })
  }, [])

  // const sendSignIn = () => {
  //   axios({
  //     method: 'GET',
  //     url: `${backendLink}/member/signIn`,
  //     headers: {
  //       'auth-token': token,
  //     },
  //   })
  // }

  // const sendSignOut = () => {
  //   axios({
  //     method: 'GET',
  //     url: `${backendLink}/member/signOut`,
  //     headers: {
  //       'auth-token': token,
  //     },
  //   })
  // }

  return (
    <div className='main-page'>
      <p className='request-heading'>Member Profile</p>
      <div className='horizontalLine'>
        <button
          className='borderTop-button'
          onClick={() => setMemberProfileState('profile')}
          autoFocus
        >
          My Profile
        </button>
        {(localStorage.getItem('type') === 'hr' ||
          memberId === localStorage.getItem('memberId')) && (
          <button
            className='borderTop-button'
            onClick={() => setMemberProfileState('attendance')}
          >
            Attendance Records
          </button>
        )}
        {localStorage.getItem('type') === 'hr' && (
          <button
            className='borderTop-button'
            onClick={() => setMemberProfileState('missingSign')}
          >
            Add Missing Sign
          </button>
        )}
        {/* {memberId === localStorage.getItem('memberId') && (
          <button className='borderTop-button' onClick={() => sendSignIn()}>
            Sign In
          </button>
        )}
        {memberId === localStorage.getItem('memberId') && (
          <button className='borderTop-button' onClick={() => sendSignOut()}>
            Sign Out
          </button>
        )} */}
      </div>

      {memberProfileState === 'profile' ? (
        <AddEditViewMember type={type} memberId={memberId} />
      ) : memberProfileState === 'missingSign' ? (
        <AddMissingSign memberId={memberId} />
      ) : (
        <AttendanceListView
          memberId={memberId}
          missingDaysHours={missingDaysHours}
        />
      )}
    </div>
  )
}
