import React, { useState, useEffect } from 'react';
import { createConsumer } from '@rails/actioncable';
import ChatWindow from './ChatWindow';
import './App.css';
import './ChatWindow.css';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [channel, setChannel] = useState(null);

  const conversationId = 1; // Example conversation ID
  const userId = 1; // Example user ID

  // Fetch existing messages when the component mounts
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/v1/conversations/${conversationId}/messages`);
        if (response.ok) {
          const data = await response.json();
          setMessages(data);  // Set fetched messages to state
        } else {
          console.error('Failed to fetch messages');
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [conversationId]);  // Fetch messages once when component mounts

  // ActionCable Subscription and Message Reception
  useEffect(() => {
    const cableUrl = process.env.REACT_APP_CABLE_URL || 'ws://localhost:3000/cable';
    const cable = createConsumer(cableUrl);

    // Create a new subscription to the ActionCable channel
    const newChannel = cable.subscriptions.create(
      { channel: 'ChatChannel', conversation_id: conversationId, user_id: userId },
      {
        received: (data) => {
          setMessages((prevMessages) => {
            // Prevent duplicates by checking if the message already exists
            const messageExists = prevMessages.some((msg) => msg.text === data.body);
            if (!messageExists) {
              return [
                ...prevMessages,
                {
                  id: Date.now(),  // You can use a timestamp or a unique ID from the backend
                  text: data.body,
                  sender: data.sender,  // 'user' or 'other' sender
                  timestamp: new Date(),
                },
              ];
            }
            return prevMessages;
          });
        },
        sendMessage: (messageText) => {
          // Send the message via ActionCable
          newChannel.send({ message: messageText, recipient_ids: [userId] });
        },
      }
    );

    setChannel(newChannel);

    return () => {
      newChannel.unsubscribe();  // Clean up on component unmount
    };
  }, [conversationId, userId]);

  const handleSendMessage = () => {
    if (message.trim() && channel) {
      // Send the message through ActionCable
      channel.sendMessage(message);

      // Optimistically update the messages state with sender as 'user'
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: Date.now(),
          body: message,
          sender: 'user',  // Mark as 'user' for the current message
          timestamp: new Date(),
        },
      ]);
      setMessage('');  // Clear the input field
    }
  };

  return (
    <div className="App">
      <h1>Chat Room: {conversationId}</h1>
      <ChatWindow messages={messages} />
      <div className="input-container">
        <input
          className="message-input"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button className="send-button" onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default App;
