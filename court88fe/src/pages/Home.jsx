import React from "react";
import Navbar from "../components/layout/Navbar";
import Service from "../components/ui/Service";
import { useNavigate } from "react-router-dom";

const customerServices = [
  {
    image: "/bmt-court.jpg",
    title: "Đặt sân cầu lông"
  },
  {
    image: "/bmt-accessories.jpg",
    title: "Phụ kiện cầu lông"
  },
  {
    image: "/payment.png",
    title: "Lịch sử giao dịch"
  }
];

const ownerServices = [
  {
    image: "/management.jpg",
    title: "Quản trị hệ thống"
  },
  {
    image: "/duyetdon.jpg",
    title: "Duyệt đơn"
  }
];

const staffServices = [
  {
    image: "/shift.png",
    title: "Đăng ký ca làm việc"
  },
  {
    image: "/duyetdon.jpg",
    title: "Duyệt đơn"
  },
  {
    image: "/chamcong.jpg",
    title: "Chấm công"
  }
];

const Home = () => {
  const navigate = useNavigate();
  const userStr = localStorage.getItem('user');
  let role = null;
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      role = user.data?.role;
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
  }

  const services =
    role === "OWNER"
      ? ownerServices
      : role === "STAFF"
      ? staffServices
      : customerServices;

  return (
    <div style={{ margin: 0, padding: 0 }}>
      <Navbar />
      <div style={{ maxWidth: 1100, margin: "32px auto 0 auto", padding: "0 24px" }}>
        <h2 style={{ fontWeight: "bold", marginBottom: 0 }}>DỊCH VỤ</h2>
        <div style={{
          width: 80,
          height: 2,
          background: "#222",
          margin: "8px 0 32px 0"
        }} />
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: 32
        }}>
          {services.map((s, idx) => (
            <Service
              key={idx}
              image={s.image}
              title={s.title}
              onClick={() => {
                switch(s.title) {
                  case "Đặt sân cầu lông":
                    navigate("/booking");
                    break;
                  case "Phụ kiện cầu lông":
                    navigate("/accessories");
                    break;
                  case "Lịch sử giao dịch":
                    navigate("/order");
                    break;
                  case "Quản trị hệ thống":
                    navigate("/management");
                    break;
                  case "Duyệt đơn":
                    navigate("/approve-order");
                    break;
                  case "Đăng ký ca làm việc":
                    navigate("/shift");
                    break;
                  case "Chấm công":
                    navigate("/timekeeping");
                    break;
                  default:
                    break;
                }
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
