import { Fragment, useState } from 'react'
import Modal_ReplacementReq from './Modal_ReplacementReq'

const CellRenderer = ({ value }) => {
  let slotArr = []
  const [modalShow, setModalShow] = useState(false)
  const [slotid, setSlotID] = useState('')
  const [courseid, setCourseID] = useState('')
  if (!value || !Array.isArray(value)) {
    return null
  }
  value.forEach((elementArr) => {
    slotArr = elementArr
  })
  const sendReplacementReq = (key, courseid) => {
    setSlotID(key)
    setModalShow(true)
    setCourseID(courseid)
  }
  return (
    <Fragment>
      {slotArr.map((v) => (
        <button
          className='kohlyButton kohlyButton1'
          onClick={() => sendReplacementReq(v.key, v.courseid)}
          key={v.key}
        >
          {v.value}
        </button>
      ))}

      <Modal_ReplacementReq
        show={modalShow}
        onHide={() => setModalShow(false)}
        slotid={slotid}
        courseid={courseid}
      />
    </Fragment>
  )
}

export const COLUMNS = [
  {
    Header: '',
    accessor: 'day',
    Cell: CellRenderer,
  },
  {
    Header: 'First Period',
    accessor: '1',
    Cell: CellRenderer,
  },
  {
    Header: 'Second Period',
    accessor: '2',
    Cell: CellRenderer,
  },
  {
    Header: 'Third Period',
    accessor: '3',
    Cell: CellRenderer,
  },
  {
    Header: 'Fourth Period',
    accessor: '4',
    Cell: CellRenderer,
  },
  {
    Header: 'Fifth Period',
    accessor: '5',
    Cell: CellRenderer,
  },
]
