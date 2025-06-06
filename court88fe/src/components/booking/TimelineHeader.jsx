import React from "react";

const TimelineHeader = ({ times }) => {
  return (
    <div style={{ display: "flex", alignItems: "center", marginLeft: 84 }}>
      {times.map((time, idx) => (
        <div
          key={idx}
          style={{
            width: 48,
            textAlign: "center",
            fontSize: 13,
            color: "#444",
            marginRight: 2
          }}
        >
          {time}
        </div>
      ))}
    </div>
  );
};

export default TimelineHeader; 