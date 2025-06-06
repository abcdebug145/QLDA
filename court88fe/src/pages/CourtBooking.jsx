/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import TimelineGrid from "../components/booking/TimelineGrid";
import Logo from "../components/ui/Logo";
import ScanQrPopup from "../components/ui/ScanQrPopup";
import SuccessPopup from "../components/ui/SuccessPopup";
import { createBooking } from "../api/bookingService";
import { getCourtsByDate } from "../api/courtApi";

const times = [
  "05:00", "05:30", "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30"
];

// Tạo mảng các ngày trong 7 ngày tới
const getNext7Days = () => {
  const days = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    days.push(date);
  }
  return days;
};

// Format date to YYYY-MM-DD
const formatDateToYYYYMMDD = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Format time to HH:mm
const formatTime = (time) => {
  // Xử lý trường hợp time là "HH:mm:ss"
  const timeStr = time.split(':').slice(0, 2).join(':');
  const [hours, minutes] = timeStr.split(':');
  return `${hours.padStart(2, '0')}:${minutes}`;
};

const initialCourts = [
  { name: "SÂN 1", slots: ["empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty"]},
  { name: "SÂN 2", slots: ["empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty"]},
  { name: "SÂN 3", slots: ["empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty"]},
  { name: "SÂN 4", slots: ["empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty"]},
  { name: "SÂN 5", slots: ["empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty"]},
  { name: "SÂN 6", slots: ["empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty","empty"] }
];

// Hàm tính giá cho một khung giờ
const getSlotPrice = (timeSlot) => {
  const time = timeSlot.split(':').map(Number);
  const hour = time[0];
  const minute = time[1];
  
  // Nếu từ 17:30 đến 21:30
  if ((hour > 17 || (hour === 17 && minute >= 30)) && 
      (hour < 21 || (hour === 21 && minute <= 30))) {
    return 50000;
  }
  return 35000;
};

