import React, { useState, useEffect } from "react";
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';
import Navbar from "../components/layout/Navbar";
import axios from "axios";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

// const shifts = [
//   { id: "morning", label: "Sáng", color: "#e0f2fe" },
//   { id: "afternoon", label: "Chiều", color: "#fef9c3" },
//   { id: "evening", label: "Tối", color: "#ede9fe" }
// ];

const shifts = [
    { id: 'morning', label: 'Sáng', time: '6:00-14:00', color: '#87CEEB' },
    { id: 'afternoon', label: 'Chiều', time: '14:00-22:00', color: '#98D8E8' },
    { id: 'evening', label: 'Tối', time: '22:00-6:00', color: '#A8E6CF' }
  ];

const getDaysInMonth = (year, month) => {
  const days = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDay = firstDay.getDay() === 0 ? 7 : firstDay.getDay();
  // Thêm ngày trống đầu tháng
  for (let i = 1; i < startDay; i++) days.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d));
  }
  // Thêm ngày trống cuối tháng
  while (days.length % 7 !== 0) days.push(null);
  return days;
};

const TimekeepingPage = () => {
  const [currentMonth] = useState(new Date());
  const days = getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth());
  // Lấy ngày hiện tại giống trang ShiftRegPage
  const today = new Date().toISOString().split('T')[0];
  const [popup, setPopup] = useState({ show: false, date: '', shiftId: '', shiftLabel: '', isStart: true });
  const [registeredShifts, setRegisteredShifts] = useState({});
  const [timekeepingData, setTimekeepingData] = useState({});

  // Hàm kiểm tra ca vắng
  function isAbsent(shift, now) {
    const shiftDate = shift.date;
    // const shiftType = shift.type.toLowerCase();
    const [startHour, startMinute] = shift.timeRange.split('-')[0].split(':').map(Number);
    // const shiftStart = new Date(shiftDate + 'T' + shift.timeRange.split('-')[0] + ':00');
    // Nếu ngày ca < hôm nay => vắng
    if (shiftDate < now.toISOString().split('T')[0]) return true;
    // Nếu ngày ca = hôm nay và giờ bắt đầu ca < giờ hiện tại - 30p => vắng
    if (shiftDate === now.toISOString().split('T')[0]) {
      const nowTime = now.getHours() * 60 + now.getMinutes();
      const shiftTime = startHour * 60 + startMinute;
      if (shiftTime < nowTime - 30) return true;
    }
    return false;
  }

  // Đưa fetchRegisteredShifts ra ngoài useEffect để có thể gọi lại sau khi chấm công
  const fetchRegisteredShifts = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData?.success || !userData?.data?.phone) return;
      const res = await axios.get(`/api/shifts/user/${userData.data.phone}`);
      if (res.data.success) {
        const reg = {};
        const tkData = {};
        const now = new Date();
        res.data.data.forEach(shift => {
          const date = shift.date;
          const type = shift.type.toLowerCase();
          if (!reg[date]) reg[date] = {};
          reg[date][type] = shift;
          if (!tkData[date]) tkData[date] = {};
          // Xác định vắng
          if (isAbsent(shift, now)) {
            tkData[date][type] = { absent: true };
          } else {
            tkData[date][type] = {
              startAt: shift.startAt,
              endAt: shift.endAt
            };
          }
        });
        setRegisteredShifts(reg);
        setTimekeepingData(tkData);
      }
    } catch {
      console.log("Error fetching registered shifts");
    }
  };

  useEffect(() => {
    fetchRegisteredShifts();
  }, []);

  // Hàm gọi API chấm công
  const handleCheckin = async (shiftId, isStart) => {
    try {
      const status = isStart ? "STARTED" : "ENDED";
      await axios.put(`/api/shifts/status/${shiftId}?status=${status}`);
      alert(isStart ? 'Bắt đầu ca thành công!' : 'Kết thúc ca thành công!');
      setPopup({ show: false, date: '', shiftId: '', shiftLabel: '', isStart: true });
      // Load lại dữ liệu sau khi chấm công
      fetchRegisteredShifts();
    } catch {
      alert('Chấm công thất bại!');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Navbar />
      <div style={{ padding: 24, maxWidth: 1350, margin: "0 auto" }}>
        <div style={{
          background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 2px 10px rgba(0,0,0,0.07)"
        }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ margin: 0, fontWeight: 600 }}>Tháng 6 2025</h2>
          </div>
          {/* Days of week */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: 8, color: "#64748b", fontWeight: 600
          }}>
            {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map(d => (
              <div key={d} style={{ textAlign: "center", padding: 8 }}>{d}</div>
            ))}
          </div>
          {/* Calendar grid */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8
          }}>
            {days.map((date, idx) => {
              let border = "1px solid #e5e7eb";
              if (date && date.toISOString().split('T')[0] === today) border = "2px solid #2563eb";
              const dateStr = date ? date.toISOString().split('T')[0] : "";
              // Nền cho ngày đã qua
              let bg = "#fff";
              if (date && dateStr < today) bg = "#f1f5f9";
              if (date && dateStr === today) bg = "#fffbe6";
              return (
                <div key={idx} style={{
                  minHeight: 100, background: bg, border, borderRadius: 8, padding: 6, position: "relative"
                }}>
                  <div style={{
                    position: "absolute", top: 6, right: 8, color: "#64748b", fontWeight: 600, fontSize: 13
                  }}>
                    {date ? date.getDate() : ""}
                  </div>
                  <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 4 }}>
                    {shifts.map(shift => {
                      const ca = timekeepingData[dateStr]?.[shift.id] || {};
                      const isRegistered = !!registeredShifts[dateStr]?.[shift.id];
                      const shiftObj = registeredShifts[dateStr]?.[shift.id];
                      const shiftId = shiftObj?.id || "";
                      const tooltip = isRegistered ? '' : 'Bạn ko đăng ký ca làm này';
                      // Nếu đã có endAt thì không cho click nữa
                      const isEnded = !!ca.endAt;
                      let style = {
                        background: isRegistered ? (ca.absent ? "#fee2e2" : shift.color) : "#f3f4f6",
                        color: isRegistered ? (ca.absent ? "#dc2626" : "#222") : "#888",
                        borderRadius: 4, padding: "2px 4px", fontSize: 13,
                        display: "flex", alignItems: "center", gap: 6, minHeight: 28, height: 28, width: '100%', boxSizing: "border-box",
                        cursor: (!isRegistered || ca.absent || isEnded) ? 'not-allowed' : 'pointer',
                        fontWeight: isRegistered ? 500 : 400,
                        position: 'relative'
                      };
                      return (
                        <div
                          key={shift.id}
                          style={style}
                          title={tooltip}
                          onClick={() => {
                            if (!isRegistered || ca.absent || isEnded) return;
                            setPopup({ show: true, date: dateStr, shiftId, shiftLabel: shift.label, isStart: !ca.startAt });
                          }}
                        >
                          {isRegistered ? (
                            ca.absent ? (
                              <><AlertCircle size={14} /> {shift.label}: Vắng</>
                            ) : (
                              <>
                                {shift.label}
                                {ca.startAt && (
                                  <span style={{ color: "#22c55e", marginLeft: 6, fontSize: 12, display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <CheckCircle size={13} /> {new Date(ca.startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                                  </span>
                                )}
                                {ca.endAt && (
                                  <span style={{ color: "#2563eb", marginLeft: 6, fontSize: 12, display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Clock size={13} /> {new Date(ca.endAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                                  </span>
                                )}
                              </>
                            )
                          ) : (
                            <>{shift.label}</>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          {/* Popup xác nhận chấm công */}
          {popup.show && (
            <div style={{
              position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
            }}>
              <div style={{ background: '#fff', borderRadius: 8, padding: 32, minWidth: 320, boxShadow: '0 2px 10px rgba(0,0,0,0.15)' }}>
                <h3 style={{ marginBottom: 16 }}>Xác nhận chấm công</h3>
                <div style={{ marginBottom: 24 }}>
                  {popup.isStart
                    ? <>Bạn muốn <b>bắt đầu</b> ca <b>{popup.shiftLabel}</b> ngày <b>{popup.date}</b>?</>
                    : <>Bạn muốn <b>kết thúc</b> ca <b>{popup.shiftLabel}</b> ngày <b>{popup.date}</b>?</>
                  }
                </div>
                <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end' }}>
                  <button onClick={() => setPopup({ show: false, date: '', shiftId: '', shiftLabel: '', isStart: true })} style={{ padding: '8px 18px', borderRadius: 6, border: '1px solid #ccc', background: '#fff', cursor: 'pointer' }}>Huỷ</button>
                  <button onClick={() => handleCheckin(popup.shiftId, popup.isStart)} style={{ padding: '8px 18px', borderRadius: 6, border: 'none', background: '#2563eb', color: '#fff', fontWeight: 500, cursor: 'pointer' }}>Đồng ý</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimekeepingPage;