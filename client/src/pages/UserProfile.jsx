import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FollowSection from '../components/FollowSection';
import './UserProfile.css';

const UserProfile = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [items, setItems] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestsLoading, setRequestsLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsers(data);
      if (data.length > 0) setSelectedUser(data[0]);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchItems = async (userId) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/items?user_id=${userId}`);
      const data = await res.json();
      setItems(data.items);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching items:', error);
      setLoading(false);
    }
  };

  const fetchOutgoingRequests = async () => {
    try {
      setRequestsLoading(true);
      // Using hard-coded current user ID as in other components
      const CURRENT_USER_ID = 1;
      const res = await fetch(`/api/requests/borrower/${CURRENT_USER_ID}`);
      const data = await res.json();
      setOutgoingRequests(data);
      setRequestsLoading(false);
    } catch (error) {
      console.error('Error fetching outgoing requests:', error);
      setRequestsLoading(false);
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      const res = await fetch(`/api/items/${itemId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchItems(selectedUser.id);
        // Also refresh outgoing requests since they might be related
        fetchOutgoingRequests();
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleEdit = (item) => {
    navigate(`/items/${item.id}/edit`);
  };

  useEffect(() => {
    fetchUsers();
    // Fetch outgoing requests for the current user (hard-coded as 1)
    fetchOutgoingRequests();
  }, []);

  useEffect(() => {
    if (selectedUser) fetchItems(selectedUser.id);
  }, [selectedUser]);

  return (
    <div className="profile-container">
      {/* User Selector */}
      <div className="user-selector">
        {users.map((user) => (
          <button
            key={user.id}
            className={`user-btn ${selectedUser?.id === user.id ? 'active' : ''}`}
            onClick={() => setSelectedUser(user)}
          >
            {user.username}
          </button>
        ))}
      </div>

      {/* Profile Card */}
      <h2>Profile</h2>
      {selectedUser && (
        <div className="profile-card">
          <h2>{selectedUser.username}</h2>
          <p><strong>Email:</strong> {selectedUser.email}</p>
          <p><strong>Rating:</strong> {selectedUser.rating ?? 'No rating yet'}</p>
        </div>
      )}

      {/* Follow Section */}
      {selectedUser && (
        <FollowSection 
          userId={selectedUser.id} 
          currentUserId={1} // Using the hardcoded LOGGED_IN_USER_ID from App.jsx
        />
      )}

      {/* Items List Header */}
        <div className="items-header">
        <h3>Items Lending</h3>

        <button className="add-item-btn">
            + Add Item
        </button>
        </div>

        {loading ? (
        <p className="loading">Loading items...</p>
        ) : items.length === 0 ? (
        <p className="no-items">No items found.</p>
        ) : (
        <div className="items-list">
            {items.map((item) => (
            <div key={item.id} className="item-row">
                <span className="item-title">{item.title}</span>
                <span className={`item-status ${item.status.toLowerCase()}`}>
                {item.status}
                </span>
                <div className="item-actions">
                <button onClick={() => handleEdit(item)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(item.id)}>
                    Delete
                </button>
                </div>
            </div>
            ))}
        </div>
        )}

      {/* Outgoing Requests Section */}
        <div className="outgoing-requests-header">
        <h3>Requests Made</h3>
        </div>

        {requestsLoading ? (
        <p className="loading">Loading requests...</p>
        ) : outgoingRequests.length === 0 ? (
        <p className="no-requests">No outgoing requests found.</p>
        ) : (
        <div className="outgoing-requests-list">
            {outgoingRequests.map((request) => (
            <div key={request.id} className="request-row">
                <div className="request-info">
                <span className="request-item-title">{request.item_title}</span>
                <span className="request-owner">to @{request.item_owner}</span>
                </div>
                <span className={`request-status ${request.status.toLowerCase()}`}>
                {request.status}
                </span>
                <div className="request-date">
                {request.created_at ? new Date(request.created_at).toLocaleDateString() : 'N/A'}
                </div>
            </div>
            ))}
        </div>
        )}

    </div>
  );
};

export default UserProfile;

