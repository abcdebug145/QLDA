import React, { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import { FaSearch, FaFilter, FaCalendarAlt, FaUser } from 'react-icons/fa';

const statusColor = {
  "Đã hoàn thành": { color: "#19d219", bg: "#eaffef" },
  "Đang duyệt": { color: "#ff9800", bg: "#fff7e6" },
  "Đã duyệt": { color: "#19d219", bg: "#eaffef" },
  "Hủy": { color: "#ff4444", bg: "#ffeaea" },
  "Chưa thanh toán": { color: "#ff9800", bg: "#fff7e6" },
  "Đã thanh toán": { color: "#19d219", bg: "#eaffef" },
  "Đang giao hàng": { color: "#1976d2", bg: "#eaf3ff" },
  "Đang chờ": { color: "#888", bg: "#eee" }
};

const formatTime = (time) => time.substring(0, 5);

const getStatusVN = (status) => {
  switch (status) {
    case "COMPLETED": return "Đã hoàn thành";
    case "PENDING": return "Đang duyệt";
    case "APPROVED": return "Đã duyệt";
    case "CANCELLED": return "Hủy";
    case "ONGOING": return "Đang giao hàng";
    case "WAITING": return "Đang chờ";
    case "PAID": return "Đã thanh toán";
    case "UNPAID": return "Chưa thanh toán";
    default: return status;
  }
};

const ApproveOrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:8080/api/users/oab");
        const response = await res.json();
        if (response.success && response.data) {
          setOrders(response.data.orders || []);
          setBookings(response.data.bookings || []);
        } else {
          setOrders([]);
          setBookings([]);
        }
      } catch {
        setOrders([]);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Gom booking cùng ngày, cùng sân
  const allRows = [];
  bookings.forEach(b => {
    allRows.push({
      id: b.id,
      type: "booking",
      date: b.date,
      courtName: b.courtName,
      timeSlot: `${formatTime(b.startTime)} - ${formatTime(b.endTime)}`,
      price: b.total,
      status: b.status
    });
  });
  orders.forEach(o => {
    const date = o.createdAt ? (new Date(o.createdAt).toISOString().split('T')[0]) : '';
    const productList = (o.products || []).map(p => `${p.name} x${p.quantity}`).join(', ');
    allRows.push({
      id: o.id,
      type: "order",
      date,
      name: productList,
      price: o.total,
      status: o.status
    });
  });
  allRows.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Lọc dữ liệu
  const filteredRows = allRows.filter(row => {
    const matchesStatus = statusFilter === 'all' || getStatusVN(row.status) === statusFilter;
    
    const matchesDate = (!dateRange.start || row.date >= dateRange.start) && 
                       (!dateRange.end || row.date <= dateRange.end);
    
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'booking' && row.type === 'booking') ||
      (activeTab === 'order' && row.type === 'order');

    return matchesStatus && matchesDate && matchesTab;
  });

  // Hàm cập nhật trạng thái
  const handleUpdateStatus = async (row, newStatus) => {
    let url = "";
    if (row.type === "booking") {
      url = `http://localhost:8080/api/bookings/${row.id}/status`;
    } else {
      url = `http://localhost:8080/api/orders/status/${row.id}?status=${newStatus}`;
    }
    await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" }
    });
    // Sau khi cập nhật, reload lại dữ liệu
    window.location.reload();
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f7f7f7" }}>
      <Navbar />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 16px" }}>
        <h1 style={{ fontWeight: 700, fontSize: 32, marginBottom: 24 }}>Duyệt đơn & Đặt sân</h1>
        
        {/* Bộ lọc */}
        <div style={{ 
          display: 'flex', 
          gap: 16, 
          marginBottom: 24,
          flexWrap: 'wrap'
        }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '12px',
              borderRadius: 8,
              border: '1px solid #ddd',
              fontSize: 16,
              minWidth: 200
            }}
          >
            <option value="all">Tất cả trạng thái</option>
            {Object.keys(statusColor).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              style={{
                padding: '12px',
                borderRadius: 8,
                border: '1px solid #ddd',
                fontSize: 16
              }}
            />
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              style={{
                padding: '12px',
                borderRadius: 8,
                border: '1px solid #ddd',
                fontSize: 16
              }}
            />
          </div>
        </div>

        {/* Tabs */}
        <div style={{ 
          display: 'flex', 
          gap: 16, 
          marginBottom: 24,
          borderBottom: '1px solid #ddd',
          paddingBottom: 8
        }}>
          <button
            onClick={() => setActiveTab('all')}
            style={{
              padding: '8px 16px',
              background: activeTab === 'all' ? '#1976d2' : 'transparent',
              color: activeTab === 'all' ? '#fff' : '#666',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            Tất cả
          </button>
          <button
            onClick={() => setActiveTab('booking')}
            style={{
              padding: '8px 16px',
              background: activeTab === 'booking' ? '#1976d2' : 'transparent',
              color: activeTab === 'booking' ? '#fff' : '#666',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            Đặt sân
          </button>
          <button
            onClick={() => setActiveTab('order')}
            style={{
              padding: '8px 16px',
              background: activeTab === 'order' ? '#1976d2' : 'transparent',
              color: activeTab === 'order' ? '#fff' : '#666',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            Đơn hàng
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', color: '#888', fontSize: 18 }}>Đang tải...</div>
        ) : (
          <div style={{ 
            background: "#fff", 
            borderRadius: 16, 
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            overflow: "hidden"
          }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f0f0f0", color: "#888", fontWeight: 600 }}>
                  <th style={{ padding: 16, textAlign: "left" }}>Ngày</th>
                  <th style={{ padding: 16, textAlign: "left" }}>Chi tiết</th>
                  <th style={{ padding: 16, textAlign: "right" }}>Tổng tiền</th>
                  <th style={{ padding: 16, textAlign: "center" }}>Trạng thái</th>
                  <th style={{ padding: 16, textAlign: "center" }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row, idx) => (
                  <tr key={idx} style={{ 
                    borderBottom: "1px solid #eee",
                    transition: 'background-color 0.2s',
                    ':hover': { background: '#f9f9f9' }
                  }}>
                    <td style={{ padding: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <FaCalendarAlt style={{ color: '#888' }} />
                        {row.date}
                      </div>
                    </td>
                    <td style={{ padding: 16 }}>
                      {row.type === 'booking' ? (
                        <div>
                          <div style={{ color: "#1976d2", fontWeight: 600, marginBottom: 4 }}>
                            Đặt sân: {row.courtName}
                          </div>
                          <div style={{ color: "#4CAF50" }}>
                            {row.timeSlot}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div style={{ color: "#c77dff", fontWeight: 600, marginBottom: 4 }}>
                            Phụ kiện
                          </div>
                          <div>{row.name}</div>
                        </div>
                      )}
                    </td>
                    <td style={{ padding: 16, textAlign: "right", fontWeight: 600 }}>
                      {row.price.toLocaleString()}đ
                    </td>
                    <td style={{ padding: 16, textAlign: "center" }}>
                      {(() => {
                        const statusVN = getStatusVN(row.status);
                        return (
                          <span style={{
                            background: statusColor[statusVN]?.bg || '#eee',
                            color: statusColor[statusVN]?.color || '#888',
                            borderRadius: 8,
                            padding: "6px 16px",
                            fontWeight: 600,
                            fontSize: 14,
                            display: 'inline-block'
                          }}>{statusVN}</span>
                        );
                      })()}
                    </td>
                    <td style={{ padding: 16, textAlign: "center" }}>
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                        {row.type === "order" && row.status !== "COMPLETED" && (
                          <>
                            {row.status !== "ONGOING" && (
                              <>
                                <button 
                                  onClick={() => {
                                    if (window.confirm('Bạn có chắc muốn duyệt đơn này?')) {
                                      handleUpdateStatus(row, "ONGOING");
                                    }
                                  }}
                                  style={{ 
                                    background: "#1976d2", 
                                    color: "#fff", 
                                    border: "none", 
                                    borderRadius: 6, 
                                    padding: "8px 16px", 
                                    cursor: "pointer",
                                    transition: 'opacity 0.2s',
                                    ':hover': { opacity: 0.9 }
                                  }}
                                >
                                  Duyệt
                                </button>
                                <button 
                                  onClick={() => {
                                    if (window.confirm('Bạn có chắc muốn hủy đơn này?')) {
                                      handleUpdateStatus(row, "CANCELLED");
                                    }
                                  }}
                                  style={{ 
                                    background: "#ff4444", 
                                    color: "#fff", 
                                    border: "none", 
                                    borderRadius: 6, 
                                    padding: "8px 16px", 
                                    cursor: "pointer",
                                    transition: 'opacity 0.2s',
                                    ':hover': { opacity: 0.9 }
                                  }}
                                >
                                  Hủy
                                </button>
                              </>
                            )}
                            {row.status === "ONGOING" && (
                              <button 
                                onClick={() => {
                                  if (window.confirm('Bạn có chắc muốn hoàn thành đơn này?')) {
                                    handleUpdateStatus(row, "COMPLETED");
                                  }
                                }}
                                style={{ 
                                  background: "#19d219", 
                                  color: "#fff", 
                                  border: "none", 
                                  borderRadius: 6, 
                                  padding: "8px 16px", 
                                  cursor: "pointer",
                                  transition: 'opacity 0.2s',
                                  ':hover': { opacity: 0.9 }
                                }}
                              >
                                Hoàn thành
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApproveOrderPage;