import React, { useState, useEffect } from 'react'
import axios from 'axios'
import '../../Styles/ListView.css'
import backendLink from '../../keys_dev'
import ViewImage from '../../Images/ViewImage.png'
import EditImage from '../../Images/EditImage.png'
import DeleteImage from '../../Images/DeleteImage.png'
import { useHistory } from 'react-router-dom'
import ListView from '../ListView'
import AddEditViewRoom from '../AddEditViewRoom'

export default function FacultiesListView() {
  const [roomsList, setRoomsList] = useState([])
  const [headers, setHeaders] = useState([])
  const [attributes, setAttributes] = useState([])
  const [stateChanged, setStateChanged] = useState(false)
  const history = useHistory()
  const token = localStorage.getItem('Token')
  const type = localStorage.getItem('type')
  const [actions, setActions] = useState([])
  const [roomsListState, setRoomsListState] = useState('list')

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
      url: `${backendLink}/room/viewAllRooms`,
      headers: {
        'auth-token': token,
      },
    })
      .then((response) => {
        console.log(response)
        setHeaders(['Name', 'Type', 'Capacity', 'Action'])
        setRoomsList(response.data.rooms)
        setAttributes(['name', 'type', 'capacity'])
      })
      .catch((err) => {
        console.log(err)
      })
  }, [stateChanged, roomsListState])

  const handleDelete = (id) => {
    axios({
      method: 'DELETE',
      url: `${backendLink}/room/deleteRoom`,
      headers: {
        'auth-token': token,
      },
      data: {
        roomId: id,
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
      pathname: '/RoomProfile',
      state: {
        type: 'edit',
        roomId: id,
      },
    })
  }
  const handleView = (id) => {
    history.push({
      pathname: '/RoomProfile',
      state: {
        type: 'view',
        roomId: id,
      },
    })
  }
  return (
    <div className='main-page'>
      <p className='request-heading'>Rooms</p>
      <div className='horizontalLine'>
        <button
          className='borderTop-button'
          onClick={() => setRoomsListState('list')}
          autoFocus
        >
          Rooms List
        </button>
        <button
          className='borderTop-button'
          onClick={() => setRoomsListState('add')}
        >
          Add Room
        </button>
      </div>

      {roomsListState !== 'add' ? (
        <div>
          <ListView
            list={roomsList}
            attributes={attributes}
            headers={headers}
            actions={actions}
          />
        </div>
      ) : (
        <AddEditViewRoom type='create' setRoomsListState={setRoomsListState} />
      )}
    </div>
  )
}
