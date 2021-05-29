import React, { useState, useEffect } from 'react'
import axios from 'axios'
import '../../Styles/ListView.css'
import backendLink from '../../keys_dev'
import { useHistory } from 'react-router-dom'
import ListView from '../ListView'
import Filters from '../Filters'

export default function AttendanceListView(props) {
  const months = [
    {
      text: 'January',
      value: 1,
    },
    {
      text: 'February',
      value: 2,
    },
    {
      text: 'March',
      value: 3,
    },
    {
      text: 'April',
      value: 4,
    },
    {
      text: 'May',
      value: 5,
    },
    {
      text: 'June',
      value: 6,
    },
    {
      text: 'July',
      value: 7,
    },
    {
      text: 'August',
      value: 8,
    },
    {
      text: 'September',
      value: 9,
    },
    {
      text: 'October',
      value: 10,
    },
    {
      text: 'November',
      value: 11,
    },
    {
      text: 'December',
      value: 12,
    },
  ]

  const [error, setError] = useState('')
  const years = []
  const currentYear = new Date().getFullYear()
  for (let i = currentYear - 5; i <= currentYear; i++)
    years.push({
      value: i,
      text: i,
    })
  const [attendanceRecordsList, setAttendanceRecordsList] = useState([])
  const [headers, setHeaders] = useState([])
  const [attributes, setAttributes] = useState([])
  const [stateChanged, setStateChanged] = useState(false)

  const [filters, setFilters] = useState([
    {
      type: 'dropdown',
      label: 'Month',
      name: 'month',
      options: months,
    },
    {
      type: 'dropdown',
      label: 'Year',
      name: 'year',
      options: years,
    },
  ])
  const [filterObject, setFilterObject] = useState({
    month: '',
    year: '',
  })
  const history = useHistory()
  const token = localStorage.getItem('Token')
  const type = localStorage.getItem('type')
  const memberId = props.memberId
  const [actions, setActions] = useState([])

  useEffect(() => {
    let url
    let reqBody = {}
    if (memberId === localStorage.getItem('memberId')) {
      url = `${backendLink}/attendance/viewMyAttendance`
    } else {
      url = `${backendLink}/attendance/viewMemberAttendance`
      reqBody['memberId'] = memberId
    }
    if (
      (filterObject.month && !filterObject.year) ||
      (filterObject.year && !filterObject.month)
    )
      setError('Please Add Both Month And Year')
    else {
      if (filterObject.month && filterObject.year) {
        reqBody['month'] = filterObject.month
        reqBody['year'] = filterObject.year
      }
      axios({
        method: 'POST',
        url: url,
        headers: {
          'auth-token': token,
        },
        data: reqBody,
      })
        .then((response) => {
          console.log(response)
          setHeaders(['Member Name', 'Type', 'Date', 'Time'])
          const data = response.data.data
          data.forEach((element) => {
            element.memberName = element.member.name
            const timePart = element.date.split('T')[1].split(':')
            element.time = timePart[0] + ':' + timePart[1]
            element.date = element.date.split('T')[0]
          })
          setAttendanceRecordsList(data)
          setAttributes(['memberName', 'type', 'date', 'time'])
          setError('')
        })
        .catch((err) => {
          console.log(err.response)
        })
    }
  }, [filterObject])

  return (
    <div>
      <table className='missingDaysTable'>
        <tbody>
          <tr>
            <td className='missingDaysCol'>Missing Days</td>
            <td>{props.missingDaysHours.missingDays || 0}</td>
          </tr>
          <tr>
            <td className='missingDaysCol'>Missing Time</td>
            <td>
              {((props.missingDaysHours.missingTime &&
                props.missingDaysHours.missingTime.hours) ||
                0) +
                '  hours    ' +
                ((props.missingDaysHours.missingTime &&
                  props.missingDaysHours.missingTime.mins) ||
                  0) +
                '    mins'}
            </td>
          </tr>
          <tr>
            <td className='missingDaysCol'>Extra Time</td>
            <td>
              {((props.missingDaysHours.extraTime &&
                props.missingDaysHours.extraTime.hours) ||
                0) +
                '  hours    ' +
                ((props.missingDaysHours.extraTime &&
                  props.missingDaysHours.extraTime.mins) ||
                  0) +
                '    mins'}
            </td>
          </tr>
        </tbody>
      </table>
      <Filters
        filters={filters}
        setFilters={setFilters}
        filterObject={filterObject}
        setFilterObject={setFilterObject}
        error={error}
      />
      <ListView
        list={attendanceRecordsList}
        headers={headers}
        attributes={attributes}
      />
    </div>
  )
}
