import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Row, Col, Form } from "react-bootstrap";
import backendLink from "../../keys_dev";
import Columns from "./Columns";

function Modal_ReplacementReq(props) {
  const token = localStorage.getItem("Token");
  const id = localStorage.getItem("memberId");
  const [dropDownValue, setDropDownValue] = useState("");
  const [dateValue, setDateValue] = useState("");
  const [error, setError] = useState("");

  const [memberNames, setMemberNames] = useState([]);
  const [memberid, setMemberid] = useState([]);

  useEffect(() => {
    let courseId = props.courseid;
    if (courseId === "") {
    } else {
      axios
        .post(
          `${backendLink}/course/viewMemberInCourseHOD`,
          {
            courseId: courseId,
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
            element.member.id !== id && nameArr.push(element.member.name);
            element.member.id !== id && idArr.push(element.member.id);
          });

          setMemberNames(nameArr);
          setMemberid(idArr);
          setError("");
        })
        .catch((err) => {
          const message = err.response.data.message;
          setError(message);
        });
    }
  }, [props]);

  const handleChange = (e) => {
    setDateValue(e.target.value);
  };

  const onDropdownSelected = (e) => {
    setDropDownValue(e.target.value);
  };

  const handleModalClose = () => {
    props.onHide();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let replacementMemberId = memberid[dropDownValue];
    let dateOfReplacement = dateValue;
    let slotId = props.slotid;

    axios
      .post(
        `${backendLink}/request/sendReplacementRequest`,
        {
          replacementMemberId,
          dateOfReplacement,
          slotId,
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
        console.log(code);
        if (code == "001") {
          setError("Please make sure all fields are entered");
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
          <div style={{ color: "#17a2b8" }}>Send Replacement Request</div>
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
                    <p style={{ fontWeight: "bold" }}>Staff Replacement*</p>
                  </Form.Label>
                  <Form.Control as="select" onChange={onDropdownSelected}>
                    <option disabled selected value="" key={-1}>
                      select
                    </option>
                    {optionTemplate}
                  </Form.Control>
                </Form.Group>
                <Form.Group
                  controlId="dateOfReplacement"
                  style={{ paddingTop: "5px" }}
                >
                  <Form.Label>
                    <p style={{ fontWeight: "bold" }}>
                      Date of Requested Replacement*
                    </p>
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name="dateOfReplacement"
                    required
                    placeholder="date"
                    onChange={handleChange}
                  />
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
          Send Request
        </button>
      </Modal.Footer>
    </Modal>
  );
}
export default Modal_ReplacementReq;
