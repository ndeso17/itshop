import React from "react";
import "./Skeleton.css";

const Skeleton = ({ type = "text", width, height, className = "" }) => {
  const style = {
    width: width || "100%",
    height: height || (type === "title" ? "32px" : "16px"),
  };

  return <div className={`skeleton skeleton-${type} ${className}`} style={style} />;
};

export default Skeleton;
