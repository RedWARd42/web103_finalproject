import React from "react";
import "./ItemCard.css";

const ItemCard = ({ item }) => {
  return (
    <div className="item-card">
      {/* <div className="image-placeholder">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.title}
            className="item-image"
          />
        ) : (
          "[ IMAGE ]"
        )}
      </div> */}
    <div className="image-placeholder">
        {item.image_url ? (
            <img src={item.image_url} alt={item.title} />
        ) : (
            "[ IMAGE ]"
        )}
    </div>


      <div className="item-info">
        <h3>{item.title}</h3>
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
