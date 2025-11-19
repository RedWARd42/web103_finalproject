import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FollowButton from "./FollowButton";
import "./ItemCard.css";
import ItemDetails from "../pages/ItemDetails";
import { useNavigate } from "react-router-dom";

const ItemCard = ({ item, onFollowChange, refresh }) => {
  const [ownerName, setOwnerName] = useState("Loading...");

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const res = await fetch(`/api/users/${item.user_id}`);
        const data = await res.json();
        setOwnerName(data.username || "Unknown");
      } catch (error) {
        console.error("Error fetching user:", error);
        setOwnerName("Unknown");
      }
    };

    fetchUsername();
  }, [item.user_id]);
  const navigate = useNavigate();
  return (
    <div className="item-card">
      <div className="image-placeholder">
        {item.image_url ? (
          <img src={item.image_url} alt={item.title} />
        ) : (
          "[ IMAGE ]"
        )}
      </div>

      <div className="item-info">
        <h3>{item.title}</h3>

        {/*  Display the fetched username with follow button */}
        <div className="owner-info">
          <span className="owner-name">Owner: @{ownerName}</span>
          <FollowButton
            userId={item.user_id}
            currentUserId={1}
            onChange={onFollowChange}
            refresh={refresh}
          />
          {/* Using hardcoded current user ID for MVP */}
        </div>

        <p>{item.location}</p>
      </div>

      <div className="card-actions">
        <Link to={`/request/new/${item.id}`} className="request-btn">Request</Link>
        <button>Details</button><button onClick={() => navigate(`/items/${item.id}`)} >Details</button>
      </div>
    </div>
  );
};

export default ItemCard;
