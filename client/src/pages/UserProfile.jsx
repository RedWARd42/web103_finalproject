import React, { useEffect, useState } from 'react';
import FollowSection from '../components/FollowSection';
import './UserProfile.css';

const UserProfile = () => {

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      const res = await fetch(`/api/items/${itemId}`, { method: 'DELETE' });
      if (res.ok) fetchItems(selectedUser.id);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleEdit = async (item) => {
    const newTitle = window.prompt('Edit item title:', item.title);
    if (!newTitle) return;

    try {
      const res = await fetch(`/api/items/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...item, title: newTitle }),
      });
      if (res.ok) fetchItems(selectedUser.id);
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
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

    </div>
  );
};

export default UserProfile;

