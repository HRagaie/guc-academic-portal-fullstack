import React, { useMemo, useState, useEffect } from 'react'
import { useTable } from 'react-table'
import { COLUMNS } from './ColumnWithNoButton'
import '../../Styles/table.css'
import axios from 'axios'
import SideBar from '../Layout/sideBar'
import Header from '../Layout/Header'

function ViewCourseSchedule(props) {
  const token = localStorage.getItem('Token')
  const [error, setError] = useState('')
  const [scheduleData, setscheduleData] = useState([])
  const [courseID, setCourseID] = useState('')
  const [groupedData, setGroupedData] = useState([])
  useEffect(() => {
    setCourseID(props.courseId)
  }, [])

  useEffect(() => {
    if (courseID !== '') {
      axios
        .post(
          '/course/viewMemberSlotsInCourse',
          { courseId: courseID },
          {
            headers: {
              'auth-token': token,
            },
          }
        )
        .then((response) => {
          /*
          let finalArr = [];
          let schedTemp = response.data;
          schedTemp.forEach((element) => {
            let x = element.member.schedule;
            x.forEach((slot) => {
              finalArr.push(slot);
            });
          });
  
          setscheduleData(finalArr);
          */
          setscheduleData(response.data)
          setGroupedData(
            response.data.reduce(
              (agg, cur) => {
                let slotString
                const target = agg[cur.day]
                let arr = []

                if (cur.member == null) {
                  slotString =
                    cur.course.name +
                    ' \n ' +
                    cur.room.type +
                    '  \n ' +
                    cur.room.name
                } else {
                  slotString =
                    cur.course.name +
                    ' \n ' +
                    cur.room.type +
                    '  \n ' +
                    cur.room.name +
                    '  \n ' +
                    cur.member.name
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

          setError('')
        })
        .catch((err) => {
          const message = err.response && err.response.data.message
          setError(message)
        })
    }
  }, [courseID])

  const weekdays = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'saturday',
  ]
  console.log(scheduleData)

  const tableData = Object.keys(groupedData).map((day) => ({
    day,
    ...groupedData[day],
  }))

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
      {/* <SideBar />
      <Header /> */}
      <table {...getTableProps()} className='schedule'>
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
                          return ''
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

export default ViewCourseSchedule
