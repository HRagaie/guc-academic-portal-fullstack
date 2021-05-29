import React, { useMemo, useState, useEffect } from "react";

const CellRenderer = ({ value }) => {
  if (!value || !Array.isArray(value)) {
    return null;
  }
  return (
    <React.Fragment>
      {value.map((v) => (
        <div>
          <div
            style={{
              backgroundColor: "#b6c1ff",
              borderRadius: "25px",
              textAlign: "center",
              padding: "10px 10px 15px 15px",
            }}
          >
            {v}
          </div>
          <br></br>
        </div>
      ))}
    </React.Fragment>
  );
};

export const COLUMNS = [
  {
    Header: "",
    accessor: "day",
    Cell: CellRenderer,
  },
  {
    Header: "First Period",
    accessor: "1",
    Cell: CellRenderer,
  },
  {
    Header: "Second Period",
    accessor: "2",
    Cell: CellRenderer,
  },
  {
    Header: "Third Period",
    accessor: "3",
    Cell: CellRenderer,
  },
  {
    Header: "Fourth Period",
    accessor: "4",
    Cell: CellRenderer,
  },
  {
    Header: "Fifth Period",
    accessor: "5",
    Cell: CellRenderer,
  },
];
