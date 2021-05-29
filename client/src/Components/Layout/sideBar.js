import React, { useState, useEffect } from 'react'
import { Card, Container, Row, Col, Button } from 'react-bootstrap'
import axios from 'axios'
import Option from './options'
import {
  HROptions,
  RequestOptions,
  HodInstructorOptions,
  TAOptions,
} from './SideBarData'
import backendLink from '../../keys_dev'
import '../../Styles/sidebar.css'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import Collapse from 'react-bootstrap/Collapse'

import logo from '../../Images/GUCLogo.png'
import guc from '../../Images/guc.jpg'
import requst from '../../Images/request.png'
import RequestOption from './RequestOptions'

export default function SideBar(props) {
  const [open, setOpen] = useState(false)
  // HodInstructorOptions, TAOptions ,HROptions
  let memberType = localStorage.getItem('type')
  // HR: 'hr',
  // HOD: 'head of department',
  // INSTRUCTOR: 'instructor',
  // TA: 'teaching assistant',
  // COORDINATOR: 'coordinator',
  let optionsArr
  if (memberType === 'hr') optionsArr = HROptions
  else if (memberType === 'teaching assistant') optionsArr = TAOptions
  else optionsArr = HodInstructorOptions
  let dropDown

  if (memberType !== 'hr') {
    dropDown = (
      <div>
        {' '}
        <div
          className='options'
          onClick={() => setOpen(!open)}
          aria-expanded={open}
        >
          <img className='icon' src={requst} />
          <h2 className='link'>Requests</h2>
        </div>
        <Collapse in={open}>
          <div id='example-collapse-text' className='dropDown'>
            <ul>
              {RequestOptions.map((name) => (
                <li className='list'>
                  <RequestOption to={name} />
                </li>
              ))}
            </ul>
          </div>
        </Collapse>
      </div>
    )
  }
  return (
    <div className='sidebar'>
      <img src={guc} className='guc' />
      <img src={logo} className='logo' />

      {optionsArr.map((obj, index) => (
        <Option to={obj.name} iconSrc={obj.iconSrc} key={index} />
      ))}

      {dropDown}
    </div>
  )
}
