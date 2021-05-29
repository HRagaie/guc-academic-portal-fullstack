import React, { useState, useEffect } from 'react'
import { Card, Container, Row, Col, Button } from 'react-bootstrap'

import '../../Styles/options.css'
import '../../Styles/sidebar.css'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
export default function RequestOption(props) {
  return (
  
      <Link className='requestOptions' to={props.to.split(' ').join('')}>
        <h3 className='Requestlink'>{props.to}</h3>
      </Link>
  
  )
}
