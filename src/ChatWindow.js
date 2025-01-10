import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom'; // to get the conversation id from the URL
import './ChatWindow.css';

const ChatWindow = () => {
  const { id } = useParams();  // Get the conversation ID from URL
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState(""); // For input field
  const chatWindowRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/v1/conversations/${id}/messages`, {
          credentials: 'same-origin',
        });

        if (response.ok) {
          const data = await response.json();
          setMessages(data); // Set messages for this specific conversation
        } else {
          throw new Error('Failed to fetch messages');
        }
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchMessages();
  }, [id]); // Re-fetch messages when the conversation ID changes

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getMessageClass = (msg) => {
    return msg.user_id === 'user' ? 'user' : 'other';
  };

  useEffect(() => {
    // Scroll to the bottom whenever messages change
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  const handleInputChange = (e) => {
    setMessageInput(e.target.value); // Update input value
  };

  const handleSendMessage = async () => {
    if (messageInput.trim()) {
      // Send message to server or API
      const newMessage = {
        body: messageInput,
        user_id: 'user', // Assuming 'user' is the sender
        created_at: new Date().toISOString(), // Simulate timestamp
      };

      try {
        const response = await fetch(`http://localhost:3000/conversations/${conversation_id}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newMessage),
          credentials: 'same-origin',
        });

        if (response.ok) {
          setMessages((prevMessages) => [...prevMessages, newMessage]);
          setMessageInput(""); // Clear the input after sending
        } else {
          console.error('Failed to send message');
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
    <div className="chat-window-container">
      <div className="chat-window" ref={chatWindowRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${getMessageClass(msg)}`}>
            <p>{msg.body}</p>
            <small className="timestamp">
              {formatTimestamp(msg.timestamp || msg.created_at)}
            </small>
          </div>
        ))}
      </div>

      <div className="input-container">
        <input
          type="text"
          value={messageInput}
          onChange={handleInputChange}
          placeholder="Type your message..."
          className="message-input"
        />
        <button onClick={handleSendMessage} className="send-button">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;

