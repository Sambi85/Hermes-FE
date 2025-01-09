import React from 'react';
import { Link } from 'react-router-dom';
import useChat from '../hooks/useChat'; // Import the custom hook

const LandingPage = () => {
  const { conversations, loading, error } = useChat();

  if (loading) {
    return <div>Loading conversations...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="landing-page">
      <h2>Your Conversations</h2>
      {conversations.length > 0 ? (
        <ul>
          {conversations.map((conversation) => (
            <li key={conversation.id}>
              <Link to={`/conversations/${conversation.id}`}>
                {conversation.name || `Conversation ${conversation.id}`}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No conversations available.</p>
      )}
    </div>
  );
};

export default LandingPage;
