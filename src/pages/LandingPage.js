import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch('http://localhost:3000/conversations', {
          credentials: 'same-origin',
        });

        if (response.ok) {
          const data = await response.json();
          setConversations(data);
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch conversations');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  // Function to format timestamp to local AM/PM format
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
        <h2>Your Conversations</h2>
        {conversations.length > 0 ? (
          <ul className="conversation-list">
            {conversations.map((conversation) => (
              <li key={conversation.id} className="conversation-item">
                <Link to={`/conversations/${conversation.id}`} className="conversation-link">
                  <span className="conversation-name">
                    {conversation.name ? `Chat: ${conversation.name}` : `Conversation ${conversation.id}`}
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
