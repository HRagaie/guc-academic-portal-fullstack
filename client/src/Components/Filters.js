import React, { useState, useEffect } from 'react'
import { Card } from 'react-bootstrap'
import SingleFilter from './SingleFilter'
import '../Styles/Filters.css'

export default function Filters(props) {
  const handleChange = (e) => {
    const name = e.target.name
    const value = e.target.value
    props.setFilterObject((prevState) => {
      return {
        ...prevState,
        [name]: value,
      }
    })
  }
  return (
    <div className='filters-card'>
      <Card>
        <Card.Body style={{ display: 'flex', flexDirection: 'row' }}>
          {props.filters.map((singleFilter, index) => {
            return (
              <SingleFilter
                key={index}
                label={singleFilter.label}
                name={singleFilter.name}
                type={singleFilter.type}
                options={singleFilter.options}
                value={props.filterObject[singleFilter.name]}
                handleChange={handleChange}
              />
            )
          })}
          {props.error && <p>{props.error}</p>}
        </Card.Body>
      </Card>
    </div>
  )
}
