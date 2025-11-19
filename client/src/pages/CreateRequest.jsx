import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './CreateRequest.css';

const CreateRequest = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/items/${itemId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch item');
        }
        const itemData = await response.json();

        const res = await fetch(`/api/users/${itemData.user_id}`);
        const data = await res.json();

        setItem({ itemData, ownerName: data.username });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (itemId) {
      fetchItem();
    }

  }, [itemId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Using hard-coded user ID for MVP as seen in other components
    const request = {
      item_id: parseInt(itemId),
      borrower_id: 1, // Hard-coded current user ID
      message: message
    };

    try {
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (response.ok) {
        alert('Request submitted successfully!');
        // Navigate back to the item details or browse page
        navigate(`/`);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to submit request');
      }
    } catch (err) {
      setError('Error submitting request: ' + err.message);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!item) return <div>Item not found</div>;

  return (
    <div className="create-request-container">
      <h2>Request Item</h2>
      
      <div className="request-item-preview">
        <h3>Requesting: {item.itemData.title}</h3>
        <p><strong>Owner:</strong> {item.ownerName}</p>
        <p><strong>Location:</strong> {item.itemData.location}</p>
        <p><strong>Category:</strong> {item.itemData.category}</p>
        {item.itemData.rent_price && <p><strong>Price:</strong> ${item.itemData.rent_price}/day</p>}
      </div>

      <form onSubmit={handleSubmit} className="request-form">
        <div className="form-group">
          <label htmlFor="message">Message to Owner:</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Hi, I would like to borrow this item..."
            required
            rows="4"
          />
        </div>
        
        <div className="form-actions">
          <button type="submit" className="submit-request-btn">Submit Request</button>
          <Link to={`/`} className="cancel-btn">Cancel</Link>
        </div>
      </form>
    </div>
  );
};

export default CreateRequest;