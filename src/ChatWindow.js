import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom'; // to get the conversation id from the URL
import { createConsumer } from '@rails/actioncable'; // WebSocket connection
import './ChatWindow.css';

const ChatWindow = () => {
  const { id } = useParams();  // Get the conversation ID from URL
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const chatWindowRef = useRef(null);
  const [channel, setChannel] = useState(null);
  const userId = 1 // Replace with actual user ID......

  useEffect(() => { // Fetch messages when the component mounts
    const fetchMessages = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/v1/conversations/${id}/messages`);
        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        } else {
          console.error('Failed to fetch messages');
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, []); 

  // Set up WebSocket connection using ActionCable
  useEffect(() => {
    const cable = createConsumer(`ws://localhost:3000/cable?user_id=${userId}`);
    const newChannel = cable.subscriptions.create(
      { channel: 'ChatChannel', conversation_id: id, user_id: userId },
      {
        received: (data) => {
          setMessages((prevMessages) => [
            ...prevMessages,
            { id: Date.now(), body: data.body, sender: data.sender, timestamp: new Date() },
          ]);
        },
        sendMessage: (messageText) => {
          newChannel.send({ message: messageText });
        },
      }
    );

    setChannel(newChannel);

    return () => {
      if (newChannel) {
        newChannel.unsubscribe(); // Unsubscribe when component unmounts
      }
    };
  }, [id]); // Reconnect if conversation ID changes

  // Scroll to the bottom of the chat window whenever messages change
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);


  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getMessageClass = (msg) => {
    console.log(msg);
    return msg.sender_id === msg.user_id ? 'user' : 'other';
  };

  const handleInputChange = (e) => {
    setMessageInput(e.target.value);
  };

  // Handle sending the message
  const handleSendMessage = async () => {
    if (messageInput.trim()) {

      const newMessage = {
        body: messageInput,
        user_id: userId,
        created_at: new Date().toISOString(),
        sender_id: userId
      };

      setMessages((prevMessages) => [...prevMessages, newMessage]);

      if (channel) {
        channel.sendMessage(messageInput); // Send message through WebSocket channel
      }
      setMessageInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();  // Prevent form submission or new line
      handleSendMessage();
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
          onKeyDown={handleKeyDown}  // Handle Enter key to send
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

