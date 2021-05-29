import { Fragment, useState } from "react";
import Modal_AssignMemberToSlot from "./Modal_AssignMemberToSlot";
import Modal_UpdateMemberToSlot from "./Modal_UpdateMemberToSlot";
import EditImage from "../../Images/editIcon.png";
import DeleteImage from "../../Images/trash-can.png";
import axios from "axios";

const CellRenderer = ({ value }) => {
  let slotArr = [];
  const [modalShow, setModalShow] = useState(false);
  const [editModalShow, setEditModalShow] = useState(false);
  const [slotid, setSlotID] = useState("");

  if (!value || !Array.isArray(value)) {
    return null;
  }
  value.forEach((elementArr) => {
    elementArr.forEach((v) => {
      slotArr.push(v);
    });
  });
  const sendReq = (key) => {
    setSlotID(key);
    setModalShow(true);
  };

  const DeleteImageClick = (key) => {
    setSlotID(key);
    const token = localStorage.getItem("Token");
    axios.defaults.baseURL = "http://localhost:5000";

    axios({
      method: "DELETE",
      url: "/slotAssignment/deleteSlotMemberAssign",
      headers: {
        "auth-token": token,
      },
      data: {
        assignmentId: key,
      },
    })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        const code = err.response.data.code;
        const message = err.response.data.message;
        console.log(message);
      });
  };
  const EditImageClick = (key) => {
    setSlotID(key);
    setEditModalShow(true);
  };
  return (
    <Fragment>
      {slotArr.map((v) => {
        if (v.memberName == null) {
          return (
            <div>
              <br></br>
              <button
                className="kohlyButton kohlyButton1"
                onClick={() => sendReq(v.key)}
                key={v.key}
              >
                {v.value}
              </button>
              <br></br>
            </div>
          );
        } else {
          return (
            <div>
              <br></br>
              <div
                style={{
                  backgroundColor: "#b6c1ff",
                  borderRadius: "25px",
                  textAlign: "center",
                  padding: "10px 10px 15px 15px",
                }}
              >
                {v.value}
              </div>
              <img
                className="del-img"
                src={DeleteImage}
                onClick={() => DeleteImageClick(v.key)}
              />
              <img
                className="edit-img"
                src={EditImage}
                onClick={() => EditImageClick(v.key)}
              />
              <br></br>
            </div>
          );
        }
      })}

      <Modal_AssignMemberToSlot
        show={modalShow}
        onHide={() => setModalShow(false)}
        slotid={slotid}
      />

      <Modal_UpdateMemberToSlot
        show={editModalShow}
        onHide={() => setEditModalShow(false)}
        slotid={slotid}
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
