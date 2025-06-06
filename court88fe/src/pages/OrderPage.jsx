import React, { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";

const statusColor = {
  "Đã hoàn thành": { color: "#19d219", bg: "#eaffef" },
  "Đang duyệt": { color: "#1976d2", bg: "#eaf3ff" },
  "Hủy": { color: "#ff4444", bg: "#ffeaea" },
  "Chưa thanh toán": { color: "#ff9800", bg: "#fff7e6" },
};

// Format time from HH:mm:ss to HH:mm
const formatTime = (time) => {
  return time.substring(0, 5);
};

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Lấy số điện thoại từ localStorage
        let phone = '';
        const userStr = localStorage.getItem('user');
        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            const userData = user.data || user;
            phone = userData.phone || '';
          } catch { /* ignore parse error */ }
        }
        const res = await fetch(`http://localhost:8080/api/users/oab?phone=${encodeURIComponent(phone)}`);
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
    fetchOrders();
  }, []);

  // Tạo mảng tất cả các mục (sân và sản phẩm), mỗi mục 1 hàng
  const allRows = [];

  // Gộp bookings cùng ngày, cùng sân
  const bookingMap = {};
  bookings.forEach(b => {
    const key = `${b.date}_${b.courtName}`;
    if (!bookingMap[key]) {
      bookingMap[key] = {
        type: 'booking',
        date: b.date,
        courtName: b.courtName,
        slots: [],
        price: 0,
        paid: 0,
        status: b.status === 'APPROVED' ? 'Đã duyệt' : 'Chưa duyệt'
      };
    }
    bookingMap[key].slots.push(`${formatTime(b.startTime)} - ${formatTime(b.endTime)}`);
    bookingMap[key].price += b.total;
    if (b.status === 'APPROVED') bookingMap[key].paid += b.total;
  });

  // Hàm gộp các slot liên tục
  function mergeSlots(slots) {
    // slots: ["14:30 - 15:00", "15:00 - 15:30", ...]
    // Chuyển về [{start, end}]
    const slotObjs = slots.map(s => {
      const [start, end] = s.split(' - ');
      return { start, end };
    }).sort((a, b) => a.start.localeCompare(b.start));

    const merged = [];
    for (let i = 0; i < slotObjs.length; i++) {
      const cur = slotObjs[i];
      if (!merged.length) {
        merged.push({ ...cur });
      } else {
        const last = merged[merged.length - 1];
        if (last.end === cur.start) {
          last.end = cur.end;
        } else {
          merged.push({ ...cur });
        }
      }
    }
    // Trả về lại dạng chuỗi
    return merged.map(s => `${s.start} - ${s.end}`);
  }

  Object.values(bookingMap).forEach(row => {
    row.slots = mergeSlots(row.slots);
    allRows.push(row);
  });

  // Gộp các sản phẩm cùng đơn hàng vào 1 dòng
  orders.forEach(o => {
    const date = o.createdAt ? (new Date(o.createdAt).toISOString().split('T')[0]) : '';
    const status = o.status === 'APPROVED' ? 'Đã duyệt' : (o.status === 'PENDING' ? 'Đang duyệt' : (o.status === 'ONGOING' ? 'Đang giao hàng' : 'Đang chờ'));
    const paid = o.status === 'APPROVED' ? o.total : 0;
    const productList = (o.products || []).map(p => `${p.name} x${p.quantity}`).join(', ');
    allRows.push({
      type: 'product',
      date,
      name: productList,
      price: o.total,
      paid,
      status
    });
  });
  // Sắp xếp theo ngày giảm dần
  allRows.sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div style={{ minHeight: "100vh", background: "#f7f7f7" }}>
      <Navbar />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 0" }}>
        <h1 style={{ fontWeight: 700, fontSize: 32, marginBottom: 24 }}>Lịch sử giao dịch</h1>
        {loading ? (
          <div style={{ textAlign: 'center', color: '#888', fontSize: 18 }}>Đang tải...</div>
        ) : (
        <table style={{ width: "100%", background: "#fff", borderRadius: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", overflow: "hidden", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f0f0f0", color: "#888", fontWeight: 600 }}>
              <th style={{ padding: 12, textAlign: "left" }}>Ngày</th>
              <th style={{ padding: 12, textAlign: "left" }}>Chi tiết</th>
              <th style={{ padding: 12, textAlign: "right" }}>Tổng tiền</th>
              <th style={{ padding: 12, textAlign: "center" }}>Trạng thái</th>
              <th style={{ padding: 12, textAlign: "center" }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {allRows.map((row, idx) => (
              <tr key={idx} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: 12 }}>{row.date}</td>
                <td style={{ padding: 12 }}>
                  {row.type === 'booking' ? (
                    <>
                      <span style={{ color: "#1976d2", fontWeight: 600 }}>Sân:</span> {row.courtName} <span style={{ color: "#888" }}>|</span> <span style={{ color: "#4CAF50" }}>{row.slots.join(', ')}</span>
                    </>
                  ) : (
                    <>
                      <span style={{ color: "#c77dff", fontWeight: 600 }}>Phụ kiện:</span> {row.name}
                    </>
                  )}
                </td>
                <td style={{ padding: 12, textAlign: "right", fontWeight: 600 }}>{row.price.toLocaleString()}đ</td>
                <td style={{ padding: 12, textAlign: "center" }}>
                  <span style={{
                    background: statusColor[row.status]?.bg || '#eee',
                    color: statusColor[row.status]?.color || '#888',
                    borderRadius: 8,
                    padding: "4px 16px",
                    fontWeight: 600,
                    fontSize: 15
                  }}>{row.status}</span>
                </td>
                <td style={{ padding: 12, textAlign: "center" }}>
                  {row.type === 'product' && (
                    <button
                      style={{
                        background: "#1976d2",
                        color: "white",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: 8,
                        cursor: "pointer",
                        fontWeight: 600
                      }}
                      onClick={() => {
                        // Xử lý khi click vào nút xem chi tiết
                        console.log("Xem chi tiết đơn hàng:", row);
                      }}
                    >
                      Xem chi tiết
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>
    </div>
  );
};

export default OrderPage; 