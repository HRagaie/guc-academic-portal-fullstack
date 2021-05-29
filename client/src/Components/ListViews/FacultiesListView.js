import React, { useState, useEffect } from 'react'
import axios from 'axios'
import '../../Styles/ListView.css'
import backendLink from '../../keys_dev'
import ViewImage from '../../Images/ViewImage.png'
import EditImage from '../../Images/EditImage.png'
import DeleteImage from '../../Images/DeleteImage.png'
import { useHistory } from 'react-router-dom'
import ListView from '../ListView'
import AddEditViewFaculty from '../AddEditViewFaculty'

export default function FacultiesListView() {
  const [facultiesList, setFacultiesList] = useState([])
  const [headers, setHeaders] = useState([])
  const [attributes, setAttributes] = useState([])
  const [stateChanged, setStateChanged] = useState(false)
  const history = useHistory()
  const token = localStorage.getItem('Token')
  const type = localStorage.getItem('type')
  const [actions, setActions] = useState([])
  const [facultiesListState, setFacultiesListState] = useState('list')

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
      url: `${backendLink}/faculty/viewAllFaculties`,
      headers: {
        'auth-token': token,
      },
    })
      .then((response) => {
        console.log(response)
        setHeaders(['Name', 'Action'])
        setFacultiesList(response.data.faculties)
        setAttributes(['name'])
      })
      .catch((err) => {
        console.log(err.response)
      })
  }, [stateChanged, facultiesListState])

  const handleDelete = (id) => {
    axios({
      method: 'DELETE',
      url: `${backendLink}/faculty/deleteFaculty`,
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
      pathname: '/FacultyProfile',
      state: {
        type: 'edit',
        facultyId: id,
      },
    })
  }
  const handleView = (id) => {
    history.push({
      pathname: '/FacultyProfile',
      state: {
        type: 'view',
        facultyId: id,
      },
    })
  }
  return (
    <div className='main-page'>
      <p className='request-heading'>Faculties</p>
      <div className='horizontalLine'>
        <button
          className='borderTop-button'
          onClick={() => setFacultiesListState('list')}
          autoFocus
        >
          Faculties List
        </button>
        <button
          className='borderTop-button'
          onClick={() => setFacultiesListState('add')}
        >
          Add Faculty
        </button>
      </div>

      {facultiesListState !== 'add' ? (
        <div>
          <ListView
            list={facultiesList}
            attributes={attributes}
            headers={headers}
            actions={actions}
          />
        </div>
      ) : (
        <AddEditViewFaculty
          type='create'
          setFacultiesListState={setFacultiesListState}
        />
      )}
    </div>
  )
}
