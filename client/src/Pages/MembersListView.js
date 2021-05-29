import React, { useState, useEffect } from 'react'
import axios from 'axios'
import '../Styles/ListView.css'
import backendLink from '../keys_dev'
import ViewImage from '../Images/ViewImage.png'
import EditImage from '../Images/EditImage.png'
import DeleteImage from '../Images/DeleteImage.png'
import { useHistory } from 'react-router-dom'
import ListView from '../Components/ListView'
import AddEditViewMember from '../Components/AddEditViewMember'
import Filters from '../Components/Filters'

export default function MembersListView() {
  const [membersList, setMembersList] = useState([])
  const [headers, setHeaders] = useState([])
  const [attributes, setAttributes] = useState([])
  const [stateChanged, setStateChanged] = useState(false)
  const history = useHistory()
  const token = localStorage.getItem('Token')
  const type = localStorage.getItem('type')
  const memberId = localStorage.getItem('memberId')
  const [actions, setActions] = useState([])
  const [filters, setFilters] = useState([])
  const [filterObject, setFilterObject] = useState({
    course: '',
  })
  const [membersListState, setMembersListState] = useState('list')
  const [membersDayoff, setMemebrsDayoff] = useState([])
  useEffect(() => {
    if (type === 'head of department') {
      axios({
        method: 'GET',
        url: `${backendLink}/course/viewCoursesInMyDepartment`,
        headers: {
          'auth-token': token,
        },
      })
        .then((response) => {
          console.log(response)
          const courses = response.data.courses
          const courseFilter = []
          courses.forEach((course) => {
            courseFilter.push({
              value: course._id,
              text: course.name,
            })
          })
          setFilters([
            {
              type: 'dropdown',
              label: 'Courses',
              name: 'course',
              options: courseFilter,
            },
          ])
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, [])

  useEffect(() => {
    if (membersListState === 'list') {
      let url = ''
      if (type === 'hr') {
        setActions([
          {
            src: DeleteImage,
            handle: handleDelete,
          },
         
          {
            src: ViewImage,
            handle: handleView,
          },
        ])
        url = `${backendLink}/member/viewAllMembers`
      } else {
        setActions([
          {
            src: ViewImage,
            handle: handleView,
          },
        ])
        url = `${backendLink}/department/viewMemberInDepartment`
      }
      axios({
        method: 'GET',
        url: url,
        headers: {
          'auth-token': token,
        },
      })
        .then((response) => {
          console.log(response)
          setHeaders(['Id', 'Name', 'Type', 'Email', 'Action'])
          if (localStorage.getItem('type') === 'hr')
            setMembersList(response.data.members)
          else setMembersList(response.data.department.membersPerDepartment)
          setAttributes(['customId', 'name', 'type', 'email'])
        })
        .catch((err) => {
          console.log(err)
        })
    } else if (membersListState === 'course') {
      const reqBody = {}
      if (filterObject.course !== '')
        reqBody['courseId'] = filterObject['course']
      axios({
        method: 'POST',
        url: `${backendLink}/course/viewMemberInCourseHOD`,
        headers: {
          'auth-token': token,
        },
        data: reqBody,
      })
        .then((response) => {
          console.log(response)
          const members = []
          response.data.forEach((element) => {
            members.push(element.member)
          })
          setHeaders(['Id', 'Name', 'Type', 'Email', 'Action'])
          setMembersList(members)
          setAttributes(['customId', 'name', 'type', 'email'])
        })
        .catch((err) => {
          console.log(err.response)
        })
    } else if (membersListState === 'dayoff') {
      axios({
        method: 'GET',
        url: `${backendLink}/department/viewAllMember_dayoff_InDepartment`,
        headers: {
          'auth-token': token,
        },
      })
        .then((response) => {
          console.log(response)
          const data = response.data
          setMemebrsDayoff(response.data)
          setHeaders(['Id', 'Name', 'Dayoff'])
          setAttributes(['customId', 'name', 'dayoff'])
          setActions(null)
        })
        .catch((err) => {
          console.log(err.response)
        })
    }
  }, [stateChanged, filterObject, membersListState])

  const handleDelete = (id) => {
    axios({
      method: 'DELETE',
      url: `${backendLink}/member/deleteMember`,
      headers: {
        'auth-token': token,
      },
      data: {
        memberId: id,
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
  const handleEdit = (id) => {
    history.push({
      pathname: '/MemberProfile',
      state: {
        type: 'edit',
        memberId: id,
      },
    })
  }
  const handleView = (id) => {
    history.push({
      pathname: '/MemberProfile',
      state: {
        type: 'view',
        memberId: id,
      },
    })
  }

  return (
    <div className='main-page'>
      <p className='request-heading'>Members</p>
      <div className='horizontalLine'>
        <button
          className='borderTop-button'
          onClick={() => setMembersListState('list')}
          autoFocus
        >
          Members List
        </button>
        {localStorage.getItem('type') === 'head of department' && (
          <button
            className='borderTop-button'
            onClick={() => setMembersListState('dayoff')}
          >
            View Members Dayoff
          </button>
        )}
        {(localStorage.getItem('type') === 'head of department' ||
          localStorage.getItem('type') === 'instructor') && (
          <button
            className='borderTop-button'
            onClick={() => setMembersListState('course')}
          >
            View Members Per Course
          </button>
        )}
        {localStorage.getItem('type') === 'hr' && (
          <button
            className='borderTop-button'
            onClick={() => setMembersListState('add')}
          >
            Add Member
          </button>
        )}
      </div>

      {membersListState !== 'add' ? (
        <div>
          {membersListState === 'course' && (
            <Filters
              filters={filters}
              setFilters={setFilters}
              filterObject={filterObject}
              setFilterObject={setFilterObject}
            />
          )}
          <ListView
            list={membersList}
            attributes={attributes}
            headers={headers}
            actions={actions}
          />
        </div>
      ) : (
        <AddEditViewMember
          type='create'
          setMembersListState={setMembersListState}
        />
      )}
    </div>
  )
}
