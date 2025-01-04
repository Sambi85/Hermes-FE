import React, { useState } from 'react';
import './App.css';
import ChatWindow from './ChatWindow';

function App() {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello, how are you?', sender: 'other' },
    { id: 2, text: 'I am doing well, thank you!', sender: 'user' }
  ]);
  const [messageInput, setMessageInput] = useState('');

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      setMessages([
        ...messages,
        { id: messages.length + 1, text: messageInput, sender: 'user' }
      ]);
      setMessageInput('');
    }
  };

  return (
    <div className="App">
      <h1>Chat Application</h1>
      <ChatWindow messages={messages} />
      
      {/* Container for input and button */}
      <div className="input-container">
        <input
          type="text"
          className="message-input"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Write sometthing..."
        />
        <button className="send-button" onClick={handleSendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
