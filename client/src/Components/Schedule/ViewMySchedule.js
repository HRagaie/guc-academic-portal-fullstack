import React, { useMemo, useState, useEffect } from "react";
import { useTable } from "react-table";
import { COLUMNS } from "./ColumnWithNoButton";
import "../../Styles/table.css";
import SideBar from "../Layout/sideBar";
import axios from "axios";
import Header from "../Layout/Header";

function ViewMySchedule() {
  const token = localStorage.getItem("Token");
  const [error, setError] = useState("");
  const [scheduleData, setscheduleData] = useState([]);
  useEffect(() => {
    axios
      .get("/member/ViewScadule", {
        headers: {
          "auth-token": token,
        },
      })
      .then((response) => {
        let schedTemp = response.data.Member.schedule;
        let replacementSlot = response.data.ScaduleReplacment;
        replacementSlot.forEach((element) => {
          schedTemp.push(element.slot);
        });

        setscheduleData(schedTemp);
        setError("");
      })
      .catch((err) => {
        const message = err.response.data.message;
        setError(message);
      });
  }, []);

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
      let slotString =
        cur.course.name + " " + cur.room.type + " " + cur.room.name;
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

  const tableData = Object.keys(groupedData).map((day) => ({
    day,
    ...groupedData[day],
  }));

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
    <div className="main-page">
      {/* <SideBar />
      <Header /> */}
      <p className="request-heading">Member Profile</p>
      <div className="horizontalLine">
        <button
          className="borderTop-button"
          // onClick={() => setMemberProfileState('profile')}
          autoFocus
        >
          My Schedule
        </button>
      </div>
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
                          return (
                            <div className="tableCell">
                              {cell.render("Cell")}
                            </div>
                          );
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

export default ViewMySchedule;
