import React, { useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import Product from "../components/ui/Product";
import ScanQrPopup from "../components/ui/ScanQrPopup";
import SuccessPopup from "../components/ui/SuccessPopup";
import axios from 'axios';

const SHIPPING_FEE = 20000;

function parsePrice(str) {
  if (typeof str === 'number') return str;
  return Number(String(str).replace(/\./g, ""));
}

const BadmintonShop = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]); // [{productId, quantity, ...}, ...]
  const [showCartModal, setShowCartModal] = useState(false);
  const [showQrPopup, setShowQrPopup] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [loadingCart, setLoadingCart] = useState(false);
  // Thay đổi: userId và phone dùng useState, đồng bộ từ localStorage
  const [userId, setUserId] = useState(null);
  const [phone, setPhone] = useState('');

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        const userData = user.data || user;
        setPhone(userData.phone || '');
        setUserId(userData.id || userData.userId || null);
        console.log('userId set:', userData.id || userData.userId || null);
      } catch {
        setPhone('');
        setUserId(null);
      }
    } else {
      setPhone('');
      setUserId(null);
    }
  }, []);

  // Fetch sản phẩm từ backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/products');
        if (res.data.success) {
          setProducts(res.data.data);
        }
      } catch {
        setProducts([]);
      }
    };
    fetchProducts();
  }, []);

  // Fetch cart từ backend khi có user
  useEffect(() => {
    const fetchCart = async () => {
      if (!userId) return;
      setLoadingCart(true);
      try {
        const res = await axios.get(`http://localhost:8080/api/cart?userId=${userId}`);
        if (res.data.success) {
          setCart(res.data.data.items || []);
        } else {
          setCart([]);
        }
      } catch {
        setCart([]);
      } finally {
        setLoadingCart(false);
      }
    };
    fetchCart();
  }, [userId]);

  // Helper: lấy quantity của productId trong cart
  const getCartQty = (productId) => {
    const item = cart.find(i => i.productId === productId);
    return item ? item.quantity : 0;
  };

  // Tổng số sản phẩm trong giỏ
  const totalInCart = cart.reduce((a, b) => a + (b.quantity || 0), 0);
  // Tính tổng tiền sản phẩm
  const totalPrice = cart.reduce((sum, item) => {
    const prod = products.find(p => p.id === item.productId);
    return sum + (item.quantity * (prod ? parsePrice(prod.price) : 0));
  }, 0);
  // Tổng tiền thanh toán (bao gồm phí ship nếu có sản phẩm)
  const totalWithShipping = totalInCart > 0 ? totalPrice + SHIPPING_FEE : 0;

  // Xử lý thêm vào giỏ
  const handleAddToCart = async (productId) => {
    if (!userId) return alert('Bạn cần đăng nhập để mua hàng!');
    console.log('userId khi thêm:', userId, 'productId:', productId);
    try {
      await axios.post('http://localhost:8080/api/cart/add', {
        userId, // KHÔNG ép kiểu số
        productId, // truyền nguyên string UUID
        quantity: 1
      });
      // Lấy lại cart mới
      const res = await axios.get(`http://localhost:8080/api/cart?userId=${userId}`);
      if (res.data.success) setCart(res.data.data.items || []);
    } catch (e) {
      console.error('Lỗi khi thêm vào giỏ hàng:', e);
      alert('Có lỗi khi thêm vào giỏ hàng!');
    }
  };

  const handleRemoveFromCart = async (productId) => {
    if (!userId) return;
    console.log('userId khi xóa:', userId, 'productId:', productId);
    try {
      await axios.post('http://localhost:8080/api/cart/update', {
        userId, // KHÔNG ép kiểu số
        productId, // truyền nguyên string UUID
        quantity: -1
      });
      // Lấy lại cart mới
      const res = await axios.get(`http://localhost:8080/api/cart?userId=${userId}`);
      if (res.data.success) setCart(res.data.data.items || []);
    } catch (e) {
      console.error('Lỗi khi cập nhật giỏ hàng:', e);
      alert('Có lỗi khi cập nhật giỏ hàng!');
    }
  };

  // Xử lý khi bấm Thanh toán/Đặt Hàng
  const handleCheckout = async () => {
    setShowCartModal(false);
    setTimeout(async () => {
      if (paymentMethod === 'cod') {
        try {
          const orderData = {
            products: cart.map(item => {
              const prod = products.find(p => p.id === item.productId);
              return prod ? ({ name: prod.name, quantity: item.quantity, price: parsePrice(prod.price) }) : null;
            }).filter(Boolean),
            shippingFee: SHIPPING_FEE,
            total: totalWithShipping,
            phone
          };
          await fetch('http://localhost:8080/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
          });
          // Xóa cart trên backend
          await axios.post(`http://localhost:8080/api/cart/clear?userId=${userId}`);
          setCart([]);
          setShowSuccess(true);
        } catch {
          alert('Có lỗi khi gửi đơn hàng!');
        }
      } else {
        setShowQrPopup(true);
      }
    }, 200);
  };

  // Xử lý xác nhận thanh toán thành công
  const handleQrConfirm = async () => {
    try {
      const orderData = {
        products: cart.map(item => {
          const prod = products.find(p => p.id === item.productId);
          return prod ? ({ name: prod.name, quantity: item.quantity, price: parsePrice(prod.price) }) : null;
        }).filter(Boolean),
        shippingFee: SHIPPING_FEE,
        total: totalWithShipping,
        phone
      };
      await fetch('http://localhost:8080/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      // Xóa cart trên backend
      await axios.post(`http://localhost:8080/api/cart/clear?userId=${userId}`);
      setCart([]);
      setShowQrPopup(false);
      setUploadedFile(null);
      setTimeout(() => {
        setShowSuccess(true);
      }, 200);
    } catch {
      alert('Có lỗi khi gửi đơn hàng!');
    }
  };

  // Giao diện sản phẩm với nút +/- (chỉ hiển thị trên từng sản phẩm, không có box hóa đơn nổi sẵn)
  const renderProductGrid = () => (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: 32,
      justifyItems: 'center',
      alignItems: 'start',
      padding: '0 24px'
    }}>
      {products.map((p) => (
        <div key={p.id || p.name} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: 16, width: 200, textAlign: 'center', position: 'relative' }}>
          <Product
            image={p.image}
            name={p.name}
            price={p.price}
            hideAddToCart
            renderQuantityControls={() => (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 12 }}>
                <button
                  onClick={() => handleRemoveFromCart(p.id)}
                  style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid #1976d2', background: '#fff', color: '#1976d2', fontSize: 20, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  disabled={getCartQty(p.id) === 0 || loadingCart || !userId}
                >-</button>
                <span style={{ minWidth: 24, fontWeight: 600, fontSize: 18 }}>{getCartQty(p.id)}</span>
                <button
                  onClick={() => handleAddToCart(p.id)}
                  style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid #1976d2', background: '#1976d2', color: '#fff', fontSize: 20, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  disabled={loadingCart || !userId}
                >+</button>
              </div>
            )}
          />
        </div>
      ))}
    </div>
  );

  // Xử lý upload file QR (nếu có)
  const handleUpload = (file) => {
    setUploadedFile(file);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <Navbar />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 0 0 0' }}>
        <h1 style={{ textAlign: 'center', fontWeight: 'bold', letterSpacing: 2, fontSize: 36, margin: '24px 0 32px 0' }}>
          PHỤ KIỆN CẦU LÔNG
        </h1>
        {renderProductGrid()}
      </div>
      {/* Nút mở hóa đơn (góc phải dưới) dạng icon với badge đỏ */}
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
          zIndex: 1000,
          border: 'none',
          cursor: totalInCart === 0 ? 'not-allowed' : 'pointer',
          opacity: totalInCart === 0 ? 0.6 : 1
        }}
        disabled={totalInCart === 0}
        title="Xem hóa đơn"
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
      {/* Popup xác nhận giỏ hàng/hóa đơn */}
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
              {cart.length === 0 || cart.every(item => item.quantity === 0) ? (
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
                    {cart.map(item => {
                      if (!item.quantity) return null;
                      const prod = products.find(p => p.id === item.productId);
                      if (!prod) return null;
                      return (
                        <tr key={prod.id}>
                          <td style={{ padding: 4 }}>{prod.name}</td>
                          <td style={{ textAlign: 'center', padding: 4 }}>{item.quantity}</td>
                          <td style={{ textAlign: 'right', padding: 4 }}>{prod.price}VND</td>
                          <td style={{ textAlign: 'right', padding: 4 }}>{(parsePrice(prod.price) * item.quantity).toLocaleString()}VND</td>
                          <td style={{ textAlign: 'center', padding: 4 }}>
                            <button
                              onClick={() => handleRemoveFromCart(prod.id)}
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
                      );
                    })}
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
              { !cart.every(item => item.quantity === 0) && (
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
