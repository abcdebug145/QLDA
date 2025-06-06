import React from "react";

const Product = ({ image, name, price, onAddToCart, isAdmin = false }) => {
  return (
    <div style={{ width: 200, background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ border: '1.5px solid #ddd', borderRadius: 12, width: 200, height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', padding: 12,}}>
        <img 
          src={image} 
          alt={name} 
          style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 8, display: 'block' }} 
          onError={e => { e.target.style.display = 'none'; e.target.parentNode.innerHTML += `<span style=\"position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#222;font-size:17px;font-family:inherit;\">${name}</span>`; }}
        />
      </div>
      <div style={{
        color: '#5a4fff',
        fontWeight: 500,
        fontSize: 15,
        fontFamily: 'inherit',
        width: 200,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        margin: '12px 0 2px 0'
      }}>{name}</div>
      <div style={{
        color: '#222',
        fontSize: 14,
        fontFamily: 'inherit',
        width: 200,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        marginBottom: 8
      }}>{price}VND</div>
      {!isAdmin ? (
        <button onClick={onAddToCart} style={{
          background: '#4e6cf4',
          color: '#fff', 
          border: 'none',
          borderRadius: 8,
          padding: '8px 18px',
          fontSize: 15,
          fontWeight: 500,
          cursor: 'pointer',
          marginBottom: 8,
          marginTop: 4,
          transition: 'background 0.2s',
          width: '65%',
          alignSelf: 'center',
          display: 'block'
        }}>Thêm vào giỏ</button>
      ) : (
        <div style={{
          background: '#f5f5f5',
          color: '#666',
          borderRadius: 8,
          padding: '8px 18px',
          fontSize: 15,
          fontWeight: 500,
          marginBottom: 8,
          marginTop: 4,
          width: '65%',
          alignSelf: 'center',
          textAlign: 'center'
        }}>
          Tồn kho: 10
        </div>
      )}
    </div>
  );
};

export default Product;
