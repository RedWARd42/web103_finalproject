// import React from "react";
// import "./ItemCard.css";

// const ItemCard = ({ item }) => {
//   return (
//     <div className="item-card">
//       {/* <div className="image-placeholder">
//         {item.image_url ? (
//           <img
//             src={item.image_url}
//             alt={item.title}
//             className="item-image"
//           />
//         ) : (
//           "[ IMAGE ]"
//         )}
//       </div> */}
//     <div className="image-placeholder">
//         {item.image_url ? (
//             <img src={item.image_url} alt={item.title} />
//         ) : (
//             "[ IMAGE ]"
//         )}
//     </div>


//       <div className="item-info">
//         <h3>{item.title}</h3>
//         <p>{item.location}</p>
//       </div>

//       <div className="card-actions">
//         <button>Request</button>
//         <button>Details</button>
//       </div>
//     </div>
//   );
// };

// export default ItemCard;

import React, { useEffect, useState } from "react";
import "./ItemCard.css";

const ItemCard = ({ item }) => {
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

        {/* ⭐ Display the fetched username */}
        <p className="owner-name">@{ownerName}</p>

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
