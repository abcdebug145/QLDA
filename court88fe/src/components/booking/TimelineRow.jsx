import React from "react";
import TimelineCell from "./TimelineCell";

const TimelineRow = ({ courtName, slots, onCellClick }) => {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div style={{
        width: 80,
        minWidth: 80,
        height: 48,
        background: ["SÂN 2", "SÂN 4", "SÂN 6"].includes(courtName) ? "#4e6cf4" : "#6ee7b7",
        color: "#222",
        fontWeight: 600,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 6,
        marginRight: 4,
        fontSize: 20,
        fontFamily: "inherit"
      }}>{courtName}</div>
      {slots.map((variant, idx) => (
        <TimelineCell
          key={idx}
          variant={variant}
          onClick={() => onCellClick(idx)}
          isLastCol={idx === slots.length - 1}
          isLastRow={false}
        />
      ))}
    </div>
  );
};

export default TimelineRow; 