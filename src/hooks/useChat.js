// src/hooks/useChat.js
import { useState, useEffect } from 'react';
import { createConsumer } from '@rails/actioncable';

const useChat = (conversationId, userId) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [channel, setChannel] = useState(null);

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
  }, [conversationId]); // Fetch messages once when component mounts

  useEffect(() => {
    const cableUrl = process.env.REACT_APP_CABLE_URL || 'ws://localhost:3000/cable';
    const cable = createConsumer(cableUrl);

    const newChannel = cable.subscriptions.create(
      { channel: 'ChatChannel', conversation_id: conversationId, user_id: userId },
      {
        received: (data) => {
          setMessages((prevMessages) => [
            ...prevMessages,
            { id: Date.now(), text: data.body, sender: data.sender, timestamp: new Date() },
          ]);
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
  }, [conversationId, userId]);

  const handleSendMessage = () => {
    if (message.trim() && channel) {
      channel.sendMessage(message);

      setMessages((prevMessages) => [
        ...prevMessages,
        { id: Date.now(), body: message, sender: 'user', timestamp: new Date() },
      ]);
      setMessage('');
    }
  };

  return {
    messages,
    message,
    setMessage,
    handleSendMessage,
  };
};

export default useChat;
