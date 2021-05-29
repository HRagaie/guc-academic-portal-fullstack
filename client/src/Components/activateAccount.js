import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Styles/login.css";

function ActivateAccount(props) {
  let [passwordIn, setPassword] = useState(""); // new password
  let [buttonPressed, setButtonPressed] = useState(false);
  let [error, setError] = useState("");

  const passwordInput = (e) => {
    setPassword(e.target.value);
  };
  const resetPassword = (e) => {
    setButtonPressed(!buttonPressed);
  };

  useEffect(() => {
    if (buttonPressed) {
      setButtonPressed(!buttonPressed);
      if (passwordIn !== "") {
        axios
          .post("/member/resetPassword", {
            memberId: localStorage.getItem("memberId"),
            newPassword: passwordIn,
          })
          .then((res) => {
            // redirect to login page to login with new password
            props.history.push("/login");
          })
          .catch((err) => {
            console.log(err.response);
          });
      } else {
        setError("Please enter a new password");
      }
    }
  }, [buttonPressed]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#e8e9e8",
      }}
    >
      <div className="loginActivateCard">
        <div className="card-body">
          <div className="card-title m-5"> ACCOUNT ACTIVATION </div>

          <div className="form-group">
            <input
              type="password"
              className="form-control"
              placeholder="New Password"
              value={passwordIn}
              onChange={passwordInput}
            />
          </div>

          <div className="text-danger">{error}</div>

          <button
            onClick={resetPassword}
            type="button"
            className="btn btn-info btn-block"
          >
            Activate
          </button>
        </div>
      </div>
    </div>
  );
}
export default ActivateAccount;
