import React, { useState, useEffect } from 'react'
import { Card, Container, Row, Col, Button } from 'react-bootstrap'
import axios from 'axios'
import backendLink from '../../keys_dev'
import '../../Styles/options.css'
import '../../Styles/sidebar.css'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
export default function Option(props) {
  const token = localStorage.getItem('Token')
  const [clicked, setclicked] = useState({
    backgroundColor: '#17a2b8',
  })
  const handleClick = () => {
    setclicked('#74c7b8')
  }
  // let prpath=props.path
  return (
    <Link className='options' to={props.to.split(' ').join('')}>
      <img className='icon' src={props.iconSrc} />
      <h2 className='link'>{props.to}</h2>
    </Link>
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
