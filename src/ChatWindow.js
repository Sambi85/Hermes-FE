import React from 'react';
import './ChatWindow.css';

// Function to format the timestamp to the user's local timezone with AM/PM
const formatTime = (date) => {
  const options = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true, // Ensure 12-hour format (AM/PM)
  };
  return date.toLocaleTimeString([], options); // Using user's local timezone
};

const ChatWindow = ({ messages }) => {
  return (
    <div className="chat-window">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`message ${message.sender === 'user' ? 'user' : 'other'}`}
        >
          <p>{message.text}</p>
          <div className="timestamp">
            {/* Format the timestamp according to the message's timestamp */}
            {formatTime(new Date(message.timestamp))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatWindow;
