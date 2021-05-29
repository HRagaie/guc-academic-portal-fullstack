import React, { useState, useEffect } from 'react'
import axios from 'axios'
import '../../Styles/ListView.css'
import backendLink from '../../keys_dev'
import ViewImage from '../../Images/ViewImage.png'
import EditImage from '../../Images/EditImage.png'
import DeleteImage from '../../Images/DeleteImage.png'
import { useHistory } from 'react-router-dom'
import ListView from '../ListView'
import AddEditViewDepartment from '../AddEditViewDepartment'

export default function DepartmentsListView() {
  const [departmentsList, setDepartmentsList] = useState([])
  const [headers, setHeaders] = useState([])
  const [attributes, setAttributes] = useState([])
  const [stateChanged, setStateChanged] = useState(false)
  const history = useHistory()
  const token = localStorage.getItem('Token')
  const type = localStorage.getItem('type')
  const [actions, setActions] = useState([])
  const [departmentsListState, setDepartmentsListState] = useState('list')

  useEffect(() => {
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
    axios({
      method: 'GET',
      url: `${backendLink}/department/viewAllDepartments`,
      headers: {
        'auth-token': token,
      },
    })
      .then((response) => {
        console.log(response)
        const data = response.data.departments
        setHeaders(['Name', 'Faculty', 'Action'])
        data.forEach((element) => {
          element.facultyName =
            (element.faculty && element.faculty.name) || 'No Faculty'
        })
        setDepartmentsList(data)
        setAttributes(['name', 'facultyName'])
      })
      .catch((err) => {
        console.log(err.response)
      })
  }, [stateChanged, departmentsListState])

  const handleDelete = (id) => {
    axios({
      method: 'DELETE',
      url: `${backendLink}/department/deleteDepartment`,
      headers: {
        'auth-token': token,
      },
      data: {
        id,
      },
    })
      .then((response) => {
        console.log(response)
        setStateChanged(!stateChanged)
      })
      .catch((err) => {
        console.log(err.response)
      })
  }
  const handleEdit = (id) => {
    history.push({
      pathname: '/DepartmentProfile',
      state: {
        type: 'edit',
        departmentId: id,
      },
    })
  }

  const handleView = (id) => {
    history.push({
      pathname: '/DepartmentProfile',
      state: {
        type: 'view',
        departmentId: id,
      },
    })
  }
  return (
    <div className='main-page'>
      <p className='request-heading'>Departments</p>
      <div className='horizontalLine'>
        <button
          className='borderTop-button'
          onClick={() => setDepartmentsListState('list')}
          autoFocus
        >
          Departments List
        </button>
        <button
          className='borderTop-button'
          onClick={() => setDepartmentsListState('add')}
        >
          Add Department
        </button>
      </div>

      {departmentsListState !== 'add' ? (
        <div>
          <ListView
            list={departmentsList}
            attributes={attributes}
            headers={headers}
            actions={actions}
          />
        </div>
      ) : (
        <AddEditViewDepartment
          type='create'
          setDepartmentsListState={setDepartmentsListState}
        />
      )}
    </div>
  )
}
