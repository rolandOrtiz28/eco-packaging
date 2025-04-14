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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function AdminChat() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [registeredChats, setRegisteredChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [notifications, setNotifications] = useState({});
  const [isConnectedToChat, setIsConnectedToChat] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [connectedAdmins, setConnectedAdmins] = useState([]);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const { user, isAuthenticated, isAdmin, loading } = useAuth();

  const API_BASE_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:3000"
      : "https://bagstoryapi.editedgemultimedia.com";

  useEffect(() => {
    socketRef.current = io(API_BASE_URL, {
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current.on('connect', () => {
      console.debug('AdminChat: Socket connected', { socketId: socketRef.current.id });
      if (isAdminLoggedIn) {
        socketRef.current.emit('admin-login');
      }
    });

    socketRef.current.on('reconnect', () => {
      console.debug('AdminChat: Socket reconnected', { socketId: socketRef.current.id });
      if (isAdminLoggedIn) {
        socketRef.current.emit('admin-login');
      }
      if (activeChat) {
        socketRef.current.emit('join-room', activeChat.userId);
      }
    });

    socketRef.current.on('reconnect_error', () => {
      console.debug('AdminChat: Socket reconnect error');
      toast.error("Connection lost. Trying to reconnect...");
    });

    socketRef.current.on('new-chat', (data) => {
      console.debug('AdminChat: New chat received', data);
      setRegisteredChats((prev) => {
        if (!prev.some((chat) => chat.userId === data.userId)) {
          return [...prev, { userId: data.userId, name: data.name, email: data.email, socketId: data.socketId }];
        }
        return prev;
      });
      toast.info(`New chat request from ${data.name}`);
    });

    socketRef.current.on('chat-request', (data) => {
      console.debug('AdminChat: Chat request received', data);
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
      console.debug('AdminChat: Chat notification received', data);
      setNotifications((prev) => ({ ...prev, [data.userId]: (prev[data.userId] || 0) + 1 }));
    });

    socketRef.current.on('message', (data) => {
      console.debug('AdminChat: Message received', data);
      if (activeChat && data.userId === activeChat.userId) {
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
          console.debug('AdminChat: Skipping duplicate message');
          return prev;
        });
      } else {
        setNotifications((prev) => ({ ...prev, [data.userId]: (prev[data.userId] || 0) + 1 }));
        toast.info(`New message from ${data.name || 'user'}`);
      }
    });

    socketRef.current.on('admin-muted', (data) => {
      console.debug('AdminChat: Received admin-muted event', data);
      if (activeChat && data.userId === activeChat.userId) {
        setIsMuted(true);
        toast.warning("You have been muted in this chat.");
      }
    });

    socketRef.current.on('admin-unmuted', (data) => {
      console.debug('AdminChat: Received admin-unmuted event', data);
      if (activeChat && data.userId === activeChat.userId) {
        setIsMuted(false);
        toast.success("You have been unmuted in this chat.");
      }
    });

    socketRef.current.on('admin-removed', (data) => {
      console.debug('AdminChat: Received admin-removed event', data);
      if (activeChat && data.userId === activeChat.userId) {
        setActiveChat(null);
        setMessages([]);
        setIsConnectedToChat(false);
        setIsMuted(false);
        toast.error("You have been removed from this chat.");
      }
    });

    socketRef.current.on('admin-status-updated', (data) => {
      console.debug('AdminChat: Received admin-status-updated event', data);
      if (activeChat && data.userId === activeChat.userId) {
        setConnectedAdmins((prev) => {
          const updated = [...prev];
          const index = updated.findIndex((admin) => admin.socketId === data.adminSocketId);
          if (index >= 0) {
            if (data.action === 'remove') {
              updated.splice(index, 1);
            } else if (data.action === 'mute') {
              updated[index] = { ...updated[index], muted: true };
            } else if (data.action === 'unmute') {
              updated[index] = { ...updated[index], muted: false };
            }
          }
          return updated;
        });
        toast.info(`Admin ${data.action}d in this chat.`);
      }
    });

    socketRef.current.on('message-blocked', (data) => {
      console.debug('AdminChat: Received message-blocked event', data);
      toast.error(data.message);
    });

    return () => {
      console.debug('AdminChat: Disconnecting socket');
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
      console.debug('AdminChat: Loading registered chats');
      const response = await axios.get(`${API_BASE_URL}/api/chat/all`, { withCredentials: true });
      setRegisteredChats(response.data.map(chat => ({
        userId: chat.userId,
        name: chat.name,
        email: chat.email,
        socketId: null,
      })));
      console.debug('AdminChat: Chats loaded', { count: response.data.length });
    } catch (error) {
      console.error('AdminChat: Error loading chats', { error: error.message });
      toast.error("Failed to load chat list.");
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleOpenChat = async (chat) => {
    console.debug('AdminChat: Opening chat', { userId: chat.userId });
    setActiveChat(chat);
    setIsConnectedToChat(false);
    setIsMuted(false);
    setNotifications((prev) => {
      const newNotifications = { ...prev };
      delete newNotifications[chat.userId];
      return newNotifications;
    });

    try {
      console.debug('AdminChat: Fetching chat history', { email: chat.email });
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
      console.debug('AdminChat: Chat history loaded', { userId: chat.userId, messageCount: formattedHistory.length });

      setConnectedAdmins([{ socketId: socketRef.current.id, name: user.name, muted: false }]);
    } catch (error) {
      console.error('AdminChat: Error loading chat history', { error: error.message });
      setMessages([]);
      toast.error("Failed to load chat history.");
    }

    socketRef.current.emit('join-room', chat.userId);
  };

  const handleConnectToChat = () => {
    if (!activeChat) return;

    console.debug('AdminChat: Connecting to chat', { userId: activeChat.userId });
    socketRef.current.emit('accept-chat', {
      userId: activeChat.userId,
    });
    setIsConnectedToChat(true);
    setConnectedAdmins((prev) => [...prev, { socketId: socketRef.current.id, name: user.name, muted: false }]);
    toast.success(`Connected to ${activeChat.name}'s chat`);
  };

  const handleManageAdmin = async (adminSocketId, action) => {
    if (!activeChat || adminSocketId === socketRef.current.id) {
      console.debug('AdminChat: Invalid manage admin attempt', { adminSocketId, currentSocketId: socketRef.current.id });
      toast.error("Cannot perform this action on yourself.");
      return;
    }

    try {
      console.debug('AdminChat: Managing admin', { userId: activeChat.userId, adminSocketId, action });
      const response = await axios.post(
        `${API_BASE_URL}/api/chat/manage-admin`,
        {
          userId: activeChat.userId,
          adminSocketId,
          action,
        },
        { withCredentials: true }
      );
      console.debug('AdminChat: Manage admin successful', { response: response.data });
      toast.success(response.data.message);
    } catch (error) {
      console.error('AdminChat: Error managing admin', { error: error.message });
      toast.error("Failed to perform admin action.");
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) {
      console.debug('AdminChat: Empty message ignored');
      return;
    }

    console.debug('AdminChat: Sending admin message', { userId: activeChat.userId, message: inputValue });
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
      console.debug('AdminChat: Admin message saved via API');
    } catch (error) {
      console.error('AdminChat: Error saving admin message', { error: error.message });
      toast.error("Failed to send message.");
    }

    setInputValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      console.debug('AdminChat: Enter key pressed');
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
                <div className="flex items-center gap-2">
                  {isConnectedToChat && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="h-8 text-sm">
                          Manage Admins
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {connectedAdmins.map((admin) => (
                          <div key={admin.socketId}>
                            <DropdownMenuItem disabled className="font-medium">
                              {admin.name} {admin.muted && "(Muted)"}
                            </DropdownMenuItem>
                            {admin.socketId !== socketRef.current.id && (
                              <>
                                <DropdownMenuItem
                                  onClick={() => handleManageAdmin(admin.socketId, admin.muted ? 'unmute' : 'mute')}
                                >
                                  {admin.muted ? 'Unmute' : 'Mute'}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleManageAdmin(admin.socketId, 'remove')}
                                >
                                  Remove
                                </DropdownMenuItem>
                              </>
                            )}
                          </div>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
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
                  disabled={!isConnectedToChat || isMuted}
                />
                <Button
                  onClick={handleSendMessage}
                  className="bg-eco hover:bg-eco-dark text-white h-8 w-8 p-0"
                  disabled={!inputValue.trim() || !isConnectedToChat || isMuted}
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
              {isMuted && (
                <div className="mt-2 flex items-center text-xs text-red-600">
                  <FiAlertCircle className="mr-1 h-4 w-4" />
                  <span>You are muted and cannot send messages</span>
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