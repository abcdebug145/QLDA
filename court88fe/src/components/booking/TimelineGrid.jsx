import React from "react";
import TimelineHeader from "./TimelineHeader";
import TimelineRow from "./TimelineRow";
import TimelineLegend from "./TimelineLegend";

const TimelineGrid = ({ times, courts, onCellClick }) => {
  return (
    <div style={{ margin: 24 }}>
      <TimelineHeader times={times} />
      <div style={{ height: 8 }} />
      {courts.map((court, idx) => (
        <TimelineRow
          key={court.name}
          courtName={court.name}
          slots={court.slots}
          onCellClick={slotIdx => onCellClick(idx, slotIdx)}
        />
      ))}
      <TimelineLegend />
    </div>
  );
};

export default TimelineGrid; 