import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Row, Col, Form } from "react-bootstrap";
import backendLink from "../../keys_dev";

function Modal_AddSlot(props) {
  const token = localStorage.getItem("Token");
  const [dropDownSlotValue, setDropDownSlotValue] = useState("");
  const [dropDownRoomValue, setDropDownRoomValue] = useState("");
  const [dropDownDayValue, setDropDownDayValue] = useState("");
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
  useEffect(() => {
    axios
      .get(`${backendLink}/room/getRooms`, {
        headers: {
          "auth-token": token,
        },
      })
      .then((response) => {
        let x = [];
        let y = [];
        response.data.rooms.forEach((room) => {
          x.push(room.name);
          y.push(room.id);
        });
        setRoomArr(x);
        setRoomIdArr(y);
      })
      .catch((err) => {
        const message = err.response.data.message;
        setError(message);
      });
  }, []);
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

  const handleSubmit = (e) => {
    e.preventDefault();

    let slot = dropDownSlotValue;
    let day = dropDownDayValue;
    let type = dropDownTypeValue;
    let room = roomId[dropDownRoomValue];
    axios
      .post(
        `${backendLink}/slotAssignment/addSlot`,
        {
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
        if (response.data.code == "026") {
          setError1("Please choose an available room");
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
        setError("Please make sure no field is empty");
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
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          <div style={{ color: "#17a2b8" }}>Add New Slot to Course</div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container">
          <Row>
            <Col sm={10}>
              <Form>
                <Form.Group controlId="Slot Time" style={{ paddingTop: "0px" }}>
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
      <Modal.Footer>
        <Col xs={12}>
          <b>{error}</b>
          <br></br>
          <b>{error1}</b>
        </Col>
        <button
          className="sendReqBtn"
          type="submit"
          onClick={handleSubmit}
          onSubmit={props.onHide}
        >
          Add
        </button>
      </Modal.Footer>
    </Modal>
  );
}
export default Modal_AddSlot;
