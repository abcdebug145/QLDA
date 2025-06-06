import React from "react";

const variantStyle = {
  empty: {
    background: "#fff",
    border: "1px solid #eee",
    cursor: "pointer"
  },
  selected: {
    background: "#1abc60",
    border: "1px solid #1abc60",
    cursor: "pointer"
  },
  booked: {
    background: "#bdbdbd",
    border: "1px solid #bdbdbd",
    cursor: "not-allowed"
  }
};

const TimelineCell = ({ variant = "empty", onClick, isLastCol, isLastRow }) => {
  const style = {
    width: 48,
    height: 48,
    background: variantStyle[variant].background,
    cursor: variantStyle[variant].cursor,
    borderRight: isLastCol ? "none" : "1px solid #eee",
    borderBottom: isLastRow ? "none" : "1px solid #eee",
    transition: "background 0.2s, border 0.2s"
  };
  if (variant === "selected") {
    style.background = "#1abc60";
    style.borderRight = isLastCol ? "none" : "1px solid #1abc60";
    style.borderBottom = isLastRow ? "none" : "1px solid #1abc60";
  }
  if (variant === "booked") {
    style.background = "#bdbdbd";
    style.borderRight = isLastCol ? "none" : "1px solid #bdbdbd";
    style.borderBottom = isLastRow ? "none" : "1px solid #bdbdbd";
  }
  return (
    <div
      style={style}
      onClick={variant !== "booked" ? onClick : undefined}
    />
  );
};

export default TimelineCell; 