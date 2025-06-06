import React from "react";

const Service = ({ image, title, onClick }) => {
  return (
    <div
      style={{
        width: 300,
        textAlign: "center",
        margin: "0 16px",
        cursor: "pointer",
        transition: "transform 0.2s, box-shadow 0.2s",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}
      className="service-card"
      onClick={onClick}
    >
      <img
        src={image}
        alt={title}
        style={{
          width: 300,
          height: 350,
          objectFit: "cover",
          borderRadius: 16,
          display: "block"
        }}
      />
      <div
        style={{
          padding: "10px 0 0 0",
          fontWeight: "bold",
          fontSize: 22
        }}
      >
        {title}
      </div>
      <style>{`
        .service-card:hover {
          transform: scale(1.04);
        }
      `}</style>
    </div>
  );
};

export default Service;
