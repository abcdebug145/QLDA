import React from "react";

const items = [
  { key: "home", label: "Trang chủ", icon: "🏠" },
  { key: "staff", label: "Nhân viên", icon: "🧑‍💼" },
  { key: "warehouse", label: "Kho hàng", icon: "🏚️" },
  { key: "revenue", label: "Doanh thu", icon: "📈" },
];

const Sidebar = ({ selected, onSelect }) => (
  <div
    style={{
      width: 180,
      background: "#eaeaea",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "32px 0",
      gap: 32,
    }}
  >
    {items.map((item) => (
      <div
        key={item.key}
        onClick={() => onSelect && onSelect(item.key)}
        style={{
          width: 120,
          borderRadius: 16,
          background: selected === item.key ? "#eaffd0" : "transparent",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "18px 0 10px 0",
          cursor: "pointer",
          transition: "background 0.2s",
          fontWeight: selected === item.key ? 700 : 500,
        }}
      >
        <span style={{ fontSize: 38, marginBottom: 6 }}>{item.icon}</span>
        <span style={{ fontSize: 18 }}>{item.label}</span>
      </div>
    ))}
  </div>
);

export default Sidebar;
