import React, { useMemo, useState, useEffect } from "react";
import { useTable } from "react-table";
import { COLUMNS } from "./SlotLinkingColumns";
import "../../Styles/table.css";
import axios from "axios";
import backendLink from "../../keys_dev";
import Filters from "../Filters";
import Header from "../Layout/Header";

import SideBar from "../Layout/sideBar";

function SlotLinkingReq() {
  const token = localStorage.getItem("Token");
  const [error, setError] = useState("");
  const [scheduleData, setscheduleData] = useState([]);
  const [slotID, setslotID] = useState("");

  useEffect(() => {
    axios({
      method: "GET",
      url: `${backendLink}/course/viewMyCourses`,
      headers: {
        "auth-token": token,
      },
    })
      .then((response) => {
        console.log(response);
        const data = response.data;
        const options = [];
        data.forEach((element) => {
          options.push({
            value: element._id,
            text: element.name,
          });
        });
        setFilters((prevState) => {
          return [
            ...prevState,
            {
              type: "dropdown",
              label: "Course",
              name: "course",
              options: options,
            },
          ];
        });
      })
      .catch((err) => {
        console.log(err.response);
      });
  }, []);

  const [filters, setFilters] = useState([]);

  const [filterObject, setFilterObject] = useState({
    course: "",
  });

  useEffect(() => {
    if (filterObject.course !== "") {
      axios
        .post(
          `${backendLink}/course/viewMemberSlotsInCourse`,
          { courseId: filterObject.course },
          {
            headers: {
              "auth-token": token,
            },
          }
        )
        .then((response) => {
          setscheduleData(response.data);
          setError("");
        })
        .catch((err) => {
          console.log(err.response);
          const message = err.response.data.message;
          setError(message);
        });
    }
  }, [filterObject]);

  const weekdays = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "saturday",
  ];

  const groupedData = scheduleData.reduce(
    (agg, cur) => {
      const target = agg[cur.day];

      let arr = [];
      let slotString;
      if (cur.member == null) {
        slotString = {
          key: cur._id,
          value:
            cur.course.name + " \n " + cur.room.type + "  \n " + cur.room.name,
          memberName: null,
        };
      } else {
        slotString = {
          key: cur._id,
          value:
            cur.course.name +
            " \n " +
            cur.room.type +
            "  \n " +
            cur.room.name +
            "  \n " +
            cur.member.name,
          memberName: cur.member.name,
        };
      }

      arr.push(slotString);

      if (target[cur.slot]) {
        target[cur.slot].push(arr);
      } else {
        target[cur.slot] = [arr];
      }
      return agg;
    },
    Object.assign(
      {},
      ...weekdays.map((day) => ({
        [day]: {},
      }))
    )
  );
  //console.log("groupedData");
  // console.log(groupedData);
  const tableData = Object.keys(groupedData).map((day) => ({
    day,
    ...groupedData[day],
  }));
  // console.log("tableData");
  // console.log(tableData);

  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => tableData, [tableData]);
  const tableInstance = useTable({
    columns,
    data,
  });
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance;

  return (
    <div
    // style={{
    //   display: 'flex',
    //   flexWrap: 'wrap',
    //   position: 'relative',
    //   overflow: 'scroll',
    //   width: '100vw',
    //   height: '100vh',
    // }}
    >
      {/* <SideBar />
      <Header /> */}
      <h6>Please Select A Course</h6>
      <Filters
        filters={filters}
        setFilters={setFilters}
        filterObject={filterObject}
        setFilterObject={setFilterObject}
      />
      <table {...getTableProps()} className="schedule">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} className="tableRow">
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()} className="tableHeader">
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} className="tableRow">
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()} className="slot">
                      {(() => {
                        let day = weekdays.includes(cell.value);

                        if (cell.value != undefined && !day) {
                          return <div>{cell.render("Cell")}</div>;
                        } else if (day) {
                          {
                            switch (cell.value) {
                              case "sunday":
                                return <b>Sunday</b>;
                              case "monday":
                                return <b>Monday</b>;
                              case "tuesday":
                                return <b>Tuesday</b>;
                              case "wednesday":
                                return <b>Wednesday</b>;
                              case "thursday":
                                return <b>Thursday</b>;
                              case "saturday":
                                return <b>Saturday</b>;
                              default:
                                return "";
                            }
                          }
                        } else {
                          return "";
                        }
                      })()}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default SlotLinkingReq;