const CourtBooking = () => {
  const [courts, setCourts] = useState(initialCourts);
  const [showModal, setShowModal] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [paymentPercent, setPaymentPercent] = useState(100);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });
  const [showQrPopup, setShowQrPopup] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "",
    phone: ""
  });
  const [alertMsg, setAlertMsg] = useState("");

  // Lấy thông tin user từ localStorage
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        const userData = user.data || user;
        setUserInfo({
          name: userData.name || "",
          phone: userData.phone || ""
        });
      } catch (error) {
        console.error('Lỗi khi đọc thông tin user:', error);
      }
    }
  }, []);

  // Lấy thông tin sân theo ngày
  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const response = await getCourtsByDate(selectedDate);
        const bookings = response.data || [];
        
        console.log('Bookings from API:', bookings);
        
        if (bookings.length === 0) {
          setCourts(initialCourts);
          return;
        }
        
        // Tạo mảng mới với 6 sân, mỗi sân có 38 khung giờ
        const updatedCourts = Array(6).fill(null).map((_, index) => {
          const courtName = `SÂN ${index + 1}`;
          
          // Tạo mảng 38 khung giờ, mặc định là "empty"
          const slots = Array(38).fill("empty");
          
          // Lọc các booking cho sân hiện tại
          const courtBookings = bookings.filter(booking => booking.courtName === courtName);
          
          console.log(`Bookings for ${courtName}:`, courtBookings);
          
          // Cập nhật các khung giờ đã được đặt
          courtBookings.forEach(booking => {
            const startTime = formatTime(booking.startTime);
            console.log(`Processing booking: ${booking.startTime} -> ${startTime}`);
            const timeIndex = times.indexOf(startTime);
            console.log(`Time index for ${startTime}:`, timeIndex);
            
            if (timeIndex !== -1) {
              slots[timeIndex] = "booked";
            }
          });
          
          return {
            name: courtName,
            slots
          };
        });
        
        console.log('Updated courts:', updatedCourts);
        setCourts(updatedCourts);
      } catch (error) {
        console.error('Lỗi khi lấy thông tin sân:', error);
        alert('Có lỗi xảy ra khi lấy thông tin sân. Vui lòng thử lại sau.');
      }
    };

    fetchCourts();
  }, [selectedDate]);

  const handleCellClick = (courtIdx, slotIdx) => {
    setCourts(prev => prev.map((court, i) => {
      if (i !== courtIdx) return court;
      return {
        ...court,
        slots: court.slots.map((v, j) => {
          if (j !== slotIdx) return v;
          if (v === "booked") return v;
          if (v === "empty") return "selected";
          if (v === "selected") return "empty";
          return v;
        })
      };
    }));
  };

  const handleConfirm = () => {
    // Lấy thông tin các slot đã chọn cho từng sân
    const selectedCourts = courts.map((court) => {
      const slots = court.slots
        .map((slot, idx) => (slot === "selected" ? idx : null))
        .filter(idx => idx !== null);
      return slots.length > 0 ? { court: court.name, slots } : null;
    }).filter(Boolean);

    if (selectedCourts.length > 0) {
      // Tạo chuỗi thông tin cho từng sân
      const infoList = selectedCourts.map(info => {
        const slotTimes = info.slots.map(idx => times[idx]);
        return `${slotTimes.join(", ")}, ${info.court}`;
      });
      setSelectedInfo({
        infoList
      });
      setShowModal(true);
    } else {
      setAlertMsg("Vui lòng chọn ít nhất một khung giờ!");
    }
  };

  const handleCloseModal = () => setShowModal(false);

  const formatDate = (date) => {
    const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    return `${days[date.getDay()]}, ${date.getDate()}/${date.getMonth() + 1}`;
  };

  // Xử lý upload file bill
  const handleUpload = (file) => {
    setUploadedFile(file);
  };

  // Xử lý xác nhận thanh toán thành công
  const handleQrConfirm = async () => {
    try {
      setIsLoading(true);
      // Chuẩn bị dữ liệu đặt sân
      const bookingData = {
        date: formatDateToYYYYMMDD(selectedDate),
        paymentPercent,
        courts: courts.map(court => {
          const slots = court.slots
            .map((slot, idx) => (slot === "selected" ? {
              timeSlot: times[idx],
              price: getSlotPrice(times[idx])
            } : null))
            .filter(slot => slot !== null);
          return slots.length > 0 ? { courtName: court.name, slots } : null;
        }).filter(Boolean),
        userInfo: {
          name: userInfo.name,
          phone: userInfo.phone
        }
      };
      // Gọi API booking ở đây
      await createBooking(bookingData);
      setShowQrPopup(false);
      setUploadedFile(null);
      setTimeout(() => {
        setShowSuccess(true);
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      }, 200);
    } catch (error) {
      console.error('Lỗi khi đặt sân:', error);
      setAlertMsg('Có lỗi xảy ra khi đặt sân. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotalPrice = () => {
    let total = 0;
    courts.forEach(court => {
      court.slots.forEach((slot, idx) => {
        if (slot === "selected") {
          total += getSlotPrice(times[idx]);
        }
      });
    });
    return total;
  };

  const handlePayment = () => {
    // Không gọi API booking ở đây nữa, chỉ đóng modal và mở popup QR
    setShowModal(false);
    setTimeout(() => setShowQrPopup(true), 200);
  };

  return (
    <div style={{ margin: 0, padding: 0 }}>
      <Navbar />
      <img src="/court-map.png" alt="Sơ đồ sân" style={{ width: 800, display: "block", margin: "0 auto" }} />
      
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        margin: "24px 0",
        gap: "16px"
      }}>
        <span style={{ fontSize: 16, fontWeight: 500 }}>Chọn ngày:</span>
        <select 
          value={formatDateToYYYYMMDD(selectedDate)}
          onChange={(e) => {
            const [year, month, day] = e.target.value.split('-').map(Number);
            const newDate = new Date(year, month - 1, day);
            newDate.setHours(0, 0, 0, 0);
            setSelectedDate(newDate);
          }}
          style={{
            padding: "8px 16px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            fontSize: "16px",
            cursor: "pointer",
            minWidth: "200px"
          }}
        >
          {getNext7Days().map((date) => (
            <option 
              key={formatDateToYYYYMMDD(date)} 
              value={formatDateToYYYYMMDD(date)}
            >
              {formatDate(date)}
            </option>
          ))}
        </select>
      </div>
      
      <TimelineGrid
        times={times}
        courts={courts}
        onCellClick={handleCellClick}
      />
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "20px" }}>
        <button
          onClick={handleConfirm}
          style={{
            padding: "12px 24px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
          }}
        >
          Xác nhận
        </button>
      </div>
      {showModal && selectedInfo && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(0,0,0,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "#f7f7f7",
            borderRadius: 20,
            padding: 32,
            minWidth: 500,
            maxWidth: 700,
            boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}>
            <div style={{ fontSize: 32, fontWeight: 600, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <img 
                src="/badminton-svgrepo-com.svg" 
                alt="Logo" 
                style={{ height: 32, marginRight: 8, cursor: 'pointer' }} 
                onClick={() => { window.location.href = '/'; }}
              />
              <span style={{ color: "#222" }}>Court</span><span style={{ color: "#4CAF50", fontStyle: "italic" }}>Seeker</span><span style={{ color: "#ff4444" }}>88</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 500, marginBottom: 24 }}>Xác nhận thanh toán</div>
            <div style={{ width: '100%', margin: '0 0 0 0', fontSize: 17, color: '#222', fontWeight: 500, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                <span style={{ color: '#888', fontWeight: 400, width: 150, display: 'inline-block' }}>Họ tên:</span>
                <span style={{ color: '#222', fontWeight: 500 }}>{userInfo.name}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                <span style={{ color: '#888', fontWeight: 400, width: 150, display: 'inline-block' }}>Số điện thoại:</span>
                <span style={{ color: '#222', fontWeight: 500 }}>{userInfo.phone}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                <span style={{ color: '#888', fontWeight: 400, width: 150, display: 'inline-block' }}>Ngày đặt sân:</span>
                <span style={{ color: '#222', fontWeight: 500 }}>{formatDate(selectedDate)}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                <span style={{ color: '#888', fontWeight: 400, width: 150, display: 'inline-block' }}>Thông tin đặt hàng:</span>
                <div style={{ color: '#222', fontWeight: 500 }}>
                  {selectedInfo.infoList && selectedInfo.infoList.map((line, idx) => {
                    const [times, court] = line.split(', ');
                    const totalPrice = times.split(', ').reduce((sum, time) => sum + getSlotPrice(time), 0);
                    return (
                      <div key={idx} style={{ marginBottom: 8 }}>
                        <div>{line}</div>
                        <div style={{ color: '#666', fontSize: 14, marginTop: 4 }}>
                          Giá: {totalPrice.toLocaleString('vi-VN')}đ
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                <span style={{ color: '#888', fontWeight: 400, width: 150, display: 'inline-block' }}>Tổng tiền:</span>
                <span style={{ color: '#ff4444', fontWeight: 600, fontSize: 20 }}>
                  {calculateTotalPrice().toLocaleString('vi-VN')}đ
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ color: '#888', fontWeight: 400, width: 150, display: 'inline-block' }}>Số tiền thanh toán:</span>
                <button onClick={() => setPaymentPercent(50)} style={{
                  background: paymentPercent === 50 ? "#4CAF50" : "#eee",
                  color: paymentPercent === 50 ? "#fff" : "#888",
                  border: "none",
                  borderRadius: 6,
                  padding: "4px 16px",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: 16
                }}>50%</button>
                <button onClick={() => setPaymentPercent(100)} style={{
                  background: paymentPercent === 100 ? "#4CAF50" : "#eee",
                  color: paymentPercent === 100 ? "#fff" : "#888",
                  border: "none",
                  borderRadius: 6,
                  padding: "4px 16px",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: 16
                }}>100%</button>
              </div>
              <div style={{ color: "#ff4444", fontSize: 14, marginTop: 8, fontWeight: 500 }}>
                Số tiền cần thanh toán: {(calculateTotalPrice() * paymentPercent / 100).toLocaleString('vi-VN')}đ
              </div>
              <div style={{ color: "#ff4444", fontSize: 14, marginTop: 8, fontWeight: 500 }}>Chúng tôi sẽ không hoàn tiền sau khi thanh toán</div>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 32 }}>
              <button onClick={handleCloseModal} style={{
                background: "#fff",
                color: "#222",
                border: "none",
                borderRadius: 8,
                padding: "8px 22px",
                fontSize: 15,
                fontWeight: 600,
                boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
                display: "flex",
                alignItems: "center",
                gap: 8,
                cursor: "pointer"
              }}>
                <span style={{ fontSize: 18 }}>✖</span> Hủy
              </button>
              <button 
                style={{
                  background: "#4CAF50",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "8px 22px",
                  fontSize: 15,
                  fontWeight: 600,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  cursor: isLoading ? "not-allowed" : "pointer",
                  opacity: isLoading ? 0.7 : 1
                }}
                onClick={handlePayment}
                disabled={isLoading}
              >
                <span style={{ fontSize: 18 }}>✔</span> 
                {isLoading ? "Đang xử lý..." : "Thanh toán"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Popup scan QR */}
      {showQrPopup && (
        <ScanQrPopup
          onClose={() => { setShowQrPopup(false); setUploadedFile(null); }}
          onUpload={handleUpload}
          onConfirm={handleQrConfirm}
          uploadedFile={uploadedFile}
        />
      )}
      {/* Popup thành công */}
      {showSuccess && (
        <SuccessPopup onClose={() => setShowSuccess(false)} />
      )}
      {alertMsg && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2000
        }}>
          <div style={{
            background: "#fff",
            padding: 32,
            borderRadius: 12,
            boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
            minWidth: 300,
            textAlign: "center"
          }}>
            <div style={{ marginBottom: 16, fontSize: 18, color: "#222" }}>{alertMsg}</div>
            <button
              style={{
                background: "#4CAF50",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: "8px 24px",
                fontWeight: 600,
                fontSize: 16,
                cursor: "pointer"
              }}
              onClick={() => setAlertMsg("")}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourtBooking;
