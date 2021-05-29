import React, { useState, useEffect } from 'react'
import axios from 'axios'
import backendLink from '../../keys_dev'
import ListView from '../ListView'
import CancelImage from '../../Images/cancel.png'
import AcceptImage from '../../Images/AcceptImage.png'
import RejectImage from '../../Images/RejectImage.png'
import Filters from '../Filters'
import { useHistory } from 'react-router-dom'
import CreateAccidentalRequest from '../Requests/CreateAccidentalRequest'

import '../../Styles/Requests.css'

export default function AccidentalRequests() {
  const token = localStorage.getItem('Token')
  const memberId = localStorage.getItem('memberId')
  const memberType = localStorage.getItem('type')
  const history = useHistory()
  const [accidentalRequests, setAccidetnalRequests] = useState([])
  const [headers, setHeaders] = useState([])
  const [attributes, setAttributes] = useState([])
  const [actions, setActions] = useState([])
  const [stateChanged, setStateChanged] = useState(false)
  const [requestState, setRequestState] = useState('sent')
  const [error, setError] = useState('')
  const [modalState, setModalState] = useState({
    show: false,
    type: '',
    handle: '',
    id: '',
  })
  const [filters, setFilters] = useState([
    {
      type: 'dropdown',
      label: 'Status',
      name: 'status',
      options: [
        {
          value: 'all',
          text: 'All Requests',
        },
        {
          value: 'accept',
          text: 'Accepted',
        },
        {
          value: 'reject',
          text: 'Rejected',
        },
        {
          value: 'pending',
          text: 'Pending',
        },
        {
          value: 'cancelled',
          text: 'Cancelled',
        },
      ],
    },
  ])

  const [filterObject, setFilterObject] = useState({
    status: '',
  })

  const handleCancel = (id, index) => {
    axios({
      method: 'POST',
      url: `${backendLink}/request/accidentalCancelRequest`,
      headers: {
        'auth-token': token,
      },
      data: {
        requestId: id,
      },
    })
      .then((response) => {
        console.log(response)
        if (response.data.code) {
          setError(response.data.message)
        } else {
          setStateChanged(!stateChanged)
          setModalState({
            show: false,
            type: '',
            handle: '',
            id: '',
          })
        }
      })
      .catch((err) => {
        console.log(err.response)
        setError(err.response.data.message)
      })
  }

  const handleAccept = (id, index) => {
    axios({
      method: 'POST',
      url: `${backendLink}/request/accidentalAcceptRequest`,
      headers: {
        'auth-token': token,
      },
      data: {
        requestId: id,
      },
    })
      .then((response) => {
        console.log(response)
        if (response.data.code) {
          setError(response.data.message)
        } else {
          setStateChanged(!stateChanged)
          setError('')
          setModalState({
            show: false,
            type: '',
            handle: '',
            id: '',
          })
        }
      })
      .catch((err) => {
        console.log(err.response)
        setError(err.response.data.message)
      })
  }
  const handleReject = (id, comment) => {
    const reqBody = {}
    reqBody['requestId'] = id
    if (comment) reqBody['comment'] = comment
    // console.log(reqBody)
    axios({
      method: 'POST',
      url: `${backendLink}/request/accidentalRejectRequest`,
      headers: {
        'auth-token': token,
      },
      data: reqBody,
    })
      .then((response) => {
        console.log(response)
        if (response.data.code) {
          setError(response.data.message)
        } else {
          setStateChanged(!stateChanged)
          setError('')
          setModalState({
            show: false,
            type: '',
            handle: '',
            id: '',
          })
        }
      })
      .catch((err) => {
        console.log(err.response)
      })
  }

  useEffect(() => {
    if (requestState === 'sent') {
      const reqBody = {}
      reqBody.type = 'mine'
      if (filterObject['status'] !== '' && filterObject['status'] !== 'all')
        reqBody['status'] = filterObject['status']
      axios({
        method: 'POST',
        url: `${backendLink}/request/viewMyAccidentalRequests`,
        headers: {
          'auth-token': token,
        },
        data: reqBody,
      })
        .then((response) => {
          console.log(response)
          setError('')
          const result = response.data.data
          result.forEach((element) => {
            element.memberName = element.member.name
            element.absentDate = element.absentDate.split('T')[0]
            element.dateSubmitted = element.absentDate.split('T')[0]
          })
          setAccidetnalRequests(result)
          setHeaders([
            'Absent Date',
            'Name',
            'Status',
            'Reason',
            'Comment',
            'Action',
          ])
          setAttributes([
            'absentDate',
            'memberName',
            'status',
            'reason',
            'comment',
          ])
          setActions([
            {
              src: CancelImage,
              handle: handleCancel,
              type: 'cancel',
            },
          ])
        })
        .catch((err) => {
          console.log(err.response)
        })
    } else if (requestState === 'received') {
      filterObject['type'] = 'department'
      const reqBody = {}
      reqBody.type = 'department'
      if (filterObject['status'] !== '' && filterObject['status'] !== 'all')
        reqBody['status'] = filterObject['status']
      axios({
        method: 'POST',
        url: `${backendLink}/request/viewAccidentalRequestsInDep`,
        headers: {
          'auth-token': token,
        },
        data: reqBody,
      })
        .then((response) => {
          console.log(response)
          const result = response.data.data
          result.forEach((element) => {
            element.memberName = element.member.name
            element.absentDate = element.absentDate.split('T')[0]
            // element.dateSubmitted = element.dateSubmitted.split('T')[0]
          })
          setAccidetnalRequests(result)
          setHeaders([
            'Absent Date',
            'Name',
            'Status',
            'Reason',
            'Comment',
            'Action',
          ])
          setAttributes([
            'absentDate',
            'memberName',
            'status',
            'reason',
            'comment',
          ])
          setActions([
            {
              src: AcceptImage,
              handle: handleAccept,
              type: 'accept',
            },
            {
              src: RejectImage,
              handle: handleReject,
              type: 'reject',
            },
          ])
        })
        .catch((err) => {
          console.log(err.response)
        })
    }
  }, [stateChanged, filterObject, requestState])

  return (
    <div className='main-page'>
      <p className='request-heading'>Accidental Requests</p>
      <div className='horizontalLine'>
        <button
          className='borderTop-button'
          onClick={() => setRequestState('sent')}
          autoFocus
        >
          Sent Requests
        </button>
        {localStorage.getItem('type') === 'head of department' && (
          <button
            className='borderTop-button'
            onClick={() => setRequestState('received')}
          >
            Received Requests
          </button>
        )}
        <button
          className='borderTop-button'
          onClick={() => setRequestState('add')}
        >
          Send Accidental Leave Request
        </button>
      </div>

      {requestState !== 'add' ? (
        <div>
          <Filters
            filters={filters}
            setFilters={setFilters}
            filterObject={filterObject}
            setFilterObject={setFilterObject}
          />
          <ListView
            list={accidentalRequests}
            headers={headers}
            attributes={attributes}
            actions={actions}
            error={error}
            setError={setError}
            modalState={modalState}
            setModalState={setModalState}
          />
        </div>
      ) : (
        <CreateAccidentalRequest />
      )}
    </div>
  )
}
