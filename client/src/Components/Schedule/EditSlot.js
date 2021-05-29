import React from "react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Row, Col, Form } from "react-bootstrap";
import "../../Styles/table.css";

function EditSlot() {
  return (
    <div className="container">
      <Row>
        <Col sm={10}>
          <Form>
            <Form.Group controlId="replacementId" style={{ paddingTop: "0px" }}>
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
  );
}
export default EditSlot;
