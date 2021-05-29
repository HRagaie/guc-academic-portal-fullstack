import React, { useState, useEffect } from "react";
import { Card, Container, Row, Col, Button } from "react-bootstrap";
import axios from "axios";
import backendLink from "../../keys_dev";
import "../../Styles/CreateRequest.css";

export default function CreateAnnualRequest(props) {
  const token = localStorage.getItem("Token");

  const [availableReplacements, setAvailableReplacements] = useState([]);
  const [requestDetails, setRequestDetails] = useState({
    from: "",
    to: "",
    reason: "",
    replacements: [],
  });
  const [error, setError] = useState("");

  useEffect(() => {
    axios({
      method: "POST",
      url: `${backendLink}/request/viewReplacementRequests`,
      headers: {
        "auth-token": token,
      },
    })
      .then((response) => {
        console.log(response);
        const myRequests = response.data.myRequests;
        const options = [];
        myRequests.forEach((request) => {
          request.status === "accept" &&
            options.push({
              id: request._id,
              text: `${request.replacementMember.name} accepted replacement on ${request.slot.day} slot ${request.slot.slot}`,
            });
        });
        setAvailableReplacements(options);
      })
      .catch((err) => {
        console.log(err.response);
      });
  }, []);

  const handleChange = (e) => {
    const name = e.target.name;
    const value =
      name === "replacements"
        ? Array.from(e.target.selectedOptions, (option) => option.value)
        : e.target.value;
    setRequestDetails((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const handleClick = (e) => {
    const requestBody = {};
    requestBody.from = requestDetails.from;
    requestBody.to = requestDetails.to;
    requestBody.replacements = requestDetails.replacements;
    console.log(requestBody);
    if (requestDetails.reason.length !== 0) {
      requestBody.reason = requestDetails.reason;
    }
    e.preventDefault();
    axios({
      method: "POST",
      url: `${backendLink}/request/sendAnnualLeaveRequest`,
      headers: {
        "auth-token": token,
      },
      data: requestBody,
    })
      .then((response) => {
        if (response.data.code) {
          setError(response.data.message);
        } else {
          console.log(response);
          setError("");
          setRequestDetails({
            from: "",
            to: "",
            reason: "",
            replacements: [],
          });
        }
      })
      .catch((err) => {
        const code = err.response.data.code;
        const message = err.response.data.message;
        setError(message);
      });
  };
  return (
    <div>
      <Card className="createRequest-card">
        <Card.Body>
          <Container>
            <Row xs={12}>
              <Col xs={12}>
                <p className="createRequest-header">
                  Annual Request Information
                </p>
              </Col>
            </Row>
            <Row>
              <Col xs={3}>
                <p className="createRequest-label">From*</p>
              </Col>
              <Col xs={9}>
                <input
                  className="createRequest-input"
                  value={requestDetails.from}
                  onChange={handleChange}
                  name="from"
                  type="date"
                />
              </Col>
            </Row>
            <Row>
              <Col xs={3}>
                <p className="createRequest-label">To*</p>
              </Col>
              <Col xs={9}>
                <input
                  className="createRequest-input"
                  value={requestDetails.to}
                  onChange={handleChange}
                  name="to"
                  type="date"
                />
              </Col>
            </Row>
            <Row>
              <Col xs={3}>
                <p className="createRequest-label">Reason</p>
              </Col>
              <Col xs={9}>
                <input
                  className="createRequest-input"
                  name="reason"
                  type="text"
                  placeholder=""
                  value={requestDetails.reason}
                  onChange={handleChange}
                  autoComplete="off"
                />
              </Col>
            </Row>
            <Row>
              <Col xs={3}>
                <p className="addEditViewMember-label">Replacements*</p>
              </Col>
              <Col xs={9}>
                <select
                  className="addEditViewMember-input"
                  value={requestDetails.replacements}
                  onChange={handleChange}
                  name="replacements"
                  multiple
                >
                  <option disabled selected value="noSelect">
                    Select Course Department
                  </option>
                  {availableReplacements.map((replacement) => (
                    <option value={replacement.id} key={replacement._id}>
                      {replacement.text}
                    </option>
                  ))}
                </select>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <p className="createRequest-error">{error}</p>
              </Col>
            </Row>
            <Row>
              <Col>
                <button className="createRequest-button" onClick={handleClick}>
                  Send Accidental Leave Request
                </button>
              </Col>
            </Row>
          </Container>
        </Card.Body>
      </Card>
    </div>
  );
}
