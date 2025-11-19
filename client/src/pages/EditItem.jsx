import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './EditItem.css';

const EditItem = () => {
  const { id } = useParams(); // itemId from URL
  const navigate = useNavigate();
  const [item, setItem] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    post_type: 'lend',
    rent_price: '',
    image_url: '',
    status: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await fetch(`/api/items/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch item');
        }
        const itemData = await response.json();
        // Format the item data to match our form fields
        setItem({
          title: itemData.title || '',
          description: itemData.description || '',
          category: itemData.category || '',
          location: itemData.location || '',
          post_type: itemData.post_type || 'lend',
          rent_price: itemData.rent_price || '',
          image_url: itemData.image_url || '',
          status: itemData.status || ''
        });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (id) {
      fetchItem();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const itemData = {
      ...item,
      rent_price: item.rent_price ? parseFloat(item.rent_price) : null
    };

    try {
      const response = await fetch(`/api/items/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
      });

      if (response.ok) {
        alert('Item updated successfully!');
        // Navigate back to the user profile or items page
        navigate(`/user/1`); // Using hard-coded user ID as in other components
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update item');
      }
    } catch (err) {
      setError('Error updating item: ' + err.message);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="edit-item-container">
      <h2>Edit Item</h2>
      
      <form onSubmit={handleSubmit} className="item-form">
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={item.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={item.description}
            onChange={handleChange}
            rows="4"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <input
              type="text"
              id="category"
              name="category"
              value={item.category}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={item.location}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="post_type">Post Type</label>
            <select
              id="post_type"
              name="post_type"
              value={item.post_type}
              onChange={handleChange}
            >
              <option value="lend">Lend</option>
              <option value="borrow">Borrow</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="rent_price">Rent Price ($/day)</label>
            <input
              type="number"
              id="rent_price"
              name="rent_price"
              value={item.rent_price}
              onChange={handleChange}
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="image_url">Image URL</label>
          <input
            type="text"
            id="image_url"
            name="image_url"
            value={item.image_url}
            onChange={handleChange}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="save-item-btn">Save Changes</button>
          <Link to={`/user/1`} className="cancel-btn">Cancel</Link>
        </div>
      </form>
    </div>
  );
};

export default EditItem;