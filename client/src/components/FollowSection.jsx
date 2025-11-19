import React, { useState, useEffect } from 'react';
import './FollowSection.css';

const FollowSection = ({ userId, currentUserId }) => {
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followStatusLoading, setFollowStatusLoading] = useState(true);

  useEffect(() => {
    const fetchFollowData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/users/${userId}/profile`);
        const userData = await response.json();
        
        setFollowing(userData.following || []);
        setFollowers(userData.followers || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching follow data:', error);
        setLoading(false);
      }
    };

    if (userId) {
      fetchFollowData();
    }
  }, [userId]);

  useEffect(() => {
    // Get follow status between current user and the profile user
    const fetchFollowStatus = async () => {
      try {
        const response = await fetch(`/api/follows/status?followerId=${currentUserId}&followingId=${userId}`);
        const data = await response.json();
        setIsFollowing(data.isFollowing);
        setFollowStatusLoading(false);
      } catch (error) {
        console.error('Error fetching follow status:', error);
        setFollowStatusLoading(false);
      }
    };

    if (userId && currentUserId && userId !== currentUserId) {
      fetchFollowStatus();
    } else {
      // If it's the same user, then followStatusLoading should be false
      setFollowStatusLoading(false);
    }
  }, [userId, currentUserId]);

  const handleFollow = async (followedUserId) => {
    try {
      const response = await fetch('/api/follows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          followerId: currentUserId,
          followingId: followedUserId,
        }),
      });

      if (response.ok) {
        setIsFollowing(true); // Update UI immediately
      } else {
        const errorData = await response.json();
        console.error('Error following user:', errorData);
      }
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleUnfollow = async (followedUserId) => {
    try {
      const response = await fetch('/api/follows', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          followerId: currentUserId,
          followingId: followedUserId,
        }),
      });

      if (response.ok) {
        setIsFollowing(false); // Update UI immediately
      } else {
        const errorData = await response.json();
        console.error('Error unfollowing user:', errorData);
      }
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  if (loading) {
    return <p>Loading follow information...</p>;
  }

  if (currentUserId === parseInt(userId)) {
    // If viewing own profile, show both followers and following
    return (
      <div className="follow-section">
        <div className="follow-data">
          <div className="follow-count">
            <strong>{followers.length}</strong> Followers
          </div>
          <div className="follow-count">
            <strong>{following.length}</strong> Following
          </div>
        </div>
        
        {following.length > 0 && (
          <div className="following-list">
            <h4>Following</h4>
            <ul>
              {following.map(user => (
                <li key={user.id} className="user-item">
                  <span className="username">@{user.username}</span>
                  <button 
                    className="unfollow-btn"
                    onClick={() => handleUnfollow(user.id)}
                  >
                    Unfollow
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {followers.length > 0 && (
          <div className="followers-list">
            <h4>Followers</h4>
            <ul>
              {followers.map(user => (
                <li key={user.id} className="user-item">
                  <span className="username">@{user.username}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  } else {
    // If viewing other user's profile, show follow button
    if (followStatusLoading) {
      return <p>Loading follow status...</p>;
    }
    
    return (
      <div className="follow-section">
        <div className="follow-data">
          <div className="follow-count">
            <strong>{followers.length}</strong> Followers
          </div>
          <div className="follow-count">
            <strong>{following.length}</strong> Following
          </div>
        </div>
        
        <button 
          className={`follow-btn ${isFollowing ? 'unfollow' : 'follow'}`}
          onClick={() => 
            isFollowing 
              ? handleUnfollow(userId) 
              : handleFollow(userId)
          }
        >
          {isFollowing ? 'Unfollow' : 'Follow'}
        </button>
      </div>
    );
  }
};

export default FollowSection;