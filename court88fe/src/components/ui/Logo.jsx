import React from "react";
import { useNavigate } from "react-router-dom";

const Logo = () => {
  const navigate = useNavigate();
  
  return (
    <div 
      style={{ display: "flex", alignItems: "center", marginLeft: 24, cursor: "pointer" }}
      onClick={() => navigate("/")}
    >
      <img src="/badminton-svgrepo-com.svg" alt="Logo" style={{ height: 32, marginRight: 8 }} />
      <span style={{ color: "#fff", fontWeight: 600, fontSize: 24, fontFamily: "Inter", marginLeft: 10 }}>
        Court
        <span style={{ fontStyle: "italic", fontWeight: 100 }}>Seeker</span>
        <span style={{ color: "#FF6666", fontWeight: 700 }}>88</span>
      </span>
    </div>
  );
};

export default Logo;
