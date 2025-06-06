import React, { useRef } from "react";

const ScanQrPopup = ({ onClose, onUpload, onConfirm, uploadedFile }) => {
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    if (onUpload) onUpload(e.target.files[0]);
  };

  const canConfirm = Boolean(uploadedFile);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.18)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 3000
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 20,
        padding: 32,
        minWidth: 350,
        maxWidth: 420,
        boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 18
      }}>
        <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 8, color: '#222' }}>
          Quét mã QR để thanh toán
        </div>
        <img src="/fake-qrcode.svg" alt="QR code" style={{ width: 180, height: 180, borderRadius: 12, background: '#f7f7f7', marginBottom: 12 }} />
        <label htmlFor="upload-bill" style={{
          background: '#4e6cf4',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          padding: '10px 28px',
          fontSize: 16,
          fontWeight: 500,
          cursor: 'pointer',
          marginTop: 8,
          marginBottom: 8,
          display: 'inline-block'
        }}>
          Tải lên ảnh hóa đơn
          <input
            id="upload-bill"
            type="file"
            accept="image/*,application/pdf"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </label>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 18, marginTop: 12 }}>
          <button
            onClick={onClose}
            style={{
              background: '#fff',
              color: '#222',
              border: '1px solid #ccc',
              borderRadius: 8,
              padding: '10px 32px',
              fontSize: 16,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Đóng
          </button>
          <button
            onClick={canConfirm ? onConfirm : undefined}
            disabled={!canConfirm}
            style={{
              background: canConfirm ? '#19d219' : '#ccc',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '10px 32px',
              fontSize: 16,
              fontWeight: 500,
              cursor: canConfirm ? 'pointer' : 'not-allowed',
              transition: 'background 0.2s',
            }}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScanQrPopup;
