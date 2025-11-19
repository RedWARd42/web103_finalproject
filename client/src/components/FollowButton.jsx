import React, { useState, useEffect } from 'react';
import './FollowButton.css';

const FollowButton = ({ userId, currentUserId, onChange, refresh }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkFollowingStatus = async () => {
      try {
        const response = await fetch(
          `/api/follows/status?followerId=${currentUserId}&followingId=${userId}`
        );
        const data = await response.json();
        setIsFollowing(data.isFollowing);
        setLoading(false);
      } catch (error) {
        console.error('Error checking following status:', error);
        setLoading(false);
      }
    };

    if (userId && currentUserId) {
      checkFollowingStatus();
    }
  }, [userId, currentUserId, refresh]);

  const handleFollowToggle = async () => {
    if (isFollowing) {
      // Unfollow
      try {
        const response = await fetch('/api/follows', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            followerId: currentUserId,
            followingId: userId,
          }),
        });

        if (response.ok) {
          setIsFollowing(false);
          if (typeof onChange === 'function') onChange();
        } else {
          console.error('Error unfollowing user');
        }
      } catch (error) {
        console.error('Error unfollowing user:', error);
      }
    } else {
      // Follow
      try {
        const response = await fetch('/api/follows', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            followerId: currentUserId,
            followingId: userId,
          }),
        });

        if (response.ok) {
          setIsFollowing(true);
          if (typeof onChange === 'function') onChange();
        } else {
          console.error('Error following user');
        }
      } catch (error) {
        console.error('Error following user:', error);
      }
    }
  };

  if (loading) {
    return <button className="follow-btn" disabled>Loading...</button>;
  }

  return (
    <button 
      className={`follow-btn ${isFollowing ? 'unfollow' : 'follow'}`}
      onClick={handleFollowToggle}
    >
      {isFollowing ? 'Unfollow' : 'Follow'}
    </button>
  );
};

export default FollowButton;