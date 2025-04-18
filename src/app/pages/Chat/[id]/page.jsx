'use client';
import { useParams } from 'next/navigation';
import "./page.css";
import Header from '../../../components/Header/Header';
import Footer from '../../../components/Footer/Footer';
import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

const ChatInterface = () => {
  const [user, setUser] = useState(null); // State to store user data
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]); // Make sure this is initialized as an empty array
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const params = useParams();
  const receiver_id = parseInt(params?.id);

  useEffect(() => {
    // Get user data from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (!user) return; // Wait until user is loaded

    // Initialize socket connection
    const newSocket = io('http://5.83.153.81:25608');
    setSocket(newSocket);

    // Join the chat room
    const room = `chat_${Math.min(user.user_id, receiver_id)}_${Math.max(user.user_id, receiver_id)}`;
    newSocket.emit('join', { room });

    // Load chat history
    fetchChatHistory();

    // Listen for new messages
    newSocket.on('new_message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    return () => newSocket.close();
  }, [user, receiver_id]);

  const fetchChatHistory = async () => {
    try {
      const response = await fetch(`http://5.83.153.81:25608/api/chat-history/${receiver_id}`, {
        headers: {
          'Authorization': `Bearer ${user?.token}` // Use the token from localStorage
        }
      });
      const data = await response.json();
      setMessages(data.messages); // Make sure to access 'messages' property if it's inside an object
      setLoading(false);
    } catch (error) {
      console.error('Error fetching chat history:', error);
      setLoading(false);
    }
  };
  

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    socket.emit('private_message', {
      sender_id: user.user_id, // Use the user_id from localStorage
      receiver_id: receiver_id,
      message: newMessage.trim()
    });

    setNewMessage('');
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
  <div className="chat-container">
    <Header />
    <div className="chat-main">
      <div className="chat-box">
        {/* Messages Container */}
        <div className="messages-container">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.sender_id === user.user_id ? 'sent' : 'received'}`}
            >
              <div className="message-content">
                <p>{message.message}</p>
                <p className="message-time">
                  {new Date(message.created_at).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="input-form">
          <div className="input-container">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="message-input"
              placeholder="Type your message..."
            />
            <button type="submit" className="send-button">
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
    

  </div>
);
};

export default ChatInterface;
