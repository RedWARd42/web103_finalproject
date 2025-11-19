//
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateItem.css";

const CreateItem = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    post_type: "lend",
    rent_price: "",
    image_url: "",
    user_id: 1, // TEMP: Replace with logged-in user ID
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }

    try {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to create item");

      navigate(`/user/${form.user_id}`); // redirect back to profile
    } catch (err) {
      console.error(err);
      setError("Error creating item.");
    }
  };

  return (
    <div className="create-item-container">
      <h2>Create New Item</h2>

      <form className="create-item-form" onSubmit={handleSubmit}>
        {error && <p className="error">{error}</p>}

        <label>
          Title*
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Description
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="4"
          ></textarea>
        </label>

        <label>
          Category
          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
          />
        </label>

        <label>
          Location (City, State)
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
          />
        </label>

        {/* <label>
          Post Type
          <select name="post_type" value={form.post_type} onChange={handleChange}>
            <option value="lend">Lend</option>
            <option value="borrow">Borrow</option>
          </select>
        </label> */}

        <label>
          Rent Price
          <input
            type="number"
            step="0.01"
            name="rent_price"
            value={form.rent_price}
            onChange={handleChange}
          />
        </label>

        <label>
          Image URL
          <input
            type="text"
            name="image_url"
            value={form.image_url}
            onChange={handleChange}
          />
        </label>

        <button className="submit-btn" type="submit">
          Create Item
        </button>
      </form>
    </div>
  );
};

export default CreateItem;


