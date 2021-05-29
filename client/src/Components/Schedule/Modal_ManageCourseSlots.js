import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Row, Col, Form } from "react-bootstrap";
import Tabs from "react-bootstrap/Tabs";
import backendLink from "../../keys_dev";
import Tab from "react-bootstrap/Tab";
import "../../Styles/table.css";
import DeleteSlot from "./DeleteSlot";
import { Fragment } from "react";

function Modal_ManageCourseSlots(props) {
  const token = localStorage.getItem("Token");
  const [dropDownTypeValue, setDropDownTypeValue] = useState("");
  const [typeArr, setTypetArr] = useState(["lecture", "lab", "tutorial"]);
  const [roomArr, setRoomArr] = useState([]);
  const [roomId, setRoomIdArr] = useState([]);

  const [error, setError] = useState("");
  const [error1, setError1] = useState("");
  const [slotArr, setSlotArr] = useState([1, 2, 3, 4, 5]);
  const [dayArr, setDayArr] = useState([
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "saturday",
  ]);
  const [key, setKey] = useState("Edit Slot");

  const [dropDownSlotValue, setDropDownSlotValue] = useState("");
  const [dropDownRoomValue, setDropDownRoomValue] = useState("");
  const [dropDownDayValue, setDropDownDayValue] = useState("");
  useEffect(() => {
    axios
      .get(`${backendLink}/room/getRooms`, {
        headers: {
          "auth-token": token,
        },
      })
      .then((response) => {
        response.data.rooms.forEach((room) => {
          roomArr.push(room.name);
          roomId.push(room.id);
        });
      })
      .catch((err) => {
        const message = err.response.data.message;
        setError(message);
      });
  }, [roomArr]);
  const onDropdownTypeSelected = (e) => {
    setDropDownTypeValue(e.target.value);
  };
  const onDropdownRoomSelected = (e) => {
    setDropDownRoomValue(e.target.value);
  };
  const onDropdownSlotSelected = (e) => {
    setDropDownSlotValue(e.target.value);
  };
  const onDropdownDaySelected = (e) => {
    setDropDownDayValue(e.target.value);
  };

  const handleModalClose = () => {
    props.onHide();
  };

  const showEdit = () => {
    return (
      <Fragment>
        <Modal.Header style={{ border: "none" }}>
          <Modal.Title id="contained-modal-title-vcenter">
            <div style={{ color: "#17a2b8" }}>Add New Slot to Course</div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <Row>
              <Col sm={10}>
                <Form>
                  <Form.Group
                    controlId="Slot Time"
                    style={{ paddingTop: "0px" }}
                  >
                    <Form.Label>
                      <p style={{ fontWeight: "bold" }}>Slot Time*</p>
                    </Form.Label>
                    <Form.Control as="select" onChange={onDropdownSlotSelected}>
                      <option disabled selected value="" key={-1}>
                        select
                      </option>
                      {slotArrTemplate}
                    </Form.Control>
                  </Form.Group>
                  <Form.Group controlId="Day" style={{ paddingTop: "0px" }}>
                    <Form.Label>
                      <p style={{ fontWeight: "bold" }}>Day*</p>
                    </Form.Label>
                    <Form.Control as="select" onChange={onDropdownDaySelected}>
                      <option disabled selected value="" key={-1}>
                        select
                      </option>
                      {dayArrTemplate}
                    </Form.Control>
                  </Form.Group>
                  <Form.Group controlId="Type" style={{ paddingTop: "0px" }}>
                    <Form.Label>
                      <p style={{ fontWeight: "bold" }}>Type*</p>
                    </Form.Label>
                    <Form.Control as="select" onChange={onDropdownTypeSelected}>
                      <option disabled selected value="" key={-1}>
                        select
                      </option>
                      {typeArrTemplate}
                    </Form.Control>
                  </Form.Group>
                  <Form.Group controlId="Room" style={{ paddingTop: "0px" }}>
                    <Form.Label>
                      <p style={{ fontWeight: "bold" }}>Room*</p>
                    </Form.Label>
                    <Form.Control as="select" onChange={onDropdownRoomSelected}>
                      <option disabled selected value="" key={-1}>
                        select
                      </option>
                      {roomArrTemplate}
                    </Form.Control>
                  </Form.Group>
                </Form>
              </Col>
            </Row>
          </div>
        </Modal.Body>
        <Modal.Footer style={{ border: "none" }}>
          <Col xs={12}>
            <b>{error}</b>
            <br></br>
            <b>{error1}</b>
          </Col>
          <button className="sendReqBtn" type="submit" onClick={handleUpdate}>
            Edit
          </button>
        </Modal.Footer>
      </Fragment>
    );
  };

  const showDelete = () => {
    return (
      <Fragment>
        <Modal.Body>
          <Modal.Header style={{ border: "none" }}>
            <Modal.Title id="contained-modal-title-vcenter">
              <div style={{ color: "#17a2b8" }}>
                Are you sure you want to Delete this slot?
              </div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Footer style={{ border: "none" }}>
            <Col xs={12}>
              <b>{error}</b>
            </Col>
            <button className="sendReqBtn" type="submit" onClick={handleDelete}>
              Delete
            </button>
          </Modal.Footer>
        </Modal.Body>
      </Fragment>
    );
  };

  const handleDelete = (e) => {
    e.preventDefault();
    axios({
      method: "DELETE",
      url: `${backendLink}/slotAssignment/deleteSlot`,
      headers: {
        "auth-token": token,
      },
      data: {
        assignmentId: props.slotid,
      },
    })
      .then((response) => {
        console.log(response);
        handleModalClose();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleUpdate = (e) => {
    e.preventDefault();

    let slot = dropDownSlotValue;
    let day = dropDownDayValue;
    let type = dropDownTypeValue;
    let room = roomId[dropDownRoomValue];
    console.log(
      slot +
        " " +
        day +
        " " +
        type +
        " " +
        room +
        " " +
        props.courseid +
        " " +
        props.slotid
    );
    axios
      .put(
        `${backendLink}/slotAssignment/updateSlot`,
        {
          assignmentId: props.slotid,
          room,
          slot,
          course: props.courseid,
          day,
          type,
        },
        {
          headers: {
            "auth-token": token,
          },
        }
      )
      .then((response) => {
        console.log(response);
        if (response.data.code) {
          console.log(response.data.message);
        } else {
          setError1("");
          setError("");
          handleModalClose();
        }
      })
      .catch((err) => {
        const code = err.response.data.code;
        const message = err.response.data.message;
        console.log();
        setError(message);
      });
  };
  let slotArrTemplate = slotArr.map((slotTime, index) => (
    <option value={slotTime}>{slotTime}</option>
  ));
  let dayArrTemplate = dayArr.map((day, index) => (
    <option value={day}>{day}</option>
  ));
  let typeArrTemplate = typeArr.map((type, index) => (
    <option value={type}>{type}</option>
  ));

  let roomArrTemplate = roomArr.map((room, index) => (
    <option value={index}>{room}</option>
  ));
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton style={{ border: "none" }}></Modal.Header>
      <Modal.Body>
        <nav className="nav nav-tabs">
          <Tabs
            defaultActiveKey="Edit Slot"
            id="uncontrolled-tab-example"
            activeKey={key}
            onSelect={(k) => setKey(k)}
          >
            <Tab eventKey="Edit Slot" title="Edit">
              {showEdit()}
            </Tab>
            <Tab eventKey="Delete Slot" title="Delete">
              {showDelete()}
            </Tab>
          </Tabs>
        </nav>
      </Modal.Body>
    </Modal>
  );
}
export default Modal_ManageCourseSlots;
