import React, { useState } from "react";
import Navbar from "../components/layout/Navbar";
import Product from "../components/ui/Product";
import ScanQrPopup from "../components/ui/ScanQrPopup";
import SuccessPopup from "../components/ui/SuccessPopup";

const products = [
  {
    image: "/yonex-grip.png",
    name: "Quấn cán vợt Yonex",
    price: "40.000",
  },
  {
    image: "/yonex-tape.png",
    name: "Cốt cán Yonex",
    price: "150.000",
  },
  {
    image: "/yonex-socks.png",
    name: "Tất Yonex",
    price: "80.000",
  },
  {
    image: "/yonex-bag.png",
    name: "Túi Yonex",
    price: "495.000",
  },
  {
    image: "/yonex-shuttle.png",
    name: "Cầu Yonex",
    price: "1.050.000",
  },
  {
    image: "/bg65ti.png",
    name: "BG 65 Titanium",
    price: "150.000",
  },
  {
    image: "/exbolt65.png",
    name: "Exbolt 65",
    price: "200.000",
  },
  {
    image: "/bg80power.png",
    name: "BG 80 Power",
    price: "200.000",
  },
  {
    image: "/bg80.png",
    name: "BG 80",
    price: "180.000",
  },
  {
    image: "/bg66u.png",
    name: "BG 66 Ultimax",
    price: "180.000",
  },
];

function parsePrice(str) {
  return Number(str.replace(/\./g, ""));
}

const SHIPPING_FEE = 20000;

