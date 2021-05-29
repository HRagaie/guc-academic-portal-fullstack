import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Styles/ProfileView.css";
import "../Styles/ListView.css";
import backendLink from "../keys_dev";
import ViewImage from "../Images/ViewImage.png";
import EditImage from "../Images/EditImage.png";
import DeleteImage from "../Images/DeleteImage.png";
import { useHistory } from "react-router-dom";
import ListView from "../Components/ListView";
import AddEditViewCourse from "../Components/AddEditViewCourse";
import Filters from "../Components/Filters";
import AttendanceListView from "../Components/ListViews/AttendanceListView";
import AssignMember from "./AssignMembers";
import CourseSchedule from "../Components/Schedule/ViewCourseSchedule";
import AssignMemberToSlot from "./Schedule/AssignMemberToSlot";
import ManageCourseSlots from "./Schedule/ManageCourseSlots";

export default function CourseOperations(props) {
  const [stateChanged, setStateChanged] = useState(false);
  const history = useHistory();
  const token = localStorage.getItem("Token");
  let memberType = localStorage.getItem("type");
  let MyId = localStorage.getItem("memberId");
  const [courseProfileState, setCourseProfileState] = useState("profile");
  const [courseId, setCourseId] = useState("");
  const [courseCoverage, setCourseCoverage] = useState(undefined);
  const [isCoordinator, setIsCoordinator] = useState(false);
  useEffect(() => {
    props.location && setCourseId(props.location.state.courseId);
  }, [props.location]);

  useEffect(() => {
    // console.log(courseId)
    if (courseId !== "") {
      axios({
        method: "POST",
        url: `${backendLink}/course/viewOneCourseCoverageHOD`,
        headers: {
          "auth-token": token,
        },
        data: {
          courseId,
        },
      })
        .then((response) => {
          // console.log('res :' + response.data)
          let coverage = Math.floor(response.data * 1000) / 1000;
          setCourseCoverage(coverage);
        })
        .catch((err) => {
          console.log(err.response);
        });
      if (localStorage.getItem("type") === "teaching assistant") {
        console.log("HERE");
        axios({
          method: "POST",
          url: `${backendLink}/course/viewMemberInCourseHOD`,
          headers: {
            "auth-token": token,
          },
          data: {
            courseId,
          },
        })
          .then((response) => {
            console.log(response.data);
            const assignments = response.data;
            for (let i = 0; i < assignments.length; i++)
              if (
                assignments[i].role === "coordinator" &&
                localStorage.getItem("memberId") === assignments[i].member._id
              )
                setIsCoordinator(true);
          })
          .catch((err) => {
            console.log(err.response);
          });
      }
    }
  }, [courseId]);

  return (
    <div className="main-page">
      <p className="request-heading">Course Profile</p>
      <div className="horizontalLine">
        <button
          className="borderTop-button"
          onClick={() => setCourseProfileState("profile")}
          autoFocus
        >
          Course Profile
        </button>

        <button
          className="borderTop-button"
          onClick={() => setCourseProfileState("schedule")}
        >
          Course Schedule
        </button>

        {(localStorage.getItem("type") === "instructor" ||
          localStorage.getItem("type") === "head of department") && (
          <button
            className="borderTop-button"
            onClick={() => setCourseProfileState("AcdemicMembers")}
          >
            Academic members
          </button>
        )}

        {memberType === "instructor" && (
          <button
            className="borderTop-button"
            onClick={() => setCourseProfileState("SlotAssignment")}
          >
            Slot Assignment
          </button>
        )}
        {isCoordinator && (
          <button
            className="borderTop-button"
            onClick={() => setCourseProfileState("addSLot")}
          >
            Add Slot To Course
          </button>
        )}
      </div>

      {courseProfileState === "profile" ? (
        <AddEditViewCourse
          courseCoverage={courseCoverage}
          memberType={memberType}
          type="view"
          courseId={courseId}
        />
      ) : courseProfileState === "schedule" ? (
        <CourseSchedule courseId={courseId} />
      ) : courseProfileState === "AcdemicMembers" ? (
        <AssignMember courseId={courseId} />
      ) : courseProfileState === "SlotAssignment" ? (
        <AssignMemberToSlot courseId={courseId} />
      ) : (
        <ManageCourseSlots courseId={courseId} />
      )}
    </div>
  );
}
