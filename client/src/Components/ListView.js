import React, { useState, useEffect } from 'react'
import Table from 'react-bootstrap/Table'
import AcceptRejectCancelModal from './Modals/AcceptRejectCancelModal'

export default function ListView(props) {
  const handleCloseModal = () => {
    props.setError('')
    props.setModalState((prevState) => {
      return {
        ...prevState,
        show: false,
      }
    })
  }

  const handleChangeModalState = (type, id, handle) => {
    props.setModalState({
      show: true,
      type,
      handle,
      id,
    })
  }

  return (
    <div className='list-div'>
      <Table striped bordered hover className='listTable'>
        <thead>
          <tr>
            {props.headers.map((header) => {
              return <th key={header}>{header}</th>
            })}
          </tr>
        </thead>
        <tbody className='tableBody'>
          {props.list.map((element, index) => {
            return (
              <tr key={element['_id']}>
                {props.attributes.map((attribute) => {
                  return (
                    <td key={attribute} className='list-col'>
                      {element[attribute]}
                    </td>
                  )
                })}
                {props.actions && (
                  <td className='actions-col'>
                    {props.actions.map((action, i) => {
                      return (
                        <div className="blockIcon">
                        <img
                          key={i}
                          className='table-img'
                          src={action.src}
                          onClick={
                            props.modalState
                              ? () =>
                                  handleChangeModalState(
                                    action.type,
                                    element['_id'],
                                    action.handle
                                  )
                              : () => action.handle(element['_id'])
                          }
                        />
                        </div>
                      )
                    })}
                  </td>
                )}
              </tr>
            )
          })}
        </tbody>
      </Table>
      {props.modalState && (
        <AcceptRejectCancelModal
          show={props.modalState.show}
          type={props.modalState.type}
          handle={props.modalState.handle}
          id={props.modalState.id}
          onHide={handleCloseModal}
          error={props.error}
          setError={props.setError}
        />
      )}
    </div>
  )
}
