import React from 'react';
import './ChatWindow.css';

// Function to format the timestamp
const formatTime = (date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${hours}:${minutes < 10 ? `0${minutes}` : minutes}`;
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
            {formatTime(new Date())}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatWindow;
