'use client';

import { useState, useEffect } from 'react';
import { useWalletStore } from '@/lib/store';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Send, User, MessageSquare, Loader2, Search, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface Message {
  id: string;
  sender: string;
  recipient: string;
  content: string;
  timestamp: number;
  read: boolean;
}

export default function MessagesPage() {
  const { address } = useWalletStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (address) {
      fetchMessages();
    }
  }, [address]);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/messages?address=${address}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (e) {
      toast.error("Failed to load messages");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: address,
          recipient: selectedChat,
          content: newMessage
        })
      });

      if (res.ok) {
        const sentMsg = await res.json();
        setMessages([...messages, sentMsg]);
        setNewMessage('');
        toast.success("Message sent!");
      }
    } catch (e) {
      toast.error("Failed to send message");
    }
  };

  if (!address) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-32 text-center">
          <MessageSquare className="w-16 h-16 text-stacks-orange mx-auto mb-6 opacity-20" />
          <h1 className="text-3xl font-bold mb-4">Your Inbox</h1>
          <p className="text-white/40 mb-8">Connect your wallet to message creators and discuss premium content.</p>
        </div>
      </div>
    );
  }

  const chats = Array.from(new Set(messages.map(m => m.sender === address ? m.recipient : m.sender)));
  const currentChatMessages = messages.filter(m => m.sender === selectedChat || m.recipient === selectedChat);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex gap-6 h-[calc(100vh-160px)]">
        {/* Chat List */}
        <div className="w-80 flex-shrink-0 glass rounded-2xl border border-white/10 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-white/10 bg-white/[0.02]">
            <h2 className="font-bold text-lg mb-4">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input 
                type="text" 
                placeholder="Search chats..."
                className="w-full h-10 pl-9 pr-4 bg-white/5 border border-white/10 rounded-xl text-xs outline-none focus:border-stacks-orange/50"
              />
            </div>
          </div>
          <div className="flex-grow overflow-y-auto p-2 space-y-1">
            {chats.map(chatAddr => (
              <button
                key={chatAddr}
                onClick={() => setSelectedChat(chatAddr)}
                className={`w-full p-4 rounded-xl flex items-center gap-3 transition-all ${selectedChat === chatAddr ? 'bg-stacks-orange text-white' : 'hover:bg-white/5 text-white/60 hover:text-white'}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedChat === chatAddr ? 'bg-white/20' : 'bg-stacks-orange/10'}`}>
                  <User className="w-5 h-5" />
                </div>
                <div className="text-left min-w-0">
                  <div className="text-sm font-bold truncate">{chatAddr.slice(0, 12)}...</div>
                  <div className={`text-[10px] ${selectedChat === chatAddr ? 'text-white/70' : 'text-white/30'}`}>Click to view chat</div>
                </div>
              </button>
            ))}
            {chats.length === 0 && !isLoading && (
              <div className="text-center py-20 text-white/20 text-xs italic">No active conversations</div>
            )}
            {isLoading && (
              <div className="flex justify-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-stacks-orange" />
              </div>
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-grow glass rounded-2xl border border-white/10 flex flex-col overflow-hidden">
          {selectedChat ? (
            <>
              <div className="p-4 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-stacks-orange/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-stacks-orange" />
                  </div>
                  <div>
                    <div className="font-bold text-sm">{selectedChat}</div>
                    <div className="text-[10px] text-green-500 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      Online
                    </div>
                  </div>
                </div>
                <button className="p-2 rounded-lg hover:bg-red-500/10 text-white/20 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-6 space-y-6">
                {currentChatMessages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex ${msg.sender === address ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] p-4 rounded-2xl ${msg.sender === address ? 'bg-stacks-orange text-white rounded-tr-none' : 'bg-white/5 border border-white/10 text-white rounded-tl-none'}`}>
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                      <div className={`text-[9px] mt-2 ${msg.sender === address ? 'text-white/60' : 'text-white/30'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-white/[0.02] border-t border-white/10">
                <div className="relative">
                  <input 
                    type="text" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-4 pr-12 text-sm outline-none focus:border-stacks-orange/50 transition-colors"
                  />
                  <button 
                    onClick={handleSendMessage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-stacks-orange flex items-center justify-center text-white hover:bg-orange-600 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-12">
              <div className="w-20 h-20 rounded-3xl bg-stacks-orange/5 border border-stacks-orange/10 flex items-center justify-center mb-6">
                <MessageSquare className="w-10 h-10 text-stacks-orange/20" />
              </div>
              <h3 className="text-xl font-bold mb-2">Select a conversation</h3>
              <p className="text-white/40 max-w-xs text-sm">Pick a creator from the left to start discussing their exclusive content.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
