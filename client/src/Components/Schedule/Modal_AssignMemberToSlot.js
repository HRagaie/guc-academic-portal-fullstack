import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Row, Col, Form } from "react-bootstrap";

function Modal_AssignMemberToSlot(props) {
  const token = localStorage.getItem("Token");
  const [dropDownValue, setDropDownValue] = useState("");
  const [error, setError] = useState("");

  const [memberNames, setMemberNames] = useState([]);
  const [memberid, setMemberid] = useState([]);

  useEffect(() => {
    axios.defaults.baseURL = "http://localhost:5000";
    axios
      .post(
        "course/viewMemberInCourseHOD",
        {
          courseId: "5ff211193dd7ce27640cf220",
        },
        {
          headers: {
            "auth-token": token,
          },
        }
      )
      .then((response) => {
        let nameArr = [];
        let idArr = [];
        response.data.forEach((element) => {
          nameArr.push(element.member.name);
          idArr.push(element.member.id);
        });

        setMemberNames(nameArr);
        setMemberid(idArr);
        setError("");
      })
      .catch((err) => {
        const message = err.response.data.message;
        setError(message);
      });
  }, []);

  const onDropdownSelected = (e) => {
    setDropDownValue(e.target.value);
  };

  const handleModalClose = () => {
    props.onHide();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let memberId = memberid[dropDownValue];
    let assignmentId = props.slotid;
    axios.defaults.baseURL = "http://localhost:5000";
    axios
      .post(
        "/slotAssignment/assignSlotToMember",
        {
          assignmentId,
          memberId,
        },
        {
          headers: {
            "auth-token": token,
          },
        }
      )
      .then((response) => {
        console.log(response);
        handleModalClose();
      })
      .catch((err) => {
        const code = err.response.data.code;
        const message = err.response.data.message;
        if (code == "001") {
          setError("Please choose a staff");
        } else {
          setError(message);
        }
      });
  };
  let optionTemplate = memberNames.map((name, index) => (
    <option value={index}>{name}</option>
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
          <div style={{ color: "#17a2b8" }}>Assign Staff To Course Slot</div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container">
          <Row>
            <Col sm={10}>
              <Form>
                <Form.Group
                  controlId="replacementId"
                  style={{ paddingTop: "0px" }}
                >
                  <Form.Label>
                    <p style={{ fontWeight: "bold" }}>Choose Staff Name*</p>
                  </Form.Label>
                  <Form.Control as="select" onChange={onDropdownSelected}>
                    <option disabled selected value="" key={-1}>
                      select
                    </option>
                    {optionTemplate}
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
        </Col>
        <button
          className="sendReqBtn"
          type="submit"
          onClick={handleSubmit}
          onSubmit={props.onHide}
        >
          Confirm
        </button>
      </Modal.Footer>
    </Modal>
  );
}
export default Modal_AssignMemberToSlot;
