import React from "react";
import "./ItemCard.css";

const ItemCard = ({ item }) => {
  return (
    <div className="item-card">
      <div className="image-placeholder">[ IMAGE ]</div>

      <div className="item-info">
        <h3>{item.title}</h3>
        <p>How many: {item.quantity || 1}</p>
        <p>{item.location}</p>
      </div>

      <div className="card-actions">
        <button>Request</button>
        <button>Details</button>
      </div>
    </div>
  );
};

export default ItemCard;
