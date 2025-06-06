import React, { useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";

const ProfilePage = () => {
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr).data;
        setForm({
          name: user.name || "",
          phone: user.phone || "",
          address: user.address || ""
        });
      // eslint-disable-next-line no-empty
      } catch {}
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Gọi API cập nhật thông tin ở đây nếu có
    // Sau khi cập nhật thành công:
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        let user = JSON.parse(userStr);
        if (user.data) user = user.data;
        const updatedUser = { ...user, name: form.name, address: form.address };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } catch { /* empty */ }
    }
    setSuccess("Cập nhật thông tin thành công!");
    setTimeout(() => setSuccess(""), 2000);
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(120deg, #eaffd0 0%, #d0f0ff 100%)" }}>
      <Navbar />
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "48px 0 0 0" }}>
        <div style={{
          background: "#fff",
          borderRadius: 24,
          boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
          padding: 36,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
          marginTop: 32
        }}>
          <div style={{
            width: 96,
            height: 96,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #4e6cf4 60%, #4CAF50 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 8,
            boxShadow: "0 2px 8px rgba(0,0,0,0.10)"
          }}>
            <span style={{ fontSize: 48, color: "#fff" }}>👤</span>
          </div>
          <h1 style={{ fontWeight: 800, fontSize: 28, marginBottom: 0, color: "#4e6cf4", letterSpacing: 1 }}>Thông tin tài khoản</h1>
          <form onSubmit={handleSubmit} style={{ width: "100%", display: "flex", flexDirection: "column", gap: 18, marginTop: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '80%' }}>
                <label style={{ fontWeight: 600, color: "#222", marginBottom: 4, display: 'block' }}>Họ và tên</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  style={{ width: "100%", padding: 12, paddingRight: 3, borderRadius: 10, border: "1.5px solid #b3e5fc", fontSize: 16, marginTop: 6, background: "#f8fdff" }}
                  required
                />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '80%' }}>
                <label style={{ fontWeight: 600, color: "#222", marginBottom: 4, display: 'block' }}>Số điện thoại</label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  readOnly
                  style={{ width: "100%", padding: 12, paddingRight: 3, borderRadius: 10, border: "1.5px solid #eee", fontSize: 16, marginTop: 6, background: "#f5f5f5", color: "#888" }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '80%' }}>
                <label style={{ fontWeight: 600, color: "#222", marginBottom: 4, display: 'block' }}>Địa chỉ</label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  style={{ width: "100%", padding: 12, paddingRight: 3, borderRadius: 10, border: "1.5px solid #b3e5fc", fontSize: 16, marginTop: 6, background: "#f8fdff" }}
                />
              </div>
            </div>
            {success && <div style={{ color: "#19d219", fontWeight: 600, textAlign: "center", fontSize: 16 }}>{success}</div>}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button
                type="submit"
                style={{
                  width: '40%',
                  background: "linear-gradient(90deg, #4e6cf4 0%, #4CAF50 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  padding: "14px 0",
                  fontSize: 18,
                  fontWeight: 700,
                  cursor: "pointer",
                  marginTop: 8,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  transition: "background 0.2s"
                }}
              >
                Lưu thay đổi
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 