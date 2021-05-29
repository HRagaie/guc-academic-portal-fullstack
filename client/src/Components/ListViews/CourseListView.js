import React, { useState, useEffect } from 'react'
import axios from 'axios'
import '../../Styles/ListView.css'
import '../../Styles/options.css'
import CreateForm from '../CourseCreate'
import CreateCourseForm from '../AddEditViewCourse'
import backendLink from '../../keys_dev'
import ViewImage from '../../Images/ViewImage.png'
import EditImage from '../../Images/EditImage.png'
import DeleteImage from '../../Images/DeleteImage.png'
import { useHistory } from 'react-router-dom'
import ListView from '../ListView'
import CourseOperations from '../CourseOperations'
import { Card, Container, Row, Col, Button } from 'react-bootstrap'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Image from 'react-bootstrap/Image'
export default function CourseListView() {
  const [coursesList, setCoursesList] = useState([])
  const [headers, setHeaders] = useState([])
  const [attributes, setAttributes] = useState([])
  const [stateChanged, setStateChanged] = useState(false)
  const history = useHistory()
  const token = localStorage.getItem('Token')
  const type = localStorage.getItem('type')
  const [actions, setActions] = useState([])
  const [modal, setmodal] = useState(true)
  const [courseListState, setCourseListState] = useState('view')
  useEffect(() => {
    let url = ''
    setActions([
      {
        src: ViewImage,
        handle: handleView,
      }
    ])
    if (type === 'hr') {
      url = `${backendLink}/Course/viewAllCourses`
      setActions([
        {
          src: ViewImage,
          handle: handleView,
        },
        {
          src: DeleteImage,
          handle: handleDelete,
        },
      ])
    } else if (type == 'head of department')
      url = `${backendLink}/Course/viewCourseHOD`
    else url = `${backendLink}/Course/viewMyCourses`
    axios({
      method: 'GET',
      url: url,
      headers: {
        'auth-token': token,
      },
    })
      .then((response) => {
        console.log(response)
        setHeaders(['Name', 'Slots per week', 'Action'])
        setCoursesList(response.data)
        setAttributes(['name', 'slotsPerWeek'])
      })
      .catch((err) => {
        console.log(err)
      })
  }, [stateChanged])
  const handleDelete = (id) => {
    axios({
      method: 'DELETE',
      url: `${backendLink}/Course/deleteCourse`,
      headers: {
        'auth-token': token,
      },
      data: {
        courseId: id,
      },
    })
      .then((response) => {
        console.log(response)
        setStateChanged(!stateChanged)
      })
      .catch((err) => {
        console.log(err)
      })
  }
  const handleView = (id) => {
    history.push({
      pathname: '/CourseOperations',
      state: {
        type: 'view',
        courseId: id,
      },
    })
  }
  let form = (
    <CreateCourseForm
      stateChanged={stateChanged}
      setStateChanged={setStateChanged}
      setCourseListState={setCourseListState}
      type="create"
      courseId="5fde68addc0c4a2ac0e73b96"
    />
  )
  let list = (
    <>
      <ListView
        list={coursesList}
        attributes={attributes}
        headers={headers}
        actions={actions}
      />
    </>
  )

  let content
  if (courseListState == 'view') content = list
  else content = form
  let CreateButton
  if (type === 'hr')
    CreateButton = (
      <>
        <button
          className='borderTop-button'
          onClick={() => setCourseListState('add')}
        >
          Add Course
        </button>
      </>
    )
  return (
    <div className='main-page'>
      <p className='request-heading'>Courses</p>
      <div className='horizontalLine'>
        <button
          className='borderTop-button'
          onClick={() => setCourseListState('view')}
          autoFocus
        >
          Course List
        </button>
        {CreateButton}
      </div>
      {content}
    </div>
  )
}
