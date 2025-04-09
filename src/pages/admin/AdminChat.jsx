import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { submitChat } from "@/utils/api";
import { useAuth } from "@/hooks/useAuth";
import io from 'socket.io-client';
import axios from 'axios';

function AdminChat() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [registeredChats, setRegisteredChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [notifications, setNotifications] = useState({});
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const API_BASE_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:3000"
      : "https://your-production-url.com";

  useEffect(() => {
    // Initialize Socket.IO connection
    socketRef.current = io(API_BASE_URL, {
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current.on('connect', () => {
      console.log('Admin connected:', socketRef.current.id);
      if (isAdminLoggedIn) {
        socketRef.current.emit('admin-login');
      }
      if (activeChat) {
        socketRef.current.emit('join-room', activeChat.userId);
      }
    });

    socketRef.current.on('reconnect', () => {
      console.log('Admin reconnected:', socketRef.current.id);
      if (isAdminLoggedIn) {
        socketRef.current.emit('admin-login');
      }
      if (activeChat) {
        socketRef.current.emit('join-room', activeChat.userId);
      }
    });

    socketRef.current.on('reconnect_error', () => {
      console.log('Admin reconnection failed');
      toast.error("Connection lost. Please try again later.");
    });

    socketRef.current.on('chat-request', (data) => {
      console.log('Chat request received:', data);
      setRegisteredChats((prev) => {
        if (prev.some((chat) => chat.userId === data.userId)) {
          return prev;
        }
        return [...prev, data];
      });
    });

    socketRef.current.on('chat-notification', (data) => {
      console.log('Chat notification received:', data);
      setNotifications((prev) => ({
        ...prev,
        [data.userId]: (prev[data.userId] || 0) + 1,
      }));
    });

    socketRef.current.on('message', (data) => {
      console.log('Message from user:', data);
      if (data.sender === "user") {
        setMessages((prev) => {
          if (prev.some((msg) => msg.text === data.text && msg.timestamp === data.timestamp)) {
            return prev;
          }
          return [
            ...prev,
            {
              id: prev.length + 1,
              text: data.text,
              sender: data.sender,
              timestamp: data.timestamp || new Date().toISOString(),
            },
          ];
        });
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [isAdminLoggedIn, activeChat]);

  useEffect(() => {
    if (authLoading) return;

    if (isAuthenticated && user && user.role === 'admin') {
      setIsAdminLoggedIn(true);
      socketRef.current.emit('admin-login');
      loadRegisteredChats();
    }
  }, [authLoading, isAuthenticated, user]);

  const loadRegisteredChats = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/chat/all`, { withCredentials: true });
      setRegisteredChats(response.data.map(chat => ({
        userId: chat.userId,
        name: chat.name,
        email: chat.email,
        socketId: null,
      })));
    } catch (error) {
      console.error('Error loading registered chats:', error);
      toast.error("Failed to load chat list.");
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleOpenChat = async (chat) => {
    setActiveChat(chat);
    setNotifications((prev) => {
      const newNotifications = { ...prev };
      delete newNotifications[chat.userId];
      return newNotifications;
    });

    try {
      const response = await axios.get(`${API_BASE_URL}/api/chat/history`, {
        params: { email: chat.email },
        withCredentials: true,
      });
      const history = response.data.messages || [];
      const formattedHistory = history.map((msg) => ({
        ...msg,
        timestamp: msg.timestamp ? new Date(msg.timestamp).toISOString() : new Date().toISOString(),
      }));
      setMessages(formattedHistory);
    } catch (error) {
      console.error("Error loading chat history:", error);
      setMessages([]);
      toast.error("Failed to load chat history.");
    }

    socketRef.current.emit('join-room', chat.userId);
    socketRef.current.emit('accept-chat', {
      userId: chat.userId,
      userSocketId: chat.socketId,
    });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const adminMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: "admin",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, adminMessage]);
    socketRef.current.emit('admin-message', {
      userId: activeChat.userId,
      message: inputValue,
      sender: "admin",
      timestamp: adminMessage.timestamp,
    });

    try {
      await submitChat({
        name: activeChat.name,
        email: activeChat.email,
        message: inputValue,
      });
    } catch (error) {
      console.error("Error saving admin message:", error);
      toast.error("Failed to send message.");
    }

    setInputValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Chat Interface</h1>

      {!isAdminLoggedIn ? (
        <p>You must be logged in as an admin to access this interface.</p>
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-2">Registered Chats</h2>
          {registeredChats.length === 0 ? (
            <p>No chats registered yet.</p>
          ) : (
            <ul className="mb-4">
              {registeredChats.map((chat) => (
                <li key={chat.userId} className="mb-2 p-2 border rounded flex justify-between items-center">
                  <div>
                    <p><strong>User:</strong> {chat.name} ({chat.email})</p>
                  </div>
                  <div className="flex items-center">
                    {notifications[chat.userId] > 0 && (
                      <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs mr-2">
                        {notifications[chat.userId]} new
                      </span>
                    )}
                    <Button
                      onClick={() => handleOpenChat(chat)}
                      className="bg-eco hover:bg-eco-dark"
                    >
                      Open Chat
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {activeChat && (
            <div className="border rounded p-4">
              <h2 className="text-xl font-semibold mb-2">
                Chatting with {activeChat.name} ({activeChat.email})
              </h2>
              <div className="h-64 overflow-y-auto bg-slate-50 p-2 mb-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`mb-2 flex ${
                      message.sender === "admin" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`rounded-lg p-2 max-w-[80%] ${
                        message.sender === "admin"
                          ? "bg-eco text-white"
                          : "bg-white shadow-sm border"
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.sender === "admin" ? "text-white/70" : "text-muted-foreground"
                        }`}
                      >
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className="flex">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  className="flex-grow"
                />
                <Button
                  onClick={handleSendMessage}
                  className="ml-2 bg-eco hover:bg-eco-dark"
                  disabled={!inputValue.trim()}
                >
                  Send
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AdminChat;