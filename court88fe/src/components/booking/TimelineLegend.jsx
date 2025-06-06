import React from "react";

const items = [
  { color: "#fff", border: "1px solid #eee", label: "Sân trống" },
  { color: "#1abc60", border: "1px solid #1abc60", label: "Đang chọn" },
  { color: "#bdbdbd", border: "1px solid #bdbdbd", label: "Đã được đặt" }
];

const TimelineLegend = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 8 }}>
    {items.map((item, idx) => (
      <div key={idx} style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <div style={{ width: 18, height: 18, background: item.color, border: item.border, borderRadius: 4 }} />
        <span style={{ fontSize: 13 }}>{item.label}</span>
      </div>
    ))}
  </div>
);

export default TimelineLegend; 