import React, { useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import axios from "axios";

// Cấu hình axios
axios.defaults.baseURL = 'http://localhost:8080';

const ShiftRegPage = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [registeredShifts, setRegisteredShifts] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [popup, setPopup] = useState({ show: false, message: '', type: '' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserShifts = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData?.success || !userData?.data) {
          showPopup('Vui lòng đăng nhập để xem ca làm việc!', 'error');
          return;
        }

        const response = await axios.get(`/api/shifts/user/${userData.data.phone}`);
        if (response.data.success) {
          // Chuyển đổi dữ liệu từ API thành định dạng phù hợp
          const formattedShifts = response.data.data.reduce((acc, shift) => {
            const date = shift.date;
            if (!acc[date]) {
              acc[date] = [];
            }
            // Chuyển đổi type từ MORNING, AFTERNOON, EVENING sang morning, afternoon, evening
            const shiftType = shift.type.toLowerCase();
            acc[date].push(shiftType);
            return acc;
          }, {});
          
          setRegisteredShifts(formattedShifts);
        } else {
          showPopup('Không thể lấy dữ liệu ca làm việc!', 'error');
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu ca làm việc:', error);
        showPopup('Có lỗi xảy ra khi lấy dữ liệu ca làm việc!', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserShifts();
  }, []);

  const showPopup = (message, type = 'info') => {
    setPopup({ show: true, message, type });
    setTimeout(() => {
      setPopup({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const userData = JSON.parse(localStorage.getItem('user'));
      
      if (!userData?.success || !userData?.data) {
        showPopup('Vui lòng đăng nhập để đăng ký ca làm việc!', 'error');
        return;
      }

      // Lấy danh sách ca đã đăng ký từ API
      const userResponse = await axios.get(`/api/shifts/user/${userData.data.phone}`);
      const existingShifts = userResponse.data.success ? userResponse.data.data.reduce((acc, shift) => {
        const date = shift.date.split('T')[0];
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(shift.type.toLowerCase());
        return acc;
      }, {}) : {};

      // Tìm những ca mới được đăng ký
      const newShifts = {};
      Object.keys(registeredShifts).forEach(date => {
        const newShiftsForDate = registeredShifts[date].filter(shift => 
          !existingShifts[date] || !existingShifts[date].includes(shift)
        );
        if (newShiftsForDate.length > 0) {
          newShifts[date] = newShiftsForDate.map(shift => shift.toUpperCase());
        }
      });

      // Nếu không có ca mới nào được đăng ký
      if (Object.keys(newShifts).length === 0) {
        showPopup('Không có ca mới nào được đăng ký!', 'info');
        return;
      }

      // Gửi request đăng ký ca mới
      const response = await axios.post(`/api/shifts/register/${userData.data.phone}`, {
        shifts: newShifts
      });

      if (response.data.success) {
        showPopup('Đăng ký ca làm việc thành công!', 'success');
        // Refresh lại dữ liệu sau khi đăng ký thành công
        const updatedResponse = await axios.get(`/api/shifts/user/${userData.data.phone}`);
        if (updatedResponse.data.success) {
          const formattedShifts = updatedResponse.data.data.reduce((acc, shift) => {
            const date = shift.date.split('T')[0];
            if (!acc[date]) {
              acc[date] = [];
            }
            acc[date].push(shift.type.toLowerCase());
            return acc;
          }, {});
          
          setRegisteredShifts(formattedShifts);
        }
      } else {
        showPopup(response.data.message || 'Đăng ký ca làm việc thất bại!', 'error');
      }
    } catch (error) {
      console.error('Lỗi khi đăng ký ca:', error);
      showPopup(error.response?.data?.message || 'Có lỗi xảy ra khi đăng ký ca làm việc!', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const shifts = [
    { id: 'morning', name: 'Sáng', time: '6:00-14:00', color: '#87CEEB' },
    { id: 'afternoon', name: 'Chiều', time: '14:00-22:00', color: '#98D8E8' },
    { id: 'evening', name: 'Tối', time: '22:00-6:00', color: '#A8E6CF' }
  ];

  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];

  const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Thêm các ngày của tháng trước
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({
        date: prevDate,
        isCurrentMonth: false,
        dateString: prevDate.toISOString().split('T')[0]
      });
    }

    // Thêm các ngày của tháng hiện tại
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      // Thêm 1 ngày để bù trừ
      currentDate.setDate(currentDate.getDate() + 1);
      days.push({
        date: currentDate,
        isCurrentMonth: true,
        dateString: currentDate.toISOString().split('T')[0]
      });
    }

    // Thêm các ngày của tháng sau để đủ 42 ô (6 tuần)
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const nextDate = new Date(year, month + 1, day);
      // Thêm 1 ngày để bù trừ
      nextDate.setDate(nextDate.getDate() + 1);
      days.push({
        date: nextDate,
        isCurrentMonth: false,
        dateString: nextDate.toISOString().split('T')[0]
      });
    }

    return days;
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + direction);
      return newMonth;
    });
  };

  const toggleShift = (dateString, shiftId) => {
    const today = new Date().toISOString().split('T')[0];
    if (dateString <= today) {
      showPopup('Không thể đăng ký ca cho ngày đã qua hoặc hôm nay!', 'error');
      return;
    }

    setRegisteredShifts(prev => {
      const dayShifts = prev[dateString] || [];
      const isRegistered = dayShifts.includes(shiftId);
      
      if (isRegistered) {
        const newShifts = dayShifts.filter(id => id !== shiftId);
        if (newShifts.length === 0) {
          const { [dateString]: _, ...rest } = prev;
          return rest;
        }
        return {
          ...prev,
          [dateString]: newShifts
        };
      } else {
        return {
          ...prev,
          [dateString]: [...dayShifts, shiftId]
        };
      }
    });
  };

  const isToday = (dateString) => {
    const today = new Date().toISOString().split('T')[0];
    return dateString === today;
  };

  const isPastDate = (dateString) => {
    const today = new Date().toISOString().split('T')[0];
    return dateString < today;
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Navbar />
      
      {/* Popup Component */}
      {popup.show && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          padding: '15px 25px',
          borderRadius: '8px',
          background: popup.type === 'error' ? '#ff6b6b' : 
                     popup.type === 'success' ? '#51cf66' : '#339af0',
          color: 'white',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1000,
          animation: 'slideIn 0.3s ease-out',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          {popup.type === 'error' && '❌'}
          {popup.type === 'success' && '✅'}
          {popup.type === 'info' && 'ℹ️'}
          <span>{popup.message}</span>
        </div>
      )}

      <style>
        {`
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}
      </style>

      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Calendar */}
        <div style={{
          background: 'white',
          borderRadius: '10px',
          padding: '20px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          position: 'relative'
        }}>
          {isLoading && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(255, 255, 255, 0.8)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1,
              borderRadius: '10px'
            }}>
              <div style={{ fontSize: '18px', color: '#666' }}>Đang tải dữ liệu...</div>
            </div>
          )}
          {/* Calendar Header */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <button
              onClick={() => navigateMonth(-1)}
              style={{
                background: '#667eea',
                color: 'white',
                border: 'none',
                padding: '10px 15px',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              ← Tháng trước
            </button>
            
            <h2 style={{ margin: 0, color: '#333' }}>
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h2>
            
            <button
              onClick={() => navigateMonth(1)}
              style={{
                background: '#667eea',
                color: 'white',
                border: 'none',
                padding: '10px 15px',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Tháng sau →
            </button>
          </div>

          {/* Days of week header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '1px',
            marginBottom: '10px'
          }}>
            {dayNames.map(day => (
              <div key={day} style={{
                padding: '10px',
                textAlign: 'center',
                fontWeight: 'bold',
                background: '#f8f9fa',
                color: '#666'
              }}>
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '1px',
            background: '#e9ecef'
          }}>
            {days.map((day, index) => {
              const dayShifts = registeredShifts[day.dateString] || [];
              const isCurrentMonth = day.isCurrentMonth;
              const todayFlag = isToday(day.dateString);
              const pastDate = isPastDate(day.dateString);

              return (
                <div
                  key={index}
                  style={{
                    background: 'white',
                    minHeight: '120px',
                    padding: '5px',
                    opacity: isCurrentMonth ? 1 : 0.3,
                    border: todayFlag ? '2px solid #ff6b6b' : 'none',
                    position: 'relative'
                  }}
                >
                  {/* Số ngày */}
                  <div style={{
                    fontWeight: todayFlag ? 'bold' : 'normal',
                    color: todayFlag ? '#ff6b6b' : (pastDate ? '#999' : '#333'),
                    fontSize: '14px',
                    marginBottom: '5px'
                  }}>
                    {day.date.getDate()}
                  </div>

                  {/* Các ca làm việc */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {shifts.map(shift => {
                      const isRegistered = dayShifts.includes(shift.id);
                      return (
                        <div
                          key={shift.id}
                          onClick={() => isCurrentMonth && !pastDate && toggleShift(day.dateString, shift.id)}
                          style={{
                            height: '25px',
                            background: isRegistered ? shift.color : '#f8f9fa',
                            border: isRegistered ? `1px solid ${shift.color}` : '1px solid #e9ecef',
                            borderRadius: '3px',
                            cursor: (isCurrentMonth && !pastDate) ? 'pointer' : 'not-allowed',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '10px',
                            fontWeight: isRegistered ? 'bold' : 'normal',
                            color: isRegistered ? '#333' : '#999',
                            opacity: pastDate ? 0.5 : 1,
                            transition: 'all 0.2s'
                          }}
                          onMouseOver={(e) => {
                            if (isCurrentMonth && !pastDate) {
                              e.target.style.transform = 'scale(1.05)';
                            }
                          }}
                          onMouseOut={(e) => {
                            e.target.style.transform = 'scale(1)';
                          }}
                        >
                          {shift.name}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submit Button */}
          <div style={{ 
            marginTop: '20px', 
            display: 'flex', 
            justifyContent: 'center' 
          }}>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              style={{
                background: isSubmitting ? '#ccc' : '#667eea',
                color: 'white',
                border: 'none',
                padding: '12px 30px',
                borderRadius: '5px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                fontWeight: '500',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {isSubmitting ? (
                <>
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <>
                  <span>📝 Đăng ký ca làm việc</span>
                </>
              )}
            </button>
          </div>

          {/* Legend */}
          <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '5px' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>Chú thích:</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center' }}>
              {shifts.map(shift => (
                <div key={shift.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    background: shift.color,
                    borderRadius: '3px',
                    border: `1px solid ${shift.color}`
                  }}></div>
                  <span style={{ fontSize: '14px', color: '#666' }}>
                    Ca {shift.name} ({shift.time})
                  </span>
                </div>
              ))}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  background: 'white',
                  borderRadius: '3px',
                  border: '2px solid #ff6b6b'
                }}></div>
                <span style={{ fontSize: '14px', color: '#666' }}>Hôm nay</span>
              </div>
            </div>
            
            <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
              💡 <strong>Hướng dẫn:</strong> Click vào ô ca làm việc để đăng ký/hủy đăng ký. 
              Chỉ có thể đăng ký ca từ ngày mai trở đi.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShiftRegPage;