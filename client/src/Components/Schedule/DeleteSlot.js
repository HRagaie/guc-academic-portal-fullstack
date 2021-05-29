import React from "react";
import { Modal, Button } from "react-bootstrap";
import backendLink from "../../keys_dev";
import axios from "axios";

function DeleteSlot(props) {
  const token = localStorage.getItem("Token");

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
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return <div></div>;
}
export default DeleteSlot;
