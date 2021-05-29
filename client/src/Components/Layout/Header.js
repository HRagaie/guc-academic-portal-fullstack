import React, { useState, useEffect, useReducer } from "react";
import SideBar from "./sideBar";
import axios from "axios";
import "../../Styles/header.css";
import bell from "../../Images/bell.png";
import { useHistory } from "react-router-dom";
import { Modal, Button, Row, Col, Form } from "react-bootstrap";
import backendLink from "../../keys_dev";
import { ToastContainer, toast, Zoom, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Header() {
  const [error, setError] = useState("");
  const [notification, setNotification] = useState([]);
  const token = localStorage.getItem("Token");
  const history = useHistory();
  const signIn = () => {
    axios
      .get("/member/signin", {
        headers: {
          "auth-token": token,
        },
      })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        const message = err.response.data.message;
        setError(message);
      });
  };
  const signOut = () => {
    axios
      .get("/member/signout", {
        headers: {
          "auth-token": token,
        },
      })
      .then((response) => {
        setNotification(response.data);
      })
      .catch((err) => {
        const message = err.response.data.message;
        setError(message);
      });
  };
  const LogOut = () => {
    axios
      .get("/member/logout", {
        headers: {
          "auth-token": token,
        },
      })
      .then((response) => {
        console.log(response);
        localStorage.clear();
        history.push("/");
        console.log(response);
      })
      .catch((err) => {
        const message = err.response.data.message;
        setError(message);
        console.log(message);
      });
  };
  const startTimer = () => {
    const timefn = setInterval(() => {
      notify();
    }, 60000);
  };
  const notify = () => {
    axios
      .get(`${backendLink}/request/notify`, {
        headers: {
          "auth-token": token,
        },
      })
      .then((response) => {
        setNotification(response.data);
        console.log(response);
      })
      .catch((err) => {
        const code = err.response.data.code;
        const message = err.response.data.message;
        console.log(err);
      });
    //dropdown:
    // let optionTemplate = notification.map((n, index) => (
    //   <option value={index}>{n.notificationDetails}</option>
    // ));
  };
  useEffect(() => {
    // calls the axios (notseen notifications) every 15 millieseconds to get new unseen notifications
    startTimer();
  }, []);

  useEffect(() => {
    notification.map((n) => {
      toast(n.notificationDetails, {
        className: "custom-toast",
        draggable: true,
        position: toast.POSITION.TOP_RIGHT,
      });
      axios
        .post(
          `${backendLink}/request/setNotifySeen`,
          {
            notifId: n._id,
          },
          {
            headers: { "auth-token": token },
          }
        )
        .then((res) => {
          console.log(res);
        })
        .catch((error) => {
          console.log(error.response);
        });
    });
  }, [notification]);

  return (
    <div>
      <div className="page-header">
        <div className="right">
          <button className="header-btn" onClick={() => signIn()}>
            {" "}
            attendance sign in
          </button>
          <button className="header-btn" onClick={() => signOut()}>
            attendance sign out
          </button>
          <img
            style={{ width: "1.2vw", cursor: "pointer" }}
            src={bell}
            onClick={() => notify()}
          />

          <button className="header-btn" onClick={() => LogOut()}>
            log out
          </button>
          <ToastContainer draggable={false} autoClose={8000} />
        </div>
      </div>
    </div>
  );
}
export default Header;
