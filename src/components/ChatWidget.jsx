import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { submitChat } from "@/utils/api";
import { useAuth } from "@/hooks/useAuth";
import io from 'socket.io-client';
import axios from 'axios';

function ChatWidget() {
  const [chatState, setChatState] = useState(() => {
    return localStorage.getItem("chatState") === "open" ? "open" : "closed";
  });
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    const savedTimestamp = localStorage.getItem("chatTimestamp");
  
    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;
  
    if (!savedMessages || (savedTimestamp && now - parseInt(savedTimestamp, 10) > twentyFourHours)) {
      // Guest chat expired or no messages
      localStorage.removeItem("chatMessages");
      localStorage.removeItem("chatTimestamp");
      return [];
    }
  
    return JSON.parse(savedMessages);
  });
  const [inputValue, setInputValue] = useState("");
  const [name, setName] = useState(() => localStorage.getItem("chatName") || "");
  const [email, setEmail] = useState(() => localStorage.getItem("chatEmail") || "");
  const [awaitingHuman, setAwaitingHuman] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isHumanConnected, setIsHumanConnected] = useState(false);
  const [showInfoForm, setShowInfoForm] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isFirstMessage, setIsFirstMessage] = useState(true);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const adminTimeoutRef = useRef(null);
  const messageIdCounter = useRef(0);
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [isSubmittingInfo, setIsSubmittingInfo] = useState(false);

  const API_BASE_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:3000"
      : "https://your-production-url.com";

  const initialMessage = {
    id: messageIdCounter.current++,
    text: "Hi there! 👋 I'm EcoBuddy, your AI assistant. How can I help you today?",
    sender: "bot",
    name: "EcoBuddy",
    timestamp: new Date().toISOString(),
  };
  
  const infoRequestMessage = {
    id: messageIdCounter.current++,
    text: "Since you're not logged in, please provide your name and email to continue.",
    sender: "bot",
    name: "EcoBuddy",
    timestamp: new Date().toISOString(),
  };
  
  const timeoutMessage = {
    id: messageIdCounter.current++,
    text: "Sorry, our team is currently unavailable. We’ll follow up with you via email soon!",
    sender: "bot",
    name: "EcoBuddy",
    timestamp: new Date().toISOString(),
  };

  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
    if (!isAuthenticated) {
      localStorage.setItem("chatTimestamp", Date.now().toString());
    }
  }, [messages, isAuthenticated]);

  useEffect(() => {
    if (name) localStorage.setItem("chatName", name);
    if (email) localStorage.setItem("chatEmail", email);
  }, [name, email]);

  useEffect(() => {
    socketRef.current = io(API_BASE_URL, {
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    socketRef.current.on('reconnect', () => {
      console.log('Reconnected to Socket.IO server');
    });

    socketRef.current.on('reconnect_error', () => {
      console.log('Reconnection failed');
      toast.error("Connection lost. Please try again later.");
      closeChat();
    });

    socketRef.current.on('awaiting-human', (data) => {
      console.log('Received awaiting-human event:', data);
      setAwaitingHuman(true);
      setMessages((prev) => [
        ...prev,
        {
          id: messageIdCounter.current++,
          text: data.message,
          sender: "bot",
          name: "EcoBuddy",
          timestamp: new Date().toISOString(),
        },
      ]);
    });

    socketRef.current.on('no-admins', (data) => {
      console.log('Received no-admins event:', data);
      setAwaitingHuman(false);
      setIsFirstMessage(true);
      setMessages((prev) => [
        ...prev,
        {
          id: messageIdCounter.current++,
          text: data.message,
          sender: "bot",
          name: "EcoBuddy",
          timestamp: new Date().toISOString(),
        },
      ]);
    });

    socketRef.current.on('human-connected', (data) => {
      console.log('Received human-connected event:', data);
      setAwaitingHuman(false);
      setIsHumanConnected(true);
      setMessages((prev) => [
        ...prev,
        {
          id: messageIdCounter.current++,
          text: data.message,
          sender: "bot",
          name: "EcoBuddy",
          timestamp: new Date().toISOString(),
        },
      ]);
    });

    socketRef.current.on('inactivity-disconnect', (data) => {
      console.log('Received inactivity-disconnect event:', data);
      setIsHumanConnected(false);
      setAwaitingHuman(false);
      setIsFirstMessage(true);
      setMessages((prev) => {
        if (prev.some(msg => msg.text === data.message && msg.sender === "bot")) {
          return prev;
        }
        return [
          ...prev,
          {
            id: messageIdCounter.current++,
            text: data.message,
            sender: "bot",
            timestamp: new Date().toISOString(),
          },
        ];
      });
    });

    socketRef.current.on('message', (data) => {
      console.log('Received message from server:', data);
      setMessages((prev) => {
        const lastMessage = prev[prev.length - 1];
        const isDuplicate =
          lastMessage &&
          lastMessage.text === data.text &&
          lastMessage.sender === data.sender &&
          lastMessage.name === (data.sender === "admin" ? "Admin" : (data.sender === "user" ? name : "EcoBuddy"));

        if (isDuplicate) {
          console.log('Skipping duplicate message from Socket.IO');
          return prev;
        }

        return [
          ...prev,
          {
            id: messageIdCounter.current++,
            text: data.text,
            sender: data.sender,
            name: data.sender === "admin" ? "Admin" : (data.sender === "user" ? name : "EcoBuddy"),
            timestamp: data.timestamp || new Date().toISOString(),
          },
        ];
      });
    });

    return () => {
      socketRef.current.off('connect');
      socketRef.current.off('reconnect');
      socketRef.current.off('reconnect_error');
      socketRef.current.off('awaiting-human');
      socketRef.current.off('no-admins');
      socketRef.current.off('human-connected');
      socketRef.current.off('inactivity-disconnect');
      socketRef.current.off('message');
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (userId && socketRef.current) {
      console.log(`Joining room for userId: ${userId}`);
      socketRef.current.emit('join-room', userId);
      return () => {
        console.log(`Leaving room for userId: ${userId}`);
        socketRef.current.emit('leave-room', userId);
      };
    }
  }, [userId]);

  useEffect(() => {
    if (authLoading) {
      setIsLoadingUser(true);
      return;
    }

    if (isAuthenticated && user) {
      setName(user.name);
      setEmail(user.email);
      localStorage.setItem("chatName", user.name);
      localStorage.setItem("chatEmail", user.email);
    } else {
      setName("");
      setEmail("");
      setMessages([]);
      setUserId(null);
      setAwaitingHuman(false);
      setIsHumanConnected(false);
      setIsFirstMessage(true);
      localStorage.removeItem("chatName");
      localStorage.removeItem("chatEmail");
      localStorage.removeItem("chatMessages");
      localStorage.removeItem("chatState");
      setChatState("closed");
    }

    setIsLoadingUser(false);
  }, [authLoading, isAuthenticated, user]);

  useEffect(() => {
    if (chatState === "open") {
      if (!isAuthenticated) {
        const storedName = localStorage.getItem("chatName");
        const storedEmail = localStorage.getItem("chatEmail");
  
        setName(storedName || "");
        setEmail(storedEmail || "");
  
        const shouldShowForm = !storedName || !storedEmail;
  
        setMessages((prev) => prev.length === 0 ? [initialMessage, ...(shouldShowForm ? [infoRequestMessage] : [])] : prev);
        setShowInfoForm(shouldShowForm);
      } else {
        setMessages((prev) => prev.length === 0 ? [initialMessage] : prev);
        setShowInfoForm(false);
      }
  
      setIsFirstMessage(true);
    }
  }, [chatState, isAuthenticated, isLoadingUser]);

  useEffect(() => {
    if (isAuthenticated && user && email && email !== user.email) {
      const updateChatSession = async () => {
        try {
          await axios.put(`${API_BASE_URL}/api/chat/update-email`, {
            oldEmail: email,
            newEmail: user.email,
          }, { withCredentials: true });
          setEmail(user.email);
          setName(user.name);
          localStorage.setItem("chatName", user.name);
          localStorage.setItem("chatEmail", user.email);
          setUserId(null);
          socketRef.current.emit('leave-room', userId);
          setMessages([initialMessage]);
          setIsFirstMessage(true);
          toast.success("Chat session updated with your account information.");
        } catch (error) {
          console.error("Error updating chat session email:", error);
          setEmail(user.email);
          setName(user.name);
          localStorage.setItem("chatName", user.name);
          localStorage.setItem("chatEmail", user.email);
          setUserId(null);
          socketRef.current.emit('leave-room', userId);
          setMessages([initialMessage]);
          setIsFirstMessage(true);
          toast.error("Failed to update chat session with your account information. Starting a new session.");
        }
      };
      updateChatSession();
    }
  }, [isAuthenticated, user, email]);

  useEffect(() => {
    console.log(`awaitingHuman: ${awaitingHuman}, isHumanConnected: ${isHumanConnected}`);
    if (awaitingHuman && !isHumanConnected) {
      console.log('Starting 1-minute timeout for admin connection');
      adminTimeoutRef.current = setTimeout(() => {
        console.log('1-minute timeout triggered: No admin connected');
        setAwaitingHuman(false);
        setMessages((prev) => [...prev, timeoutMessage]);
      }, 60000);
    }

    return () => {
      if (adminTimeoutRef.current) {
        console.log('Clearing admin connection timeout');
        clearTimeout(adminTimeoutRef.current);
      }
    };
  }, [awaitingHuman, isHumanConnected]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const toggleChat = () => {
    setChatState(chatState === "closed" ? "open" : "closed");
  };

  const closeChat = () => {
    setChatState("closed");
    setInputValue("");
    setUserId(null);
    setAwaitingHuman(false);
    setIsHumanConnected(false);
    setShowInfoForm(false);
    setIsFirstMessage(true);
    socketRef.current.emit('leave-room', userId);
  
    if (adminTimeoutRef.current) {
      clearTimeout(adminTimeoutRef.current);
    }
  };

  const handleSubmitInfo = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      toast.error("Please provide both name and email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please provide a valid email address");
      return;
    }
    setIsSubmittingInfo(true);
    try {
      await submitChat({
        name,
        email,
        message: "User provided contact information",
      });
      toast.success("Information submitted successfully!");
      setShowInfoForm(false);
      setMessages([initialMessage]);
      setIsFirstMessage(true);
      localStorage.setItem("chatName", name);
      localStorage.setItem("chatEmail", email);
    } catch (error) {
      console.error("Error saving user info:", error);
      toast.error("Failed to save your information. Please try again.");
    }finally {
      setIsSubmittingInfo(false); 
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
  
    if (!isAuthenticated && (!name || !email)) {
      toast.error("Please provide your name and email before sending a message.");
      setShowInfoForm(true);
      return;
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!isAuthenticated && !emailRegex.test(email)) {
      toast.error("Invalid email address. Please provide a valid email.");
      setShowInfoForm(true);
      return;
    }
  
    const userMessage = {
      id: messageIdCounter.current++,
      text: inputValue,
      sender: "user",
      name: name || "User",
      timestamp: new Date().toISOString(),
    };
  
    console.log("Client: Sending message", {
      message: inputValue,
      userId: userId,
      isHumanConnected: isHumanConnected,
      awaitingHuman: awaitingHuman,
    });
  
    setInputValue("");
  
    // Only show the message immediately if there's no human admin connected
    if (!isHumanConnected) {
      setMessages((prev) => [...prev, userMessage]);
    }
  
    try {
      if (inputValue.toLowerCase().includes('talk to human') || awaitingHuman) {
        const response = await submitChat({
          name,
          email,
          message: inputValue,
        });
  
        if (!response) throw new Error('No response from server');
  
        setUserId(response.userId);
        socketRef.current.emit('join-room', response.userId);
        socketRef.current.emit('request-human', {
          userId: response.userId,
          name,
          email,
          message: inputValue,
        });
        setAwaitingHuman(true);
      } else if (isHumanConnected) {
        // Send message to admin only
        socketRef.current.emit('user-message', {
          userId: userId,
          message: inputValue,
          sender: "user",
          name: name,
          timestamp: userMessage.timestamp,
        });
      } else {
        // Get AI response
        const response = await submitChat({
          name,
          email,
          message: inputValue,
        });
  
        if (!response) throw new Error('No response from server');
  
        setUserId(response.userId);
        socketRef.current.emit('join-room', response.userId);
  
        if (isFirstMessage) {
          setMessages((prev) => [
            ...prev,
            {
              id: messageIdCounter.current++,
              text: response.message,
              sender: "bot",
              name: "EcoBuddy",
              timestamp: new Date().toISOString(),
            },
          ]);
          setIsFirstMessage(false);
        }
      }
    } catch (error) {
      console.error("Client: Error submitting chat:", error);
      toast.error("Failed to send message. Please try again.");
      setMessages((prev) => [
        ...prev,
        {
          id: messageIdCounter.current++,
          text: "Sorry, there was an error processing your message. Please try again.",
          sender: "bot",
          name: "EcoBuddy",
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  };
  

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (showInfoForm) {
        handleSubmitInfo(e);
      } else {
        handleSendMessage();
      }
    }
  };

  useEffect(() => {
    localStorage.setItem("chatState", chatState);
  }, [chatState]);

  return (
    <>
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-eco text-white flex items-center justify-center shadow-lg hover:bg-eco-dark transition-all duration-300"
        aria-label="Chat with us"
      >
        <MessageSquare size={24} />
      </button>

      {chatState === "open" && (
        <div
          className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white rounded-xl shadow-xl transition-all duration-300 flex flex-col overflow-hidden h-[650px]"
        >
          <div className="bg-eco text-white p-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-eco font-bold text-sm">E</span>
              </div>
              <div>
                <h3 className="font-medium">Eco Packaging Assistant</h3>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={closeChat}
                className="text-white/80 hover:text-white"
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="flex-grow p-4 overflow-y-auto bg-slate-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`rounded-lg p-3 max-w-[80%] ${
                    message.sender === "user"
                      ? "bg-eco text-white"
                      : "bg-white shadow-sm border"
                  }`}
                >
                  <p
                    className={`text-xs font-semibold ${
                      message.sender === "user" ? "text-white/70" : "text-muted-foreground"
                    }`}
                  >
                    {message.name}
                  </p>
                  <p className="text-sm">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === "user" ? "text-white/70" : "text-muted-foreground"
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
            {showInfoForm && !isAuthenticated && (
              <div className="mb-4 flex justify-start">
                <div className="bg-white shadow-sm border rounded-lg p-3 max-w-[80%]">
                  <form onSubmit={handleSubmitInfo} className="space-y-4">
                    <div>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        required
                        className="w-full border-gray-300"
                      />
                    </div>
                    <div>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your email"
                        required
                        className="w-full border-gray-300"
                      />
                    </div>
                    <Button
  type="submit"
  className="w-full bg-eco hover:bg-eco-dark"
  disabled={isSubmittingInfo}
>
  {isSubmittingInfo ? (
    <Loader2 className="animate-spin w-4 h-4 mx-auto" />
  ) : (
    "Submit"
  )}
</Button>
                  </form>
                </div>
              </div>
            )}
            {awaitingHuman && !isHumanConnected && (
              <div className="flex justify-center mb-4">
                <Loader2 className="animate-spin text-eco" size={24} />
                <p className="ml-2 text-sm text-muted-foreground">
                  Waiting for a human agent...
                </p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          {!showInfoForm && (
            <div className="p-4 border-t">
              <div className="flex">
                <Textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  className="min-h-[44px] resize-none"
                  rows={1}
                  disabled={(awaitingHuman && !isHumanConnected) || isLoadingUser || (!isAuthenticated && showInfoForm)}
                />
                <Button
                  onClick={handleSendMessage}
                  className="ml-2 h-[44px] w-[44px] p-0 bg-eco hover:bg-eco-dark"
                  disabled={(!inputValue.trim() || (awaitingHuman && !isHumanConnected) || isLoadingUser || (!isAuthenticated && showInfoForm))}
                >
                  <Send size={18} />
                </Button>
              </div>
              <p className="text-xs text-center mt-2 text-muted-foreground">
                Type "talk to human" to connect with our support team
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default ChatWidget;