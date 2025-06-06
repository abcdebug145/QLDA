import React, { useState, useEffect } from "react";
import Logo from "../ui/Logo";
import { useNavigate } from "react-router-dom";
import { getMe } from "../../api/authApi";

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Lấy user từ localStorage, kiểm tra null và .data
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        let user = JSON.parse(userStr);
        if (user && user.data) user = user.data;
        setUserInfo(user);
      } catch {
        setUserInfo(null);
      }
    } else {
      setUserInfo(null);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUserInfo(null);
    navigate('/login');
  };

  const handleProfile = () => {
    navigate('/profile');
    setShowDropdown(false);
  };

  return (
    <nav style={{
      background: "#339933",
      display: "flex",
      alignItems: "center",
      padding: 0,
      height: "64px",
      justifyContent: "space-between"
    }}>
      {/* Logo */}
      <Logo />

      {/* Thanh tìm kiếm */}
      <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
        <input
          type="text"
          placeholder="Tìm kiếm..."
          style={{
            width: 400,
            height: 32,
            borderRadius: 8,
            border: "none",
            padding: "0 12px",
            fontSize: 16
          }}
        />
        <button style={{
          background: "none",
          border: "none",
          marginLeft: -36,
          cursor: "pointer"
        }}>
          <span role="img" aria-label="search" style={{ fontSize: 20 }}>🔍</span>
        </button>
      </div>

      {/* Người dùng */}
      {localStorage.getItem('token') ? (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginRight: 16 }}>
          <span style={{ color: "#fff", fontSize: 20 }}>
            Xin chào, <b>{userInfo?.name || '...'}</b>
          </span>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "#eee",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid #b3b3ff"
          }}>
            <span role="img" aria-label="user" style={{ fontSize: 22, color: "#7c5cff" }}>👤</span>
          </div>
          <div style={{ position: "relative" }}>
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              style={{ 
                background: "none",
                border: "none",
                color: "#fff",
                fontSize: 20,
                marginLeft: 4,
                cursor: "pointer"
              }}
            >
              ▼
            </button>
            
            {showDropdown && (
              <div style={{
                position: "absolute",
                top: "100%",
                right: 0,
                background: "#fff",
                borderRadius: 8,
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                padding: "8px 0",
                minWidth: 120
              }}>
                <button
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "8px 16px",
                    border: "none",
                    background: "none",
                    textAlign: "left",
                    cursor: "pointer",
                    fontSize: 16
                  }}
                  onClick={handleProfile}
                >
                  Hồ sơ
                </button>
                <button 
                  style={{
                    display: "block", 
                    width: "100%",
                    padding: "8px 16px",
                    border: "none",
                    background: "none", 
                    textAlign: "left",
                    cursor: "pointer",
                    fontSize: 16,
                    color: "#ff4d4f"
                  }}
                  onClick={handleLogout}
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginRight: 16 }}>
          <button onClick={() => navigate("/login")} style={{ background: "none", border: "none", color: "#fff", fontSize: 20, cursor: "pointer" }}>Đăng nhập</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
