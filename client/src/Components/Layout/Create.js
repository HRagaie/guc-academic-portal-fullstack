import React, { useState, useEffect } from 'react'
import { Card, Container, Row, Col, Button, Image } from 'react-bootstrap'
import axios from 'axios'
import backendLink from '../../keys_dev'
import '../../Styles/options.css'
import '../../Styles/sidebar.css'
import plus from '../../Images/plusBlue.png'

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
export default function Create(props) {
  const [createtype, setCreatetype] = useState(props.type)
  useEffect(() => {
    setCreatetype(props.type)
  }, [])
  return (
    <>
      <Container>
        <Row style={{ marginBottom: '1vh' }}>
          <div className='myBlock'>
            <Image
              className='image'
              src={plus}
              roundedCircle
              style={{ cursor: 'pointer' }}
              onClick={() => props.setAssignModal(true)}
            />
          </div>
          <h4 className='Create'>Assign {createtype} </h4>
        </Row>
      </Container>
    </>
  )
}

{
  /* <div className='options'>
<img className='icon' src={props.iconSrc}/>
<Link className='link' to={props.to}>
  {props.to}
</Link>
</div> */
}
