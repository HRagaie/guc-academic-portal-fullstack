import { Fragment, useState } from "react";
import Modal_ManageCourseSlots from "./Modal_ManageCourseSlots";

import axios from "axios";

const CellRenderer = ({ value }) => {
  let slotArr = [];
  const [modalShow, setModalShow] = useState(false);

  const [slotid, setSlotID] = useState("");
  const [courseid, setCourseID] = useState("");

  if (!value || !Array.isArray(value)) {
    return null;
  }
  value.forEach((elementArr) => {
    elementArr.forEach((v) => {
      slotArr.push(v);
    });
  });

  const slotAction = (key, id) => {
    setSlotID(key);
    setModalShow(true);
    setCourseID(id);
    console.log(id);
  };
  return (
    <Fragment>
      {slotArr.map((v) => (
        <div>
          <button
            className="kohlyButton kohlyButton1"
            onClick={() => slotAction(v.key, v.courseid)}
            key={v.key}
          >
            {v.value}
          </button>
        </div>
      ))}
      <Modal_ManageCourseSlots
        show={modalShow}
        onHide={() => setModalShow(false)}
        slotid={slotid}
        courseid={courseid}
      />
    </Fragment>
  );
};

export const COLUMNS = [
  {
    Header: "",
    accessor: "day",
    Cell: CellRenderer,
  },
  {
    Header: "First Period",
    accessor: "1",
    Cell: CellRenderer,
  },
  {
    Header: "Second Period",
    accessor: "2",
    Cell: CellRenderer,
  },
  {
    Header: "Third Period",
    accessor: "3",
    Cell: CellRenderer,
  },
  {
    Header: "Fourth Period",
    accessor: "4",
    Cell: CellRenderer,
  },
  {
    Header: "Fifth Period",
    accessor: "5",
    Cell: CellRenderer,
  },
];
