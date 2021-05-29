import React, { useMemo, useState, useEffect } from 'react'
import { useTable } from 'react-table'
import { COLUMNS } from './Cols_ManageCourseSlots'
import '../../Styles/table.css'
import axios from 'axios'
import plusIcon from '../../Images/plusIcon.png'
import Modal_AddSlot from './Modal_AddSlot'
import backendLink from '../../keys_dev'

function ManageCourseSlots(props) {
  const token = localStorage.getItem('Token')
  const [error, setError] = useState('')
  const [scheduleData, setscheduleData] = useState([])
  const [modalAddShow, setModalAddShow] = useState(false)
  const [courseId, setCourseId] = useState('')
  const [groupedData, setGroupedData] = useState([])
  const [tableData, setTableData] = useState([])
  useEffect(() => {
    setCourseId(props.courseId)
  }, [props.courseId])
  useEffect(() => {
    axios
      .post(
        `${backendLink}/course/viewMemberSlotsInCourse`,
        { courseId: courseId },
        {
          headers: {
            'auth-token': token,
          },
        }
      )
      .then((response) => {
        setscheduleData(response.data)
        if (!response.data.code) {
          setGroupedData(
            scheduleData.reduce(
              (agg, cur) => {
                let slotString
                const target = agg[cur.day]
                let arr = []

                if (cur.member == null) {
                  slotString = {
                    key: cur._id,
                    value:
                      cur.course.name +
                      ' \n ' +
                      cur.room.type +
                      '  \n ' +
                      cur.room.name,
                    courseid: cur.course.id,
                  }
                } else {
                  slotString = {
                    key: cur._id,
                    value:
                      cur.course.name +
                      ' \n ' +
                      cur.room.type +
                      '  \n ' +
                      cur.room.name +
                      '  \n ' +
                      cur.member.name,
                    courseid: cur.course.id,
                  }
                }
                arr.push(slotString)
                if (target[cur.slot]) {
                  target[cur.slot].push(arr)
                } else {
                  target[cur.slot] = [arr]
                } 
                return agg
              },
              Object.assign(
                {},
                ...weekdays.map((day) => ({
                  [day]: {},
                }))
              )
            )
          )
          setTableData(
            Object.keys(groupedData).map((day) => ({
              day,
              ...groupedData[day],
            }))
          )
        }
        setError('')
      })
      .catch((err) => {
        console.log(err.response)
        const message = err.response && err.response.data.message
        setError(message)
      })
  }, [scheduleData])
  const AddSlot = () => {
    setModalAddShow(true)
  }
  const weekdays = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'saturday',
  ]

  const columns = useMemo(() => COLUMNS, [])
  const data = useMemo(() => tableData, [tableData])
  const tableInstance = useTable({
    columns,
    data,
  })
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      <div style={{ marginLeft: '10vw', marginBottom: '5vh' }}>
        <img className='add-icon' src={plusIcon} />
        <button className='add-icon-btn' onClick={() => AddSlot()}>
          Add Slot
        </button>
      </div>
      <Modal_AddSlot
        show={modalAddShow}
        onHide={() => setModalAddShow(false)}
        courseid={courseId}
      />
      <table
        {...getTableProps()}
        className='schedule'
        style={{ marginLeft: '5%' }}
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} className='tableRow'>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()} className='tableHeader'>
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()} className='tableRow'>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()} className='slot'>
                      {(() => {
                        let day = weekdays.includes(cell.value)

                        if (cell.value != undefined && !day) {
                          return (
                            <div className='tableCell'>
                              {cell.render('Cell')}
                            </div>
                          )
                        } else if (day) {
                          {
                            switch (cell.value) {
                              case 'sunday':
                                return <b>Sunday</b>
                              case 'monday':
                                return <b>Monday</b>
                              case 'tuesday':
                                return <b>Tuesday</b>
                              case 'wednesday':
                                return <b>Wednesday</b>
                              case 'thursday':
                                return <b>Thursday</b>
                              case 'saturday':
                                return <b>Saturday</b>
                              default:
                                return ''
                            }
                          }
                        } else {
                          return (
                            <div className='tableCell'>
                              {cell.render('Cell')}
                            </div>
                          )
                        }
                      })()}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default ManageCourseSlots