const BadmintonShop = () => {
  // Mảng số lượng từng sản phẩm trong giỏ
  const [cart, setCart] = useState(Array(products.length).fill(0));
  const [showCartModal, setShowCartModal] = useState(false);
  const [showQrPopup, setShowQrPopup] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('online'); // 'online' hoặc 'cod'

  // Tổng số sản phẩm trong giỏ
  const totalInCart = cart.reduce((a, b) => a + b, 0);

  // Tính tổng tiền sản phẩm
  const totalPrice = cart.reduce((sum, qty, idx) => sum + qty * parsePrice(products[idx].price), 0);
  // Tổng tiền thanh toán (bao gồm phí ship nếu có sản phẩm)
  const totalWithShipping = totalInCart > 0 ? totalPrice + SHIPPING_FEE : 0;

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

  // Xử lý thêm vào giỏ
  const handleAddToCart = idx => {
    setCart(q => q.map((v, i) => i === idx ? v + 1 : v));
  };

  // Xử lý loại bỏ hoặc giảm số lượng sản phẩm khỏi giỏ hàng
  const handleRemoveFromCart = (idx) => {
    setCart(q => q.map((v, i) => i === idx ? (v > 1 ? v - 1 : 0) : v));
  };

  // Xử lý khi bấm Thanh toán/Đặt Hàng
  const handleCheckout = async () => {
    setShowCartModal(false);
    setTimeout(async () => {
      if (paymentMethod === 'cod') {
        // Gọi API luôn nếu chọn COD
        try {
          const orderData = {
            products: products.map((p, idx) => cart[idx] > 0 ? ({ name: p.name, quantity: cart[idx], price: parsePrice(p.price) }) : null).filter(Boolean),
            shippingFee: SHIPPING_FEE,
            total: totalWithShipping,
            phone
          };
          await fetch('http://localhost:8080/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
          });
          setShowSuccess(true);
        } catch {
          alert('Có lỗi khi gửi đơn hàng!');
        }
      } else {
        // Online: mở popup QR như cũ
        setShowQrPopup(true);
      }
    }, 200); // Đợi popup cũ đóng
  };

  // Xử lý upload file bill
  const handleUpload = (file) => {
    setUploadedFile(file);
  };

  // Xử lý xác nhận thanh toán thành công
  const handleQrConfirm = async () => {
    try {
      // Gửi request đến /api/orders
      const orderData = {
        products: products.map((p, idx) => cart[idx] > 0 ? ({ name: p.name, quantity: cart[idx], price: parsePrice(p.price) }) : null).filter(Boolean),
        shippingFee: SHIPPING_FEE,
        total: totalWithShipping,
        phone
      };
      await fetch('http://localhost:8080/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      setShowQrPopup(false);
      setUploadedFile(null);
      setTimeout(() => {
        setShowSuccess(true);
      }, 200);
    } catch {
      alert('Có lỗi khi gửi đơn hàng!');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <Navbar />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 0 0 0' }}>
        <h1 style={{ textAlign: 'center', fontWeight: 'bold', letterSpacing: 2, fontSize: 36, margin: '24px 0 32px 0' }}>
          PHỤ KIỆN CẦU LÔNG
        </h1>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 32,
          justifyItems: 'center',
          alignItems: 'start',
          padding: '0 24px'
        }}>
          {products.map((p, idx) => (
            <Product
              key={p.name}
              image={p.image}
              name={p.name}
              price={p.price}
              onAddToCart={() => handleAddToCart(idx)}
            />
          ))}
        </div>
      </div>
      <button
        onClick={() => setShowCartModal(true)}
        style={{
          position: 'fixed',
          right: 32,
          bottom: 32,
          background: 'white',
          borderRadius: '50%',
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          width: 56,
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          border: 'none',
          cursor: 'pointer',
        }}
      >
        <img src="/cart.svg" alt="Giỏ hàng" style={{ width: 32, height: 32 }} />
        {totalInCart > 0 && (
          <span style={{
            position: 'absolute',
            top: 6,
            right: 6,
            background: '#ff4444',
            color: '#fff',
            borderRadius: '50%',
            minWidth: 22,
            height: 22,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            fontWeight: 600,
            boxShadow: '0 1px 4px rgba(0,0,0,0.12)'
          }}>{totalInCart}</span>
        )}
      </button>

      {/* Popup xác nhận giỏ hàng */}
      {showCartModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }}>
          <div style={{
            background: '#f7f7f7',
            borderRadius: 20,
            padding: 32,
            minWidth: 400,
            maxWidth: 600,
            boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <div style={{ fontSize: 28, fontWeight: 600, marginBottom: 16, color: '#4e6cf4' }}>
              Xác nhận đơn hàng
            </div>
            <div style={{ width: '100%', marginBottom: 16 }}>
              {cart.every(qty => qty === 0) ? (
                <div style={{ color: '#888', textAlign: 'center', fontSize: 16 }}>Chưa có sản phẩm nào trong giỏ hàng.</div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
                  <thead>
                    <tr style={{ color: '#888', fontWeight: 500 }}>
                      <th style={{ textAlign: 'left', padding: 4 }}>Sản phẩm</th>
                      <th style={{ textAlign: 'center', padding: 4 }}>Số lượng</th>
                      <th style={{ textAlign: 'right', padding: 4 }}>Đơn giá</th>
                      <th style={{ textAlign: 'right', padding: 4 }}>Thành tiền</th>
                      <th style={{ width: 32 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p, idx) => (
                      cart[idx] > 0 && (
                        <tr key={p.name}>
                          <td style={{ padding: 4 }}>{p.name}</td>
                          <td style={{ textAlign: 'center', padding: 4 }}>{cart[idx]}</td>
                          <td style={{ textAlign: 'right', padding: 4 }}>{p.price}VND</td>
                          <td style={{ textAlign: 'right', padding: 4 }}>{(parsePrice(p.price) * cart[idx]).toLocaleString()}VND</td>
                          <td style={{ textAlign: 'center', padding: 4 }}>
                            <button
                              onClick={() => handleRemoveFromCart(idx)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#ff4444',
                                fontSize: 20,
                                cursor: 'pointer',
                                padding: 0,
                                margin: 0,
                                lineHeight: 1
                              }}
                              title="Loại khỏi giỏ hàng"
                            >
                              &minus;
                            </button>
                          </td>
                        </tr>
                      )
                    ))}
                  </tbody>
                  <tfoot>
                    <tr style={{ fontWeight: 500, color: '#222', fontSize: 15 }}>
                      <td colSpan={3} style={{ textAlign: 'right', padding: 4 }}>Phí vận chuyển:</td>
                      <td style={{ textAlign: 'right', padding: 4 }}>{SHIPPING_FEE.toLocaleString()}VND</td>
                    </tr>
                    <tr style={{ fontWeight: 600, color: '#222', fontSize: 16 }}>
                      <td colSpan={3} style={{ textAlign: 'right', padding: 4 }}>Tổng cộng:</td>
                      <td style={{ textAlign: 'right', padding: 4 }}>{totalWithShipping.toLocaleString()}VND</td>
                    </tr>
                  </tfoot>
                </table>
              )}
            </div>
            {/* Thêm lựa chọn phương thức thanh toán */}
            <div style={{ width: '100%', margin: '16px 0 0 0', display: 'flex', gap: 32, alignItems: 'center', justifyContent: 'center' }}>
              <label style={{ fontSize: 16, cursor: 'pointer' }}>
                <input type="radio" name="paymentMethod" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} style={{ marginRight: 8 }} />
                Thanh toán khi nhận hàng
              </label>
              <label style={{ fontSize: 16, cursor: 'pointer' }}>
                <input type="radio" name="paymentMethod" value="online" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} style={{ marginRight: 8 }} />
                Thanh toán online
              </label>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 24 }}>
              <button
                onClick={() => setShowCartModal(false)}
                style={{
                  background: '#fff',
                  color: '#222',
                  border: 'none',
                  borderRadius: 8,
                  padding: '12px 32px',
                  fontSize: 18,
                  fontWeight: 600,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  cursor: 'pointer',
                }}
              >
                Đóng
              </button>
              { !cart.every(qty => qty === 0) && (
                <button
                  style={{
                    background: '#4e6cf4',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '12px 32px',
                    fontSize: 18,
                    fontWeight: 600,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    cursor: 'pointer',
                  }}
                  onClick={handleCheckout}
                >
                  Đặt Hàng
                </button>
              )}
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
    </div>
  );
};

export default BadmintonShop;
