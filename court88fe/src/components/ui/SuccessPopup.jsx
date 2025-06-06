import React from "react";
import Logo from "./Logo";

const SuccessPopup = ({ onClose }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.12)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 3000
    }}>
      <div style={{
        background: '#eaeaea',
        borderRadius: 24,
        padding: '36px 32px 32px 32px',
        minWidth: 420,
        maxWidth: 600,
        boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 18
      }}>
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginBottom: 8 }}>
          <div style={{ fontSize: 32, fontWeight: 600, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', width: '100%' }}>
              <img 
                src="/badminton-svgrepo-com.svg" 
                alt="Logo" 
                style={{ height: 32, marginRight: 8, cursor: 'pointer' }} 
                onClick={() => { window.location.href = '/'; }}
              />
              <span style={{ color: "#222" }}>Court</span><span style={{ color: "#4CAF50", fontStyle: "italic" }}>Seeker</span><span style={{ color: "#ff4444" }}>88</span>
            </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, margin: '24px 0 18px 0' }}>
          <span style={{ fontSize: 30, color: '#19d219', fontWeight: 700, lineHeight: 1 }}>✔</span>
          <span style={{ fontSize: 20, fontWeight: 500, color: '#111' }}>Đơn của bạn sẽ được duyệt tự động trong vòng 5p</span>
        </div>
        <button
          onClick={onClose}
          style={{
            background: '#fff',
            color: '#222',
            border: 'none',
            borderRadius: 12,
            padding: '12px 40px',
            fontSize: 18,
            fontWeight: 500,
            boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
            cursor: 'pointer',
            marginTop: 12
          }}
        >
          Đóng
        </button>
      </div>
    </div>
  );
};

export default SuccessPopup; 