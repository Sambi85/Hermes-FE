import React, { useEffect, useRef } from 'react';
import './ChatWindow.css';

const ChatWindow = ({ messages }) => {
  const chatWindowRef = useRef(null);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getMessageClass = (msg) => {
    return msg.user_id === 'user' ? 'user' : 'other' || msg.user_id == msg.sender_id? 'user' : 'other';
  };

  useEffect(() => {
    // Scroll to the bottom whenever messages change
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chat-window" ref={chatWindowRef}>
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`message ${getMessageClass(msg)}`}
        >
          <p>{msg.body}</p>
          <small className="timestamp">
            {formatTimestamp(msg.timestamp|| msg.created_at)}
          </small>
        </div>
      ))}
    </div>
  );
};

export default ChatWindow;
