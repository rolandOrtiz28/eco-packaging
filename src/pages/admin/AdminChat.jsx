import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { submitChat } from "@/utils/api";
import { useAuth } from "@/hooks/useAuth";
import io from 'socket.io-client';
import axios from 'axios';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { FiSend, FiUser, FiMessageSquare, FiAlertCircle } from "react-icons/fi";

function AdminChat() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [registeredChats, setRegisteredChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [notifications, setNotifications] = useState({});
  const [isConnectedToChat, setIsConnectedToChat] = useState(false);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const { user, isAuthenticated, isAdmin, loading } = useAuth();

  const API_BASE_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:3000"
      : "https://your-production-url.com";

  useEffect(() => {
    socketRef.current = io(API_BASE_URL, {
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current.on('connect', () => {
      console.log('Admin: Socket connected:', socketRef.current.id);
      if (isAdminLoggedIn) {
        socketRef.current.emit('admin-login');
      }
    });

    socketRef.current.on('reconnect', () => {
      console.log('Admin: Socket reconnected:', socketRef.current.id);
      if (isAdminLoggedIn) {
        socketRef.current.emit('admin-login');
      }
      if (activeChat) {
        socketRef.current.emit('join-room', activeChat.userId);
      }
    });

    socketRef.current.on('reconnect_error', () => {
      console.log('Admin: Socket reconnect error');
      toast.error("Connection lost. Trying to reconnect...");
    });

    socketRef.current.on('new-chat', (data) => {
      console.log('Admin: New chat received:', data);
      setRegisteredChats((prev) => {
        if (!prev.some((chat) => chat.userId === data.userId)) {
          return [...prev, { userId: data.userId, name: data.name, email: data.email, socketId: data.socketId }];
        }
        return prev;
      });
      toast.info(`New chat request from ${data.name}`);
    });

    socketRef.current.on('chat-request', (data) => {
      console.log('Admin: Chat request received:', data);
      setRegisteredChats((prev) => {
        if (!prev.some((chat) => chat.userId === data.userId)) {
          return [...prev, { userId: data.userId, name: data.name, email: data.email, socketId: data.socketId }];
        }
        return prev;
      });
      setNotifications((prev) => ({ ...prev, [data.userId]: (prev[data.userId] || 0) + 1 }));
      toast.info(`Chat request from ${data.name}`);
    });

    socketRef.current.on('chat-notification', (data) => {
      console.log('Admin: Chat notification received:', data);
      setNotifications((prev) => ({ ...prev, [data.userId]: (prev[data.userId] || 0) + 1 }));
    });

    socketRef.current.on('message', (data) => {
      console.log('Admin: Message received from server:', data);
      console.log('Admin: Current activeChat:', activeChat);
      if (activeChat && data.userId === activeChat.userId) {
        console.log('Admin: Message matches active chat, updating messages');
        setMessages((prev) => {
          const isDuplicate = prev.some(
            (msg) => msg.text === data.text && msg.sender === data.sender && msg.timestamp === data.timestamp
          );
          if (!isDuplicate) {
            return [...prev, {
              id: prev.length + 1,
              text: data.text,
              sender: data.sender,
              name: data.name || (data.sender === "user" ? activeChat.name : data.sender === "admin" ? "Admin" : "EcoBuddy"),
              timestamp: data.timestamp || new Date().toISOString(),
            }];
          }
          console.log('Admin: Message is a duplicate, skipping');
          return prev;
        });
      } else {
        console.log('Admin: Message does not match active chat, adding notification');
        setNotifications((prev) => ({ ...prev, [data.userId]: (prev[data.userId] || 0) + 1 }));
        toast.info(`New message from ${data.name || 'user'}`);
      }
    });

    return () => {
      console.log('Admin: Disconnecting socket');
      socketRef.current.disconnect();
    };
  }, [isAdminLoggedIn, activeChat]);

  useEffect(() => {
    if (loading) return;

    if (isAuthenticated && user && isAdmin) {
      setIsAdminLoggedIn(true);
      socketRef.current.emit('admin-login');
      loadRegisteredChats();
    } else {
      setIsAdminLoggedIn(false);
    }
  }, [loading, isAuthenticated, user, isAdmin]);

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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleOpenChat = async (chat) => {
    setActiveChat(chat);
    setIsConnectedToChat(false);
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
        name: msg.sender === "admin" ? "Admin" : (msg.sender === "user" ? chat.name : "EcoBuddy"),
        timestamp: msg.timestamp ? new Date(msg.timestamp).toISOString() : new Date().toISOString(),
      }));
      setMessages(formattedHistory);
    } catch (error) {
      console.error("Error loading chat history:", error);
      setMessages([]);
      toast.error("Failed to load chat history.");
    }

    socketRef.current.emit('join-room', chat.userId);
  };

  const handleConnectToChat = () => {
    if (!activeChat) return;

    socketRef.current.emit('accept-chat', {
      userId: activeChat.userId,
    });
    setIsConnectedToChat(true);
    toast.success(`Connected to ${activeChat.name}'s chat`);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const adminMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: "admin",
      name: "Admin",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, adminMessage]);
    socketRef.current.emit('admin-message', {
      userId: activeChat.userId,
      message: inputValue,
      sender: "admin",
      name: "Admin",
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-eco"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-eco-paper">
      {/* Sidebar */}
      <Card className="w-full sm:w-64 border-eco-light">
        <CardHeader className="p-4 border-b border-eco-light">
          <div className="flex items-center gap-2">
            <FiMessageSquare className="text-eco h-5 w-5" />
            <h1 className="text-lg font-heading text-eco-dark">Admin Chat</h1>
          </div>
          <p className="text-xs text-muted-foreground">
            {registeredChats.length} active chats
          </p>
        </CardHeader>
        <CardContent className="p-0">
          {!isAdminLoggedIn ? (
            <div className="p-4 text-center">
              <p className="text-sm text-muted-foreground">Please login as admin</p>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-100px)]">
              {registeredChats.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground text-sm">
                  No active chats
                </div>
              ) : (
                <div className="divide-y divide-eco-light">
                  {registeredChats.map((chat) => (
                    <div
                      key={chat.userId}
                      className={`p-3 hover:bg-eco-light cursor-pointer transition-colors ${
                        activeChat?.userId === chat.userId ? "bg-eco-light" : ""
                      }`}
                      onClick={() => handleOpenChat(chat)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-eco-light text-eco-dark text-sm">
                              {chat.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-eco-dark">{chat.name}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[120px]">
                              {chat.email}
                            </p>
                          </div>
                        </div>
                        {notifications[chat.userId] > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {notifications[chat.userId]}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {!activeChat ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-md p-6">
              <FiMessageSquare className="mx-auto h-10 w-10 text-eco-dark" />
              <h3 className="mt-2 text-base font-heading text-eco-dark">
                No chat selected
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Select a chat from the sidebar to start messaging
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="border-b border-eco-light p-3 bg-eco-paper">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-eco-light text-eco-dark text-sm">
                      {activeChat.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-sm font-heading text-eco-dark">{activeChat.name}</h2>
                    <p className="text-xs text-muted-foreground">
                      {activeChat.email}
                    </p>
                  </div>
                </div>
                {!isConnectedToChat && (
                  <Button
                    onClick={handleConnectToChat}
                    className="bg-eco hover:bg-eco-dark text-white h-8 text-sm"
                  >
                    Connect to Chat
                  </Button>
                )}
              </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4 bg-eco-paper">
              <div className="space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "admin" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-md px-3 py-2 text-sm ${
                        message.sender === "admin"
                          ? "bg-eco text-white rounded-tr-none"
                          : "bg-white border border-eco-light rounded-tl-none"
                      }`}
                    >
                      <p className="text-xs text-muted-foreground">{message.name}</p>
                      <p className="text-sm">{message.text}</p>
                      <p
                        className={`text-xs mt-1 text-right ${
                          message.sender === "admin" ? "text-white/80" : "text-muted-foreground"
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
            </ScrollArea>

            {/* Message Input */}
            <div className="border-t border-eco-light p-3 bg-eco-paper">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  className="flex-1 h-8 text-sm border-eco-light"
                  disabled={!isConnectedToChat}
                />
                <Button
                  onClick={handleSendMessage}
                  className="bg-eco hover:bg-eco-dark text-white h-8 w-8 p-0"
                  disabled={!inputValue.trim() || !isConnectedToChat}
                >
                  <FiSend className="h-4 w-4" />
                </Button>
              </div>
              {!isConnectedToChat && (
                <div className="mt-2 flex items-center text-xs text-yellow-600">
                  <FiAlertCircle className="mr-1 h-4 w-4" />
                  <span>You need to connect to the chat before sending messages</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminChat;