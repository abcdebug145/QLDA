import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, getMe } from '../api/authApi';

const LoginPage = () => {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    phone: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resp = await login(credentials);
      localStorage.setItem('token', resp.data.token);
      // Gọi API lấy thông tin user
      const userInfo = await getMe();
      localStorage.setItem('user', JSON.stringify(userInfo));
      navigate("/");
    } catch (err) {
      setError("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin." + err);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(120deg, #eaffd0 0%, #d0f0ff 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* SVG cầu lông rải rác background */}
      <img src="/shuttle.svg" alt="shuttle" style={{ position: 'absolute', top: 32, left: 32, width: 64, opacity: 0.9, zIndex: 1 }} />
      <img src="/racket.svg" alt="racket" style={{ position: 'absolute', bottom: 32, right: 32, width: 80, opacity: 0.8, zIndex: 1 }} />
      <img src="/shuttle.svg" alt="shuttle2" style={{ position: 'absolute', top: 120, right: 80, width: 44, opacity: 0.18, transform: 'rotate(-20deg)', zIndex: 1 }} />
      <img src="/racket.svg" alt="racket2" style={{ position: 'absolute', top: 200, left: 80, width: 54, opacity: 0.13, transform: 'rotate(30deg)', zIndex: 1 }} />
      <img src="/shuttle.svg" alt="shuttle3" style={{ position: 'absolute', bottom: 120, left: 60, width: 38, opacity: 0.15, transform: 'rotate(10deg)', zIndex: 1 }} />
      <img src="/net.svg" alt="net" style={{ position: 'absolute', top: '50%', left: '50%', width: 120, opacity: 0.10, transform: 'translate(-50%,-50%) rotate(-8deg)', zIndex: 1 }} />
      <img src="/js1.svg" alt="court" style={{ position: 'absolute', bottom: 40, right: 180, width: 90, opacity: 0.10, zIndex: 1 }} />
      <img src="/racket.svg" alt="racket3" style={{ position: 'absolute', top: 60, right: 180, width: 38, opacity: 0.10, transform: 'rotate(-40deg)', zIndex: 1 }} />
      <img src="/trophy.svg" alt="trophy" style={{ position: 'absolute', top: 40, right: 40, width: 48, opacity: 0.12, zIndex: 1 }} />
      <img src="/shuttle.svg" alt="shuttle4" style={{ position: 'absolute', bottom: 200, right: 100, width: 32, opacity: 0.13, transform: 'rotate(25deg)', zIndex: 1 }} />
      <img src="/racket.svg" alt="racket4" style={{ position: 'absolute', bottom: 80, left: 120, width: 40, opacity: 0.10, transform: 'rotate(15deg)', zIndex: 1 }} />
      <img src="/shuttle.svg" alt="shuttle5" style={{ position: 'absolute', top: 300, left: 30, width: 28, opacity: 0.10, zIndex: 1 }} />
      <img src="/net.svg" alt="net2" style={{ position: 'absolute', bottom: 60, left: '50%', width: 100, opacity: 0.08, transform: 'translateX(-50%)', zIndex: 1 }} />
      <img src="/trophy.svg" alt="trophy2" style={{ position: 'absolute', bottom: 30, left: 40, width: 38, opacity: 0.10, zIndex: 1 }} />
      {/* Card đăng nhập */}
      <div style={{
        background: "#fff",
        borderRadius: 24,
        boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
        padding: 40,
        minWidth: 360,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 18,
        zIndex: 2
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <img src="/badminton-svgrepo-com.svg" alt="logo" style={{ width: 38, height: 38 }} />
          <span style={{ fontWeight: 800, fontSize: 28, color: '#4e6cf4', letterSpacing: 1 }}>Court<span style={{ fontStyle: 'italic', color: '#4CAF50' }}>Seeker</span><span style={{ color: '#ff4444' }}>88</span></span>
        </div>
        <div style={{ fontSize: 18, color: '#1976d2', fontWeight: 600, marginBottom: 8, textAlign: 'center' }}>
          Đăng nhập hệ thống quản lý đặt sân & phụ kiện cầu lông
        </div>
        <form
          onSubmit={handleSubmit}
          style={{
            width: '100%',
            display: "flex",
            flexDirection: "column",
            gap: 18
          }}
        >
          <input
            type="text"
            name="phone"
            placeholder="Số điện thoại"
            value={credentials.phone}
            onChange={handleChange}
            style={{ padding: 12, borderRadius: 8, border: "1.5px solid #b3e5fc", fontSize: 16, background: '#f8fdff' }}
          />
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Mật khẩu"
              value={credentials.password}
              onChange={handleChange}
              style={{
                padding: 12,
                borderRadius: 8,
                border: "1.5px solid #b3e5fc",
                fontSize: 16,
                width: "100%",
                background: '#f8fdff',
                boxSizing: "border-box"
              }}
            />
            <span
              onClick={() => setShowPassword((v) => !v)}
              style={{
                position: "absolute",
                right: 14,
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                fontSize: 18,
                color: "#888",
                userSelect: "none"
              }}
              title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>
          {error && <div style={{ color: "#ff4444", fontSize: 15, textAlign: "center" }}>{error}</div>}
          <button
            type="submit"
            style={{
              background: "linear-gradient(90deg, #4e6cf4 0%, #4CAF50 100%)",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "12px 0",
              fontSize: 18,
              fontWeight: 700,
              cursor: "pointer",
              marginTop: 8,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              transition: "background 0.2s"
            }}
          >
            Đăng nhập
          </button>
          <div style={{ textAlign: "center", marginTop: 8 }}>
            Chưa có tài khoản?&nbsp;
            <a href="/register" style={{ color: "#4CAF50", textDecoration: "underline", fontWeight: 600 }}>Đăng ký</a>
            
            <br/>
            <a href="/" style={{ color: "#4CAF50", textDecoration: "none", fontWeight: 600 }}>Tiếp tục mà không cần đăng nhập</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
