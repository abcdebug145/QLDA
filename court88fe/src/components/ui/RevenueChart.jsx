import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

const data = [
  { name: "Mon", court: 1000000, accessory: 200000 },
  { name: "Tue", court: 1100000, accessory: 250000 },
  { name: "Wed", court: 1000000, accessory: 220000 },
  { name: "Thu", court: 1000000, accessory: 210000 },
  { name: "Fri", court: 900000, accessory: 200000 },
  { name: "Sat", court: 1700000, accessory: 900000 },
  { name: "Sun", court: 1800000, accessory: 900000 },
];

const total = data.reduce((sum, d) => sum + d.court + d.accessory, 0);

const RevenueChart = () => (
  <div style={{ background: "#fff", padding: 32, borderRadius: 16, minHeight: 400 }}>
    <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Doanh thu</div>
    <div style={{ fontSize: 32, color: "#1976d2", fontWeight: 700, marginBottom: 16 }}>
      {total.toLocaleString()} 
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 8 }}>
      <span style={{ color: "#4e6cf4", fontWeight: 600 }}>■ Sân cầu</span>
      <span style={{ color: "#c77dff", fontWeight: 600 }}>■ Phụ kiện</span>
    </div>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 16, right: 24, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis tickFormatter={v => v.toLocaleString()} />
        <Tooltip formatter={v => v.toLocaleString()} />
        <Legend />
        <Bar dataKey="court" fill="#4e6cf4" name="Sân cầu" />
        <Bar dataKey="accessory" fill="#c77dff" name="Phụ kiện" />
      </BarChart>
    </ResponsiveContainer>
    <div style={{ textAlign: "right", marginTop: 8, color: "#444" }}>
      Tuần này <span style={{ fontSize: 18, marginLeft: 4 }}>▼</span>
    </div>
  </div>
);

export default RevenueChart;
