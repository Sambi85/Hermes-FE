import React, { useState, useEffect } from 'react';
import { createConsumer } from '@rails/actioncable';
import ChatWindow from './ChatWindow';
// import './App.css';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [channel, setChannel] = useState(null);

  const conversationId = 1;
  const userId = 1;

  useEffect(() => {
    const cableUrl = process.env.REACT_APP_CABLE_URL || 'ws://localhost:3000/cable'; 
    const cable = createConsumer(cableUrl);

    const newChannel = cable.subscriptions.create(
      { channel: 'ChatChannel', conversation_id: conversationId, user_id: userId },
      {
        received: (data) => {
          setMessages((prevMessages) => [
            ...prevMessages,
            { id: Date.now(), text: data.message, sender: 'other', timestamp: new Date() },
          ]);
        },
        sendMessage: (messageText) => {
          newChannel.send({ message: messageText, current_user: userId, recipient_ids: [userId] });
        },
      }
    );

    setChannel(newChannel);

    return () => {
      newChannel.unsubscribe();
    };
  }, [conversationId]);

  const handleSendMessage = () => {
    if (message.trim() && channel) {
      channel.sendMessage(message);

      setMessages((prevMessages) => [
        ...prevMessages,
        { id: Date.now(), text: message, sender: 'user', timestamp: new Date() },
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
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default App;
