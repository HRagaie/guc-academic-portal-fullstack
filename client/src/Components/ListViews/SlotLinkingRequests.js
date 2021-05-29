import React, { useState, useEffect } from 'react'
import axios from 'axios'
import backendLink from '../../keys_dev'
import ListView from '../ListView'
import CancelImage from '../../Images/cancel.png'
import AcceptImage from '../../Images/AcceptImage.png'
import RejectImage from '../../Images/RejectImage.png'
import Filters from '../Filters'
import { useHistory } from 'react-router-dom'
import CreateSlotLinkingReq from '../Schedule/SlotLinkingReq'

import '../../Styles/Requests.css'
import { Card } from 'react-bootstrap'

export default function SlotLinkningRequests() {
  const token = localStorage.getItem('Token')
  const memberId = localStorage.getItem('memberId')
  const memberType = localStorage.getItem('type')
  const history = useHistory()
  const [slotLinkningRequests, setSlotLinkningRequests] = useState([])
  const [headers, setHeaders] = useState([])
  const [attributes, setAttributes] = useState([])
  const [actions, setActions] = useState([])
  const [stateChanged, setStateChanged] = useState(false)
  const [requestState, setRequestState] = useState('sent')
  const [error, setError] = useState('')
  const [avaialbleCourses, setAvailableCourses] = useState([])
  const [isCoordinator, setIsCoordinator] = useState(true)
  const [modalState, setModalState] = useState({
    show: false,
    type: '',
    handle: '',
    id: '',
  })

  useEffect(() => {
    axios({
      method: 'GET',
      url: `${backendLink}/course/viewMyCourses`,
      headers: {
        'auth-token': token,
      },
    })
      .then((response) => {
        console.log(response)
        const data = response.data
        const options = []
        data.forEach((element) => {
          options.push({
            value: element._id,
            text: element.name,
          })
        })
        // console.log(options)
        setAvailableCourses(options)
        setFilters((prevState) => {
          return [
            ...prevState,
            {
              type: 'dropdown',
              label: 'Course',
              name: 'course',
              options: options,
            },
          ]
        })
      })
      .catch((err) => {
        console.log(err.response)
      })
  }, [])

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
    course: '',
  })

  const handleCancel = (id, index) => {
    axios({
      method: 'POST',
      url: `${backendLink}/request/cancelSlotLinking`,
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
        console.log(index)
        setError(err.response.data.message)
      })
  }

  const handleAccept = (id, index) => {
    console.log(index)
    axios({
      method: 'POST',
      url: `${backendLink}/request/acceptSlotLinking`,
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
    console.log(reqBody)
    axios({
      method: 'POST',
      url: `${backendLink}/request/rejectSlotLinking`,
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
    if (requestState === 'sent' && filterObject.course !== '') {
      const reqBody = {}
      reqBody.type = 'mine'
      reqBody.courseId = filterObject.course
      if (filterObject['status'] !== '' && filterObject['status'] !== 'all')
        reqBody['status'] = filterObject['status']
      axios({
        method: 'POST',
        url: `${backendLink}/request/viewMySlotLinkingRequests`,
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
            element.slotNumber = element.slot.slot
            element.day = element.slot.day
            element.courseName = element.slot.course.name
            element.roomName = element.slot.room.name
          })
          setSlotLinkningRequests(result)
          setHeaders([
            'Day',
            'Slot',
            'Room',
            'Course',
            'Status',
            'Member',
            'Action',
          ])
          setAttributes([
            'day',
            'slotNumber',
            'roomName',
            'courseName',
            'status',
            'memberName',
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
    } else if (requestState === 'received' && filterObject.course !== '') {
      filterObject['type'] = 'department'
      const reqBody = {}
      reqBody.type = 'department'
      reqBody.courseId = filterObject.course
      if (filterObject['status'] !== '' && filterObject['status'] !== 'all')
        reqBody['status'] = filterObject['status']
      axios({
        method: 'POST',
        url: `${backendLink}/request/viewSlotLinking`,
        headers: {
          'auth-token': token,
        },
        data: reqBody,
      })
        .then((response) => {
          console.log(response)
          if (!response.data.code) {
            setIsCoordinator(true)
            const result = response.data.data
            result.forEach((element) => {
              element.memberName = element.member.name
              element.slotNumber = element.slot.slot
              element.day = element.slot.day
              element.courseName = element.slot.course.name
              element.roomName = element.slot.room.name
            })
            setSlotLinkningRequests(result)
            setHeaders([
              'Day',
              'Slot',
              'Room',
              'Course',
              'Status',
              'Member',
              'Action',
            ])
            setAttributes([
              'day',
              'slotNumber',
              'roomName',
              'courseName',
              'status',
              'memberName',
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
          }
        })
        .catch((err) => {
          console.log(err.response)
          setIsCoordinator(false)
        })
    }
  }, [stateChanged, filterObject, requestState])

  return (
    <div className='main-page'>
      <p className='request-heading'>Slot Linking Requests</p>
      <div className='horizontalLine'>
        <button
          className='borderTop-button'
          onClick={() => setRequestState('sent')}
          autoFocus
        >
          Sent Requests
        </button>
        {localStorage.getItem('type') === 'teaching assistant' && (
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
          Send Slot Linking Request
        </button>
      </div>

      {requestState !== 'add' ? (
        <div>
          <h6>Please Select A Course</h6>
          <Filters
            filters={filters}
            setFilters={setFilters}
            filterObject={filterObject}
            setFilterObject={setFilterObject}
          />
          {(requestState === 'received' && isCoordinator) ||
          requestState === 'sent' ? (
            <ListView
              list={slotLinkningRequests}
              headers={headers}
              attributes={attributes}
              actions={actions}
              error={error}
              setError={setError}
              modalState={modalState}
              setModalState={setModalState}
            />
          ) : (
            <Card style={{ width: '60vw', textAlign: 'center' }}>
              <Card.Body>
                <p>You Are Not Coordinator On This Course</p>
              </Card.Body>
            </Card>
          )}
        </div>
      ) : (
        <CreateSlotLinkingReq />
      )}
    </div>
  )
}
