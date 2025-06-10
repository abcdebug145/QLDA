import React from "react";

const getProductImageSrc = (image) => {
  if (!image) return '';
  // Nếu là ảnh public (bắt đầu bằng /), giữ nguyên
  if (image.startsWith('/')) return image;
  // Nếu đã có /api/uploads hoặc /uploads ở đầu, thêm host
  if (image.startsWith('uploads/')) return `http://localhost:8080/api/${image}`;
  if (image.startsWith('api/uploads/')) return `http://localhost:8080/${image}`;
  // Nếu là tên file, gắn đúng prefix
  return `http://localhost:8080/api/uploads/${image}`;
};

const formatPrice = (price) => {
  if (!price && price !== 0) return '';
  return price.toLocaleString('vi-VN') + ' VND';
};

const Product = ({ image, name, price, isAdmin = false, stock, onChangeStock, onDelete, renderQuantityControls }) => {
  // Thêm query string random nếu là ảnh vừa upload (tránh cache)
  const [imgSrc, setImgSrc] = React.useState('');
  React.useEffect(() => {
    if (!image) return setImgSrc('');
    const src = getProductImageSrc(image) + (image && image !== '' ? `?v=${Date.now()}` : '');
    setImgSrc(src);
    console.log('Product render:', name, 'image:', image, 'imgSrc:', src);
  }, [image]);
  return (
    <div style={{ width: 200, background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ border: '1.5px solid #ddd', borderRadius: 12, width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', padding: 12,}}>
        <a href={image ? getProductImageSrc(image) : undefined} target="_blank" rel="noopener noreferrer">
          {imgSrc ? (
            <img 
              src={imgSrc}
              alt={name} 
              style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 8, display: 'block' }} 
              onError={e => { e.target.style.display = 'none'; e.target.parentNode.innerHTML += `<span style=\"position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#222;font-size:17px;font-family:inherit;\">${name}</span>`; }}
            />
          ) : null}
        </a>
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
      }}>{formatPrice(price)}</div>
      {/* Nếu có renderQuantityControls thì dùng, ngược lại hiển thị mặc định (admin stock) */}
      {renderQuantityControls ? renderQuantityControls() : (
        isAdmin ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 8,
            marginTop: 8,
            marginBottom: 8
          }}>
            <button
              style={{
                background: '#fff', border: '1.5px solid #888', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', fontWeight: 700, fontSize: 18, color: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0
              }}
              onClick={() => {
                if (onChangeStock) onChangeStock(stock - 1);
                if (stock - 1 === 0 && onDelete) onDelete();
              }}
              disabled={stock <= 0}
            >
              <span style={{fontSize: 20, lineHeight: 1}}>−</span>
            </button>
            <span style={{ minWidth: 24, display: 'inline-block', textAlign: 'center', fontWeight: 500 }}>{stock}</span>
            <button
              style={{
                background: '#fff', border: '1.5px solid #888', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', fontWeight: 700, fontSize: 18, color: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0
              }}
              onClick={() => onChangeStock && onChangeStock(stock + 1)}
            >
              <span style={{fontSize: 20, lineHeight: 1}}>＋</span>
            </button>
          </div>
        ) : null
      )}
      {isAdmin ? null : null}
    </div>
  );
};

export default Product;
