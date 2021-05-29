import AddEditViewMember from "./Components/AddEditViewMember";
import AddEditViewFaculty from "./Components/AddEditViewFaculty";
import AddEditViewDepartment from "./Components/AddEditViewDepartment";
import AddEditViewCourse from "./Components/AddEditViewCourse";
import AddEditViewRoom from "./Components/AddEditViewRoom";
import CreateSickRequest from "./Components/Requests/CreateSickRequest";
import CreateMaternityRequest from "./Components/Requests/CreateMaternityRequest";
import CreateChangeDayoffRequest from "./Components/Requests/CreateChangeDayoffRequest";
import CreateAccidentalRequest from "./Components/Requests/CreateAccidentalRequest";
import CreateCompensationRequest from "./Components/Requests/CreateCopmensationRequest";
import MembersListView from "./Pages/MembersListView";
import SideBar from "./Components/Layout/sideBar";
import Login from "./Components/login";
import ActivateAccount from "./Components/activateAccount";
import DepartmentsListView from "./Components/ListViews/DepartmentsListView";
import FacultiesListView from "./Components/ListViews/FacultiesListView";
import SickLeaveRequests from "./Components/ListViews/SickLeaveRequests";
import CourseListView from "./Components/ListViews/CourseListView";
import CourseOperations from "./Components/CourseOperations";
import MaternityLeaveRequests from "./Components/ListViews/MaternityLeaveRequests";
import CompensationRequests from "./Components/ListViews/CompensationRequest";
import ViewMySchedule from "./Components/Schedule/ViewMySchedule";
import ReplacementReqSchedule from "./Components/Schedule/ReplacementReqSchedule";
import ViewCourseSchedule from "./Components/Schedule/ViewCourseSchedule";
import SlotLinkingReq from "./Components/Schedule/SlotLinkingReq";
import MemberProfileView from "./Pages/MemberProfileView";
import DepartmentProfileView from "./Pages/DepartmentProfileView";
import FacultyProfileView from "./Pages/FacultyProfileView";
import RoomsListView from "./Components/ListViews/RoomsListView";
import RoomProfileView from "./Pages/RoomProfileView";
import ChangeDayoffRequest from "./Components/ListViews/ChangeDayoffRequests";
import AccidentalRequests from "./Components/ListViews/AccidentalRequests";
import AssignMemberToSlot from "./Components/Schedule/AssignMemberToSlot";
import SlotLinkingRequests from "./Components/ListViews/SlotLinkingRequests";
import ReplacementRequests from "./Components/ListViews/ReplacementRequests";
import AnnualRequests from "./Components/ListViews/AnnualRequests";
import Header from "./Components/Layout/Header";
import tokenCheck from "../src/Components/CheckToken";
import ManageCourseSlots from "./Components/Schedule/ManageCourseSlots";

import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
  useHistory,
} from "react-router-dom";

import "./App.css";

function App() {
  const token = tokenCheck();
  console.log(token);
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/activateAccount" component={ActivateAccount} />
        <Route exact path="/course/schedule" component={ViewCourseSchedule} />
        {/* <Route
          exact
          path='/Request/sendReplacementRequest'
          component={ReplacementReqSchedule}
        />
        <Route
          exact
          path='/Request/sendSlotLinkingRequest'
          component={SlotLinkingReq}
        /> */}
        <div className="App">
          <table>
            <tbody>
              <tr>
                <td className="sideBarTable">
                  <SideBar />
                </td>
                <td>
                  <Header />
                  <Route
                    exact
                    path="/Course/AssignToSlot"
                    component={AssignMemberToSlot}
                  />
                  <Route
                    exact
                    path="/Member"
                    render={() =>
                      token ? <MembersListView /> : <Redirect to="/login" />
                    }
                  />
                  <Route
                    exact
                    path="/MyProfile"
                    render={(routeProps) =>
                      token ? (
                        <MemberProfileView {...routeProps} />
                      ) : (
                        <Redirect to="/login" />
                      )
                    }
                  />
                  <Route
                    exact
                    path="/MySchedule"
                    render={() =>
                      token ? <ViewMySchedule /> : <Redirect to="/login" />
                    }
                  />
                  <Route
                    exact
                    path="/MemberProfile"
                    render={() =>
                      token ? <MemberProfileView /> : <Redirect to="/login" />
                    }
                  />
                  <Route
                    exact
                    path="/Department"
                    render={() =>
                      token ? <DepartmentsListView /> : <Redirect to="/login" />
                    }
                  />
                  <Route
                    exact
                    path="/DepartmentProfile"
                    render={() =>
                      token ? (
                        <DepartmentProfileView />
                      ) : (
                        <Redirect to="/login" />
                      )
                    }
                  />
                  <Route
                    exact
                    path="/Faculty"
                    render={() =>
                      token ? <FacultiesListView /> : <Redirect to="/login" />
                    }
                  />
                  <Route
                    exact
                    path="/FacultyProfile"
                    render={() =>
                      token ? <FacultyProfileView /> : <Redirect to="/login" />
                    }
                  />
                  <Route
                    exact
                    path="/Room"
                    render={() =>
                      token ? <RoomsListView /> : <Redirect to="/login" />
                    }
                  />
                  <Route
                    exact
                    path="/RoomProfile"
                    render={() =>
                      token ? <RoomProfileView /> : <Redirect to="/login" />
                    }
                  />
                  <Route
                    exact
                    path="/MaternityLeaveRequest"
                    render={() =>
                      token ? (
                        <MaternityLeaveRequests />
                      ) : (
                        <Redirect to="/login" />
                      )
                    }
                  />
                  <Route
                    exact
                    path="/SickLeaveRequest"
                    render={() =>
                      token ? <SickLeaveRequests /> : <Redirect to="/login" />
                    }
                  />
                  <Route
                    exact
                    path="/CompensationRequest"
                    render={() =>
                      token ? (
                        <CompensationRequests />
                      ) : (
                        <Redirect to="/login" />
                      )
                    }
                  />
                  <Route
                    exact
                    path="/ChangeDayoffRequest"
                    render={() =>
                      token ? <ChangeDayoffRequest /> : <Redirect to="/login" />
                    }
                  />
                  <Route
                    exact
                    path="/AccidentalLeaveRequest"
                    render={() =>
                      token ? <AccidentalRequests /> : <Redirect to="/login" />
                    }
                  />
                  <Route
                    exact
                    path="/SlotLinkingRequest"
                    render={() =>
                      token ? <SlotLinkingRequests /> : <Redirect to="/login" />
                    }
                  />
                  <Route
                    exact
                    path="/ReplacementRequest"
                    render={() =>
                      token ? <ReplacementRequests /> : <Redirect to="/login" />
                    }
                  />
                  <Route
                    exact
                    path="/AnnualLeaveRequest"
                    render={() =>
                      token ? <AnnualRequests /> : <Redirect to="/login" />
                    }
                  />
                  <Route
                    exact
                    path="/Course"
                    render={(routeProps) =>
                      token ? (
                        <CourseListView {...routeProps} />
                      ) : (
                        <Redirect to="/login" />
                      )
                    }
                  />
                  <Route
                    exact
                    path="/CourseOperations"
                    render={(routeProps) =>
                      token ? (
                        <CourseOperations {...routeProps} />
                      ) : (
                        <Redirect to="/login" />
                      )
                    }
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Switch>
    </Router>
  );
}

export default App;
