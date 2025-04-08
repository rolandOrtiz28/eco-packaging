import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { submitChat } from "@/utils/api";

function ChatWidget() {
  const [chatState, setChatState] = useState("closed");
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const messagesEndRef = useRef(null);

  const initialMessage = {
    id: 1,
    text: "Hi there! 👋 I'm EcoBuddy, your AI assistant. How can I help you today?",
    sender: "bot",
    timestamp: new Date(),
  };

  useEffect(() => {
    if (chatState === "open" && messages.length === 0) {
      setMessages([initialMessage]);
    }
  }, [chatState]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const toggleChat = () => {
    if (chatState === "closed") {
      setChatState("open");
    } else if (chatState === "open" || chatState === "collecting-info") {
      setChatState("minimized");
    } else {
      setChatState("open");
    }
  };

  const closeChat = () => {
    setChatState("closed");
    setMessages([]);
    setInputValue("");
  };

  const handleSubmitInfo = (e) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim()) {
      toast.error("Please provide both name and email");
      return;
    }
    
    if (!email.includes('@') || !email.includes('.')) {
      toast.error("Please provide a valid email address");
      return;
    }
    
    setChatState("open");
    toast.success("Information submitted successfully!");
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    
    const lowercaseInput = inputValue.toLowerCase();
    if (
      lowercaseInput.includes("human") || 
      lowercaseInput.includes("agent") || 
      lowercaseInput.includes("person") ||
      lowercaseInput.includes("representative") ||
      lowercaseInput.includes("support")
    ) {
      setTimeout(() => {
        const botResponse = {
          id: messages.length + 2,
          text: "I'll connect you with a human representative. Someone from our team will reach out to you shortly via email.",
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botResponse]);
        
        try {
          submitChat({
            name,
            email,
            message: inputValue,
            requestHuman: true
          });
          toast.success("Your request has been sent to our team!");
        } catch (error) {
          console.error("Error submitting chat for human follow-up:", error);
        }
      }, 1000);
      return;
    }
    
    setTimeout(() => {
      const botResponses = [
        "Thanks for your message! We specialize in eco-friendly packaging solutions for businesses of all sizes.",
        "Our non-woven bags are made from sustainable materials and are both durable and environmentally friendly.",
        "You can browse our retail products or request a bulk quote for larger orders. Is there something specific you're looking for?",
        "We offer custom printing and branding options for all our packaging products.",
        "For more detailed information, you might want to check our product catalog or contact our sales team."
      ];
      
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      
      const botMessage = {
        id: messages.length + 2,
        text: randomResponse,
        sender: "bot",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botMessage]);
      
      try {
        submitChat({
          name,
          email,
          message: inputValue,
          requestHuman: false
        });
      } catch (error) {
        console.error("Error submitting chat:", error);
      }
    }, 1000);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-eco text-white flex items-center justify-center shadow-lg hover:bg-eco-dark transition-all duration-300"
        aria-label="Chat with us"
      >
        <MessageSquare size={24} />
      </button>

      {chatState !== "closed" && (
        <div 
          className={`fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white rounded-xl shadow-xl transition-all duration-300 flex flex-col overflow-hidden ${
            chatState === "minimized" ? "h-14" : "h-[500px]"
          }`}
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
                onClick={toggleChat} 
                className="text-white/80 hover:text-white" 
                aria-label="Minimize chat"
              >
                {chatState === "minimized" ? (
                  <MessageSquare size={18} />
                ) : (
                  <span className="text-xl leading-none">−</span>
                )}
              </button>
              <button 
                onClick={closeChat} 
                className="text-white/80 hover:text-white" 
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {chatState !== "minimized" && (
            <>
              {chatState === "collecting-info" ? (
                <div className="flex-grow p-4 flex flex-col">
                  <p className="text-center mb-4 text-sm text-muted-foreground">
                    Please provide your information to start the chat
                  </p>
                  <form onSubmit={handleSubmitInfo} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-1">
                        Name
                      </label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-1">
                        Email
                      </label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-eco hover:bg-eco-dark">
                      Start Chat
                    </Button>
                  </form>
                </div>
              ) : (
                <>
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
                          <p className="text-sm">{message.text}</p>
                          <p
                            className={`text-xs mt-1 ${
                              message.sender === "user" ? "text-white/70" : "text-muted-foreground"
                            }`}
                          >
                            {message.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                  <div className="p-4 border-t">
                    <div className="flex">
                      <Textarea
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your message..."
                        className="min-h-[44px] resize-none"
                        rows={1}
                      />
                      <Button
                        onClick={handleSendMessage}
                        className="ml-2 h-[44px] w-[44px] p-0 bg-eco hover:bg-eco-dark"
                        disabled={!inputValue.trim()}
                      >
                        <Send size={18} />
                      </Button>
                    </div>
                    <p className="text-xs text-center mt-2 text-muted-foreground">
                      Type "talk to human" to connect with our support team
                    </p>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
}

export default ChatWidget;