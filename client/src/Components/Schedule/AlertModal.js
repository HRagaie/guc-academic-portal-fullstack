import React from "react";
import { Modal, Button } from "react-bootstrap";
function AlertModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Message</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>{props.error}</div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
export default AlertModal;
