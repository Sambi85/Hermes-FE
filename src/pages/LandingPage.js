import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './LandingPage.css';

const LandingPage = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userName = "Default User";

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/conversations', {
          withCredentials: true,  // Includes cookies
        });
        setConversations(response.data);
      } catch (error) {
        setError(error.message || 'Failed to fetch conversations');
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.delete('http://localhost:3000/users/sign_out', {
        withCredentials: true,  // Includes cookies
      });

      if (response.status === 200) {
        window.location.href = 'http://localhost:3000/users/sign_in';
      }
    } catch (error) {
      console.error('Logout error:', error.message);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true, // AM/PM format
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return <div className="loading">Loading conversations...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="landing-page">
      <div className="conversation-container">
        <h2>Sup, {userName}</h2>
        <button onClick={handleLogout} className="logout-button">
          Log Out
        </button>
        <>{console.log(conversations)}</>
        {conversations.length > 0 ? (
          <ul className="conversation-list">
            {conversations.map((conversation) => (
              <li key={conversation.id} className="conversation-item">
                <Link to={`/conversations/${conversation.id}`} className="conversation-link">
                  <span className="conversation-name">
                    {conversation.name ? `Chat Room: ${conversation.name}` : `Conversation ${conversation.id}`}
                  </span>
                  <span className="conversation-timestamp">
                    {formatTimestamp(conversation.updated_at)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No conversations available.</p>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
