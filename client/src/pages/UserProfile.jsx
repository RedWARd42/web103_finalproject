// import React, { useEffect, useState } from 'react'

// const UserProfile = () => {
//   const [users, setUsers] = useState([])
//   const [selectedUser, setSelectedUser] = useState(null)
//   const [items, setItems] = useState([])
//   const [loading, setLoading] = useState(true)

//   // Fetch all users for the profile selector
//   const fetchUsers = async () => {
//     try {
//       const res = await fetch('/api/users')
//       const data = await res.json()
//       setUsers(data)
//       if (data.length > 0) setSelectedUser(data[0]) // select first by default
//     } catch (error) {
//       console.error('Error fetching users:', error)
//     }
//   }

//   // Fetch items for selected user
//   const fetchItems = async (userId) => {
//     try {
//       setLoading(true)
//       const res = await fetch(`/api/items?user_id=${userId}`)
//       const data = await res.json()
//       setItems(data.items)
//       setLoading(false)
//     } catch (error) {
//       console.error('Error fetching items:', error)
//       setLoading(false)
//     }
//   }

//   // Delete item
//   const handleDelete = async (itemId) => {
//     if (!window.confirm('Are you sure you want to delete this item?')) return

//     try {
//       const res = await fetch(`/api/items/${itemId}`, { method: 'DELETE' })
//       if (res.ok) {
//         // Refresh items after deletion
//         fetchItems(selectedUser.id)
//       } else {
//         console.error('Failed to delete item')
//       }
//     } catch (error) {
//       console.error('Error deleting item:', error)
//     }
//   }

//   // Edit item (simple prompt for now)
//   const handleEdit = async (item) => {
//     const newTitle = window.prompt('Edit item title:', item.title)
//     if (!newTitle) return

//     try {
//       const res = await fetch(`/api/items/${item.id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ ...item, title: newTitle })
//       })
//       if (res.ok) {
//         fetchItems(selectedUser.id)
//       } else {
//         console.error('Failed to update item')
//       }
//     } catch (error) {
//       console.error('Error updating item:', error)
//     }
//   }

//   // On mount, fetch users
//   useEffect(() => {
//     fetchUsers()
//   }, [])

//   // Fetch items whenever selectedUser changes
//   useEffect(() => {
//     if (selectedUser) {
//       fetchItems(selectedUser.id)
//     }
//   }, [selectedUser])

//   return (
//     <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
//       {/* User Selector */}
//       <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
//         {users.map((user) => (
//           <button
//             key={user.id}
//             onClick={() => setSelectedUser(user)}
//             style={{
//               padding: '10px 15px',
//               borderRadius: '8px',
//               border: selectedUser?.id === user.id ? '2px solid #007bff' : '1px solid #ccc',
//               background: selectedUser?.id === user.id ? '#e6f0ff' : '#fff',
//               cursor: 'pointer'
//             }}
//           >
//             {user.username}
//           </button>
//         ))}
//       </div>

//       {/* Selected User Info Card */}
//       <h3>Profile</h3>
//       {selectedUser && (
//         <div style={{
//           padding: '20px',
//           borderRadius: '10px',
//           border: '1px solid #ccc',
//           marginBottom: '30px',
//           background: '#f9f9f9'
//         }}>
//           <h2>{selectedUser.username}</h2>
//           <p><strong>Email:</strong> {selectedUser.email}</p>
//           <p><strong>Rating:</strong> {selectedUser.rating ?? 'No rating yet'}</p>
//         </div>
//       )}

//       Items List
//       <h3>Items Lending</h3>
//       {loading ? (
//         <p>Loading items...</p>
//       ) : (
//         items.length === 0 ? (
//           <p>No items found.</p>
//         ) : (
//           <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
//             {items.map((item) => (
//               <div key={item.id} style={{
//                 display: 'flex',
//                 justifyContent: 'space-between',
//                 padding: '15px',
//                 borderRadius: '8px',
//                 border: '1px solid #ddd',
//                 background: '#fff',
//                 alignItems: 'center'
//               }}>
//                 <div>
//                   <h4>{item.title}</h4>
//                   <p><strong>Category:</strong> {item.category}</p>
//                   <p><strong>Description:</strong> {item.description}</p>
//                   <p><strong>Location:</strong> {item.location}</p>
//                   <p><strong>Price:</strong> ${item.rent_price}</p>
//                   <p><strong>Status:</strong> {item.status}</p>
//                 </div>
//                 <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
//                   <button
//                     onClick={() => handleEdit(item)}
//                     style={{ padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => handleDelete(item.id)}
//                     style={{ padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', background: '#ffdddd', border: '1px solid #ff5c5c' }}
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )
//       )}
//     </div>
//   )
// }

// export default UserProfile














import React, { useEffect, useState } from 'react';
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

      {/* Items List */}
      <h3>Items Lending</h3>
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
                <button className="delete-btn" onClick={() => handleDelete(item.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserProfile;

