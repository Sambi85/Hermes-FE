import React from 'react';
import './ChatWindow.css';

const ChatWindow = ({ messages }) => {
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chat-window">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`message ${msg.sender === 'user' ? '.user' : '.other'}`} 
          >
          <p>{msg.body}</p>
          <small className="timestamp">
            {formatTimestamp(msg.created_at)} {/* Format timestamp here */}
          </small>
        </div>
      ))}
    </div>
  );
};

export default ChatWindow;
