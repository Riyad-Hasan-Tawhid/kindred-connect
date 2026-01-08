import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Smile, Image, ArrowLeft, Phone, Video, MoreVertical } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const mockConversations = [
  {
    id: 1,
    name: "Emma Watson",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    lastMessage: "That sounds amazing! 😊",
    time: "2m ago",
    unread: 2,
    online: true,
  },
  {
    id: 2,
    name: "Sophia Miller",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop",
    lastMessage: "Would love to grab coffee sometime!",
    time: "1h ago",
    unread: 0,
    online: false,
  },
  {
    id: 3,
    name: "Olivia Chen",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
    lastMessage: "Have you seen that new movie?",
    time: "3h ago",
    unread: 0,
    online: true,
  },
];

const mockMessages = [
  { id: 1, text: "Hey! How are you doing? 👋", sent: false, time: "10:30 AM" },
  { id: 2, text: "Hi! I'm great, thanks for asking! How about you?", sent: true, time: "10:32 AM" },
  { id: 3, text: "I'm doing well! Just saw your profile and loved your travel photos!", sent: false, time: "10:33 AM" },
  { id: 4, text: "Thank you! I love exploring new places. Do you travel much?", sent: true, time: "10:35 AM" },
  { id: 5, text: "Yes! I'm actually planning a trip to Japan next month", sent: false, time: "10:36 AM" },
  { id: 6, text: "That sounds amazing! 😊", sent: false, time: "10:36 AM" },
];

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  const selectedConversation = mockConversations.find(c => c.id === selectedChat);

  const handleSend = () => {
    if (message.trim()) {
      console.log("Sending:", message);
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-16 h-screen">
        <div className="container mx-auto h-[calc(100vh-4rem)] flex">
          {/* Conversations List */}
          <div className={`w-full md:w-96 border-r border-border flex flex-col ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
            <div className="p-4 border-b border-border">
              <h1 className="font-display text-2xl font-bold">Messages</h1>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {mockConversations.map((conv, index) => (
                <motion.button
                  key={conv.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedChat(conv.id)}
                  className={`w-full p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors ${
                    selectedChat === conv.id ? 'bg-muted' : ''
                  }`}
                >
                  <div className="relative">
                    <img
                      src={conv.image}
                      alt={conv.name}
                      className="w-14 h-14 rounded-xl object-cover"
                    />
                    {conv.online && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-background" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold truncate">{conv.name}</h3>
                      <span className="text-xs text-muted-foreground">{conv.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                  </div>
                  
                  {conv.unread > 0 && (
                    <span className="w-5 h-5 rounded-full bg-coral text-primary-foreground text-xs flex items-center justify-center font-medium">
                      {conv.unread}
                    </span>
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className={`flex-1 flex flex-col ${selectedChat ? 'flex' : 'hidden md:flex'}`}>
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-border flex items-center gap-4">
                  <button
                    onClick={() => setSelectedChat(null)}
                    className="md:hidden p-2 hover:bg-muted rounded-lg"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  
                  <img
                    src={selectedConversation.image}
                    alt={selectedConversation.name}
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                  
                  <div className="flex-1">
                    <h3 className="font-semibold">{selectedConversation.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedConversation.online ? "Online" : "Offline"}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Phone className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Video className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {mockMessages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.sent ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                          msg.sent
                            ? 'gradient-primary text-primary-foreground rounded-br-md'
                            : 'bg-muted rounded-bl-md'
                        }`}
                      >
                        <p>{msg.text}</p>
                        <p className={`text-xs mt-1 ${msg.sent ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                          {msg.time}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-border">
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon">
                      <Smile className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Image className="h-5 w-5" />
                    </Button>
                    <Input
                      placeholder="Type a message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      className="flex-1"
                    />
                    <Button
                      variant="hero"
                      size="icon"
                      onClick={handleSend}
                      disabled={!message.trim()}
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                    <Send className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="font-display text-xl font-bold mb-2">Your Messages</h3>
                  <p className="text-muted-foreground">
                    Select a conversation to start chatting
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Messages;
