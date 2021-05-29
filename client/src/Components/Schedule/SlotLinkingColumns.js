import { Fragment, useState } from "react";
import axios from "axios";
import AlertModal from "./AlertModal";

const CellRenderer = ({ value }) => {
  let slotArr = [];
  const token = localStorage.getItem("Token");
  const [error, setError] = useState("");
  const [modalShow, setModalShow] = useState(false);
  if (!value || !Array.isArray(value)) {
    return null;
  }

  value.forEach((elementArr) => {
    elementArr.forEach((v) => {
      slotArr.push(v);
    });
  });

  const sendSlotLinkingtReq = (key) => {
    axios
      .post(
        "/request/sendSlotLinking",
        {
          slotId: key,
        },
        {
          headers: {
            "auth-token": token,
          },
        }
      )
      .then((response) => {
        setModalShow(true);
        setError("Slot Linking Request Sent Successfully");
      })
      .catch((err) => {
        setModalShow(true);
        const message = err.response.data.message;
        setError(message);
      });
  };
  return (
    <Fragment>
      {slotArr.map((v) => {
        if (v.memberName == null) {
          return (
            <div>
              <button
                className="kohlyButton kohlyButton1"
                onClick={() => sendSlotLinkingtReq(v.key)}
                key={v.key}
              >
                {v.value}
              </button>
              <AlertModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                error={error}
              />
            </div>
          );
        } else {
          return (
            <div>
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
              <br></br>
            </div>
          );
        }
      })}
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
