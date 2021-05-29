import React, { useState, useEffect } from 'react'
import '../Styles/Filters.css'

export default function Filter(props) {
  return (
    <div className='single-filter'>
      <table>
        <tbody>
          <tr>
            <td>
              <span className='filter-label'>{props.label}</span>
            </td>
            <td>
              {props.type === 'dropdown' ? (
                <select
                  onChange={props.handleChange}
                  name={props.name}
                  value={props.value}
                  className='filter-input'
                >
                  <option disabled></option>
                  {props.options.map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.text}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  className='filter-input'
                  type={props.type}
                  name={props.name}
                  value={props.value}
                  onChange={props.handleChange}
                />
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
