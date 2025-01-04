import React, { useState, useEffect } from 'react';
import { createConsumer } from '@rails/actioncable';
import ChatWindow from './ChatWindow';
import './App.css';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [channel, setChannel] = useState(null);

  const conversationId = 1; // You can dynamically pass this in your app
  const userId = 1; // Same for userId, this can be dynamically set based on the logged-in user

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/v1/conversations/${conversationId}/messages`);
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
  }, []); // Empty dependency array ensures this runs only once on page load

  console.log('Messages:', messages);

  useEffect(() => {
    const cableUrl = process.env.REACT_APP_CABLE_URL || 'ws://localhost:3000/cable';
    const cable = createConsumer(cableUrl);

    const newChannel = cable.subscriptions.create(
      { channel: 'ChatChannel', conversation_id: conversationId, user_id: userId },
      {
        received: (data) => {
          setMessages((prevMessages) => { // Prevent adding duplicate messages
            const messageExists = prevMessages.some((msg) => msg.text === data.message);
            if (!messageExists) {
              return [
                ...prevMessages,
                { id: Date.now(), text: data.message, sender: 'other', timestamp: new Date() },
              ];
            }
            return prevMessages;
          });
        },
        sendMessage: (messageText) => {
          newChannel.send({ message: messageText, recipient_ids: [userId] });
        },
      }
    );

    setChannel(newChannel);

    return () => {
      newChannel.unsubscribe();
    };
  }, [conversationId, userId]); // Re-run if conversationId or userId changes

  const handleSendMessage = () => {
    if (message.trim() && channel) {
      channel.sendMessage(message);

      
      setMessages((prevMessages) => [ // Optimistically update the local state
        ...prevMessages,
        { id: Date.now(), body: message, sender: 'user' , created_at: new Date() }, //need to send boolean if current user
      ]);
      setMessage('');
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
        <button className='send-button' onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default App;
