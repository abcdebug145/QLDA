/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import Product from "../components/ui/Product";
import RevenueChart from "../components/ui/RevenueChart";
import axios from 'axios';

const roleColor = {
  "OWNER": { bg: "#ffeaea", color: "#d33" },
  "MANAGER": { bg: "#fff9d6", color: "#b89c00" },
  "STAFF": { bg: "#eaffef", color: "#1abc60" },
  "CUSTOMER": { bg: "#eaf3ff", color: "#1976d2" }
};

const getRoleVN = (role) => {
  switch (role) {
    case "OWNER": return "Chủ";
    case "STAFF": return "Nhân viên";
    case "CUSTOMER": return "Khách hàng";
    default: return role;
  }
};

const Management = () => {
  const [selected, setSelected] = useState("home");
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedRole, setSelectedRole] = useState("ALL");
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    phone: '',
    address: '',
    role: 'STAFF'
  });
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '' });
  const [newProductImage, setNewProductImage] = useState(null);
  const [productLoading, setProductLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/users");
        const response = await res.json();
        if (response.success && response.data) {
          setEmployees(response.data);
          setFilteredEmployees(response.data);
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  useEffect(() => {
    if (selectedRole === "ALL") {
      setFilteredEmployees(employees);
    } else {
      const filtered = employees.filter(emp => emp.role === selectedRole);
      setFilteredEmployees(filtered);
    }
  }, [selectedRole, employees]);

  // Lấy danh sách sản phẩm từ backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/products');
        if (res.data.success) setProducts(res.data.data);
      } catch (err) {
        setProducts([]);
      }
    };
    fetchProducts();
  }, []);

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    console.log('Submit newEmployee:', newEmployee);
    try {
      if (editingEmployee) {
        // Đang edit: PUT /api/users/{phone}
        const res = await fetch(`http://localhost:8080/api/users/${editingEmployee.phone}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newEmployee)
        });
        const response = await res.json();
        if (response.success) {
          const updatedRes = await fetch("http://localhost:8080/api/users");
          const updatedData = await updatedRes.json();
          if (updatedData.success) {
            setEmployees(updatedData.data);
          }
          setNewEmployee({ name: '', phone: '', address: '', role: 'STAFF' });
          setShowAddForm(false);
          setEditingEmployee(null);
        }
      } else {
        // Thêm mới: POST /api/users/register
        const res = await fetch("http://localhost:8080/api/users/register", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newEmployee)
        });
        const response = await res.json();
        if (response.success) {
          const updatedRes = await fetch("http://localhost:8080/api/users");
          const updatedData = await updatedRes.json();
          if (updatedData.success) {
            setEmployees(updatedData.data);
          }
          setNewEmployee({ name: '', phone: '', address: '', role: 'STAFF' });
          setShowAddForm(false);
        }
      }
    } catch (error) {
      console.error("Error adding/updating employee:", error);
    }
  };

  const handleDeleteEmployee = async (phone) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) return;
    try {
      const res = await fetch(`http://localhost:8080/api/users/${phone}`, {
        method: 'DELETE'
      });
      const response = await res.json();
      if (response.success) {
        // Reload lại danh sách
        const updatedRes = await fetch("http://localhost:8080/api/users");
        const updatedData = await updatedRes.json();
        if (updatedData.success) {
          setEmployees(updatedData.data);
        }
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  // Thêm sản phẩm
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setProductLoading(true);
    try {
      const formData = new FormData();
      formData.append('product', JSON.stringify({
        name: newProduct.name,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock)
      }));
      if (newProductImage) {
        formData.append('image', newProductImage);
      }
      const addRes = await axios.post('http://localhost:8080/api/products', formData);
      console.log('Add product response:', addRes.data);
      setShowAddProduct(false);
      setNewProduct({ name: '', price: '', stock: '' });
      setNewProductImage(null);

      // Hàm chờ ảnh load thành công
      const waitForImage = (src, timeout = 2000, interval = 150) => {
        return new Promise((resolve, reject) => {
          const start = Date.now();
          function check() {
            const img = new window.Image();
            img.onload = () => resolve(true);
            img.onerror = () => {
              if (Date.now() - start > timeout) reject(new Error('Timeout'));
              else setTimeout(check, interval);
            };
            img.src = src + (src.includes('?') ? '&' : '?') + 'v=' + Date.now();
          }
          check();
        });
      };

      // Sau khi thêm, lấy lại danh sách và poll ảnh mới nhất
      const reloadProducts = async () => {
        const res = await axios.get('http://localhost:8080/api/products');
        if (res.data.success) {
          // Nếu có sản phẩm mới, poll ảnh trước khi setProducts
          if (res.data.data.length > 0) {
            const last = res.data.data[res.data.data.length - 1];
            const imgSrc = last.image ? last.image + (last.image.includes('?') ? '&' : '?') + 'v=' + Date.now() : null;
            if (imgSrc) {
              try {
                await waitForImage(imgSrc);
                setProducts(res.data.data);
                console.log('Products after add:', res.data.data);
                console.log('Image src of last product:', last.image);
              } catch {
                // Nếu timeout vẫn setProducts để tránh treo UI
                setProducts(res.data.data);
                console.log('Timeout wait image, still update products.');
              }
            } else {
              setProducts(res.data.data);
            }
          } else {
            setProducts(res.data.data);
          }
        }
      };
      await reloadProducts();
    } catch (err) {
      alert('Có lỗi khi thêm sản phẩm!');
    } finally {
      setProductLoading(false);
    }
  };

  // Xóa sản phẩm
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;
    try {
      await axios.delete(`http://localhost:8080/api/products/${id}`);
      const res = await axios.get('http://localhost:8080/api/products');
      if (res.data.success) setProducts(res.data.data);
    } catch {
      alert('Xóa thất bại!');
    }
  };

  // Sửa sản phẩm
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowAddProduct(true);
    setNewProduct({ name: product.name, price: product.price, stock: product.stock });
    setNewProductImage(null);
  };

  // Cập nhật sản phẩm
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setProductLoading(true);
    try {
      const formData = new FormData();
      formData.append('product', JSON.stringify({
        name: newProduct.name,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock)
      }));
      if (newProductImage) {
        formData.append('image', newProductImage);
      }
      await axios.put(`http://localhost:8080/api/products/${editingProduct.id}`, formData);
      setShowAddProduct(false);
      setEditingProduct(null);
      setNewProduct({ name: '', price: '', stock: '' });
      setNewProductImage(null);
      const res = await axios.get('http://localhost:8080/api/products');
      if (res.data.success) setProducts(res.data.data);
    } catch {
      alert('Cập nhật thất bại!');
    } finally {
      setProductLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar selected={selected} onSelect={setSelected} />
        <div style={{ flex: 1, background: "#fff", padding: "32px 0 0 0" }}>
          {selected === "home" && (
            <div style={{
              maxWidth: 900,
              margin: "0 auto",
              marginTop: 20,
              background: "linear-gradient(90deg, #eaffd0 0%, #d0f0ff 100%)",
              borderRadius: 24,
              boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
              padding: "48px 32px 48px 32px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <img src="/admin-svgrepo-com.svg" alt="Admin" style={{ width: 120, marginBottom: 24 }} />
              <h1 style={{ fontSize: 38, fontWeight: 800, color: "#4e6cf4", marginBottom: 12, letterSpacing: 1 }}>Quản lý hệ thống</h1>
              <div style={{ fontSize: 20, color: "#333", marginBottom: 18, textAlign: "center", maxWidth: 600 }}>
                Xin chào <b>Admin</b>! Đây là trang quản trị dành riêng cho bạn.<br/>
                Bạn có thể quản lý nhân viên, kho hàng, doanh thu, và nhiều chức năng khác một cách dễ dàng, trực quan.
              </div>
              <div style={{ display: 'flex', gap: 32, marginTop: 16 }}>
                <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: 24, minWidth: 180, textAlign: 'center' }}>
                  <div style={{ fontSize: 32, color: '#4CAF50', marginBottom: 8 }}>👥</div>
                  <div style={{ fontWeight: 600, fontSize: 18 }}>Nhân viên</div>
                  <div style={{ color: '#888', fontSize: 15 }}>Quản lý, phân quyền</div>
                </div>
                <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: 24, minWidth: 180, textAlign: 'center' }}>
                  <div style={{ fontSize: 32, color: '#1976d2', marginBottom: 8 }}>🏚️</div>
                  <div style={{ fontWeight: 600, fontSize: 18 }}>Kho hàng</div>
                  <div style={{ color: '#888', fontSize: 15 }}>Kiểm soát tồn kho</div>
                </div>
                <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: 24, minWidth: 180, textAlign: 'center' }}>
                  <div style={{ fontSize: 32, color: '#ff4444', marginBottom: 8 }}>📈</div>
                  <div style={{ fontWeight: 600, fontSize: 18 }}>Doanh thu</div>
                  <div style={{ color: '#888', fontSize: 15 }}>Thống kê, báo cáo</div>
                </div>
              </div>
            </div>
          )}
          {selected === "staff" && (
            <div style={{ maxWidth: 900, margin: "0 auto", position: "relative" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <label style={{ fontWeight: 500 }}>Lọc theo vai trò:</label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 8,
                      border: '1px solid #ddd',
                      fontSize: 16,
                      cursor: 'pointer'
                    }}
                  >
                    <option value="ALL">Tất cả</option>
                    <option value="OWNER">Chủ</option>
                    <option value="STAFF">Nhân viên</option>
                    <option value="CUSTOMER">Khách hàng</option>
                  </select>
                </div>
                <div>
                  <span
                    style={{
                      fontSize: 36,
                      color: "#222",
                      cursor: "pointer",
                      userSelect: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                    title="Thêm nhân viên"
                  >
                    <span 
                      className="btn-add" 
                      style={{ 
                        display: "inline-block", 
                        cursor: "pointer", 
                        marginRight: 35,
                        transition: 'transform 0.2s',
                        transform: showAddForm && !editingEmployee ? 'rotate(45deg)' : 'none'
                      }}
                      onClick={() => {
                        if (showAddForm) {
                          setShowAddForm(false);
                          setEditingEmployee(null);
                          setNewEmployee({ name: '', phone: '', address: '', role: 'STAFF' });
                        } else {
                          setShowAddForm(true);
                          setEditingEmployee(null);
                          setNewEmployee({ name: '', phone: '', address: '', role: 'STAFF' });
                        }
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" className="bi bi-person-plus-fill" viewBox="0 0 16 16">
                        <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                        <path fillRule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5"/>
                      </svg>
                    </span>
                  </span>
                </div>
              </div>
              {loading ? (
                <div style={{ textAlign: 'center', color: '#888', fontSize: 18, marginTop: 24 }}>Đang tải...</div>
              ) : (
                <>
                  <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 24, background: "#fff" }}>
                    <thead>
                      <tr style={{ borderBottom: "2px solid #222", color: "#888", fontWeight: 500 }}>
                        <th style={{ textAlign: "left", padding: 8, fontWeight: 500 }}>ID</th>
                        <th style={{ textAlign: "left", padding: 8, fontWeight: 500 }}>Họ và tên</th>
                        <th style={{ textAlign: "left", padding: 8, fontWeight: 500 }}>Số điện thoại</th>
                        <th style={{ textAlign: "left", padding: 8, fontWeight: 500 }}>Địa chỉ</th>
                        <th style={{ textAlign: "left", padding: 8, fontWeight: 500 }}>Vai trò</th>
                        <th style={{ textAlign: "center", padding: 8, fontWeight: 500 }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEmployees.map((emp) => (
                        <tr key={emp.id} style={{ borderBottom: "1px solid #eee", height: 56 }}>
                          <td style={{ fontWeight: 700, padding: 8 }}>{emp.id.substring(0, 8)}...</td>
                          <td style={{ padding: 8 }}>{emp.name}</td>
                          <td style={{ padding: 8 }}>{emp.phone}</td>
                          <td style={{ padding: 8 }}>{emp.address}</td>
                          <td style={{ padding: 8 }}>
                            <span
                              style={{
                                background: roleColor[emp.role]?.bg || '#eee',
                                color: roleColor[emp.role]?.color || '#888',
                                borderRadius: 6,
                                padding: "4px 16px",
                                fontWeight: 600,
                                fontSize: 15,
                              }}
                            >
                              {getRoleVN(emp.role)}
                            </span>
                          </td>
                          <td style={{ textAlign: "center", padding: 8 }}>
                            <span style={{ fontSize: 20, cursor: "pointer", paddingRight: 10 }}
                              onClick={() => {
                                setShowAddForm(true);
                                setEditingEmployee(emp);
                                setNewEmployee({
                                  name: emp.name,
                                  phone: emp.phone,
                                  address: emp.address,
                                  role: 'STAFF'
                                });
                                console.log('Edit emp:', emp);
                              }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="orange" className="bi bi-pencil" viewBox="0 0 16 16">
                                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                              </svg>
                            </span>
                            <span style={{ fontSize: 20, cursor: "pointer", paddingLeft: 10 }}
                              onClick={() => handleDeleteEmployee(emp.phone)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" className="bi bi-trash" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                              </svg>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {showAddForm && (
                    <div style={{
                      marginTop: 24,
                      padding: 24,
                      background: '#fff',
                      borderRadius: 12,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                    }}>
                      <h2 style={{ marginBottom: 24, fontSize: 24, fontWeight: 600 }}>Thêm nhân viên mới</h2>
                      <form onSubmit={handleAddEmployee}>
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: 24,
                          marginBottom: 24
                        }}>
                          <div>
                            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Họ và tên</label>
                            <input
                              type="text"
                              value={newEmployee.name}
                              onChange={(e) => setNewEmployee(prev => ({ ...prev, name: e.target.value }))}
                              style={{
                                width: '85%',
                                padding: '12px',
                                borderRadius: 8,
                                border: '1px solid #ddd',
                                fontSize: 16
                              }}
                              required
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Số điện thoại</label>
                            <input
                              type="tel"
                              value={newEmployee.phone}
                              onChange={(e) => setNewEmployee(prev => ({ ...prev, phone: e.target.value }))}
                              style={{
                                width: '85%',
                                padding: '12px',
                                borderRadius: 8,
                                border: '1px solid #ddd',
                                fontSize: 16
                              }}
                              required
                              disabled={!!editingEmployee}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Địa chỉ</label>
                            <input
                              type="text"
                              value={newEmployee.address}
                              onChange={(e) => setNewEmployee(prev => ({ ...prev, address: e.target.value }))}
                              style={{
                                width: '85%',
                                padding: '12px',
                                borderRadius: 8,
                                border: '1px solid #ddd',
                                fontSize: 16
                              }}
                              required
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Vai trò</label>
                            <select
                              value={newEmployee.role}
                              onChange={(e) => setNewEmployee(prev => ({ ...prev, role: e.target.value }))}
                              style={{
                                width: '91%',
                                padding: '12px',
                                borderRadius: 8,
                                border: '1px solid #ddd',
                                fontSize: 16
                              }}
                              required
                            >
                              <option value="OWNER">Chủ</option>
                              <option value="CUSTOMER">Khách hàng</option>
                              <option value="STAFF">Nhân viên</option>
                            </select>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                          <button
                            type="button"
                            onClick={() => {
                              setShowAddForm(false);
                              setEditingEmployee(null);
                            }}
                            style={{
                              padding: '12px 24px',
                              borderRadius: 8,
                              border: '1px solid #ddd',
                              background: '#fff',
                              fontSize: 16,
                              cursor: 'pointer'
                            }}
                          >
                            Hủy
                          </button>
                          <button
                            type="submit"
                            style={{
                              padding: '12px 24px',
                              borderRadius: 8,
                              border: 'none',
                              background: '#1976d2',
                              color: '#fff',
                              fontSize: 16,
                              cursor: 'pointer'
                            }}
                          >
                            Thêm nhân viên
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
          {selected === "warehouse" && (
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative' }}>
              <h1 style={{ textAlign: 'center', fontWeight: 'bold', letterSpacing: 2, fontSize: 36, margin: '24px 0 32px 0' }}>
                KHO HÀNG
              </h1>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: 32,
                justifyItems: 'center',
                alignItems: 'start',
                padding: '0 24px'
              }}>
                {products.map((p) => (
                  <div key={p.id} style={{ position: 'relative' }}>
                    <Product
                      image={p.image}
                      name={p.name}
                      price={p.price}
                      isAdmin={true}
                      stock={p.stock}
                      onChangeStock={async (newStock) => {
                        if (newStock < 0) return;
                        if (newStock === 0) {
                          await handleDeleteProduct(p.id);
                        } else {
                          try {
                            const formData = new FormData();
                            formData.append('product', JSON.stringify({
                              name: p.name,
                              price: p.price,
                              stock: newStock,
                              image: p.image
                            }));
                            await axios.put(`http://localhost:8080/api/products/${p.id}`, formData, {
                              headers: { 'Content-Type': 'multipart/form-data' }
                            });
                            const res = await axios.get('http://localhost:8080/api/products');
                            if (res.data.success) setProducts(res.data.data);
                          } catch {
                            alert('Cập nhật tồn kho thất bại!');
                          }
                        }
                      }}
                      onDelete={async () => {
                        await handleDeleteProduct(p.id);
                      }}
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={() => { setShowAddProduct(true); setEditingProduct(null); setNewProduct({ name: '', price: '', stock: '' }); setNewProductImage(null); }}
                style={{
                  position: 'fixed',
                  bottom: 32,
                  right: 32,
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  background: '#1976d2',
                  color: '#fff',
                  fontSize: 36,
                  border: 'none',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                  cursor: 'pointer',
                  zIndex: 1000
                }}
                title="Thêm sản phẩm mới"
              >
                +
              </button>
              {showAddProduct && (
                <div style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: '100vw',
                  height: '100vh',
                  background: 'rgba(0,0,0,0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2000
                }}>
                  <div style={{ background: '#fff', borderRadius: 16, padding: 32, minWidth: 350, boxShadow: '0 2px 16px rgba(0,0,0,0.12)' }}>
                    <h2 style={{ marginBottom: 24, fontWeight: 700, fontSize: 22 }}>{editingProduct ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}</h2>
                    <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}>
                      <div style={{ marginBottom: 16 }}>
                        <label style={{ fontWeight: 500 }}>Tên sản phẩm</label>
                        <input
                          type="text"
                          value={newProduct.name}
                          onChange={e => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                          required
                          style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ddd', fontSize: 16 }}
                        />
                      </div>
                      <div style={{ marginBottom: 16 }}>
                        <label style={{ fontWeight: 500 }}>Giá (VND)</label>
                        <input
                          type="number"
                          value={newProduct.price}
                          onChange={e => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                          required
                          min={0}
                          style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ddd', fontSize: 16 }}
                        />
                      </div>
                      <div style={{ marginBottom: 16 }}>
                        <label style={{ fontWeight: 500 }}>Số lượng nhập</label>
                        <input
                          type="number"
                          value={newProduct.stock}
                          onChange={e => setNewProduct(prev => ({ ...prev, stock: e.target.value }))}
                          required
                          min={0}
                          style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ddd', fontSize: 16 }}
                        />
                      </div>
                      <div style={{ marginBottom: 16 }}>
                        <label style={{ fontWeight: 500 }}>Ảnh sản phẩm</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => setNewProductImage(e.target.files[0])}
                          style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ddd', fontSize: 16 }}
                        />
                      </div>
                      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
                        <button
                          type="button"
                          onClick={() => { setShowAddProduct(false); setEditingProduct(null); }}
                          style={{ padding: '10px 20px', borderRadius: 8, border: '1px solid #ddd', background: '#fff', fontSize: 16, cursor: 'pointer' }}
                          disabled={productLoading}
                        >
                          Hủy
                        </button>
                        <button
                          type="submit"
                          style={{ padding: '10px 20px', borderRadius: 8, border: 'none', background: '#1976d2', color: '#fff', fontSize: 16, cursor: 'pointer' }}
                          disabled={productLoading}
                        >
                          {productLoading ? 'Đang lưu...' : (editingProduct ? 'Cập nhật' : 'Thêm sản phẩm')}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}
          {selected === "revenue" && (
            <div style={{ maxWidth: 900, margin: "0 auto", marginTop: 32 }}>
              <RevenueChart />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Management;
