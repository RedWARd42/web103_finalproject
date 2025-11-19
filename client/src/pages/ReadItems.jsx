import React, { useEffect, useState } from "react";
import ItemCard from "../components/ItemCard";
import "./ReadItems.css"; 

const ReadItems = () => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch(`/api/items?page=${page}&search=${search}`);
        const data = await res.json();
        setItems(data.items);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    

    fetchItems();
  }, [page, search]);

  return (
    <div className="read-items-container">
      
      {/* ---------- TOP BAR ---------- */}
      <div className="top-bar">
        {/* <h1 className="app-title">BorrowBuddy</h1> */}

        <input
          className="search-bar"
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button className="filters-btn">Filters</button>
        <button className="add-item-btn">+ Add Item</button>
      </div>

      {/* ---------- ITEMS GRID ---------- */}
      <div className="items-grid">
        {items.length > 0 ? (
          items.map((item) => <ItemCard key={item.id} item={item} />)
        ) : (
          <p>No items found.</p>
        )}
      </div>

      {/* ---------- PAGINATION ---------- */}
      <div className="pagination">
        {[...Array(totalPages).keys()].map((num) => {
          const pageNumber = num + 1;
          return (
            <button
              key={pageNumber}
              className={`page-btn ${page === pageNumber ? "active" : ""}`}
              onClick={() => setPage(pageNumber)}
            >
              {pageNumber}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ReadItems;
