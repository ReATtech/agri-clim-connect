
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Leaf, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

type Message = {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

const initialMessages: Message[] = [
  {
    id: 1,
    text: "Bonjour ! Je suis votre assistant AgriClim. Comment puis-je vous aider aujourd'hui ?",
    sender: 'bot',
    timestamp: new Date(),
  },
];

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages([...messages, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // For now, we're using simulated responses, but this would be replaced with a real API call
      // In future we'll connect to OpenAI or another AI service through Supabase Edge Functions
      
      // Simulated AI response for agricultural queries in Cameroon
      setTimeout(() => {
        const botResponses = [
          "Les prévisions pour Yaoundé indiquent des pluies modérées cette semaine, idéal pour les semis de maïs et d'arachides.",
          "Pour améliorer vos rendements de cacao, je vous conseille d'optimiser l'ombrage et le drainage pendant cette saison des pluies.",
          "Les cultures comme le manioc et l'igname sont bien adaptées aux conditions actuelles dans l'Ouest du Cameroun.",
          "Pour lutter contre les parasites du caféier de manière écologique, vous pouvez utiliser une solution à base de neem et de piment.",
          "La rotation des cultures est essentielle pour maintenir la fertilité des sols tropicaux. Je vous suggère d'alterner légumineuses et céréales.",
        ];
        
        const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
        
        const botMessage: Message = {
          id: messages.length + 2,
          text: randomResponse,
          sender: 'bot',
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
      }, 1500);
      
    } catch (error) {
      console.error("Error getting AI response:", error);
      setIsTyping(false);
      
      // Show error message
      const errorMessage: Message = {
        id: messages.length + 2,
        text: "Désolé, je rencontre des difficultés à répondre pour le moment. Veuillez réessayer plus tard.",
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  return (
    <>
      {/* Chat button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed z-50 bottom-6 right-6 p-4 rounded-full shadow-lg transition-all duration-300 ${
          isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-agrigreen-600 hover:bg-agrigreen-700'
        }`}
      >
        {isOpen ? <X className="text-white" size={24} /> : <MessageCircle className="text-white" size={24} />}
      </button>
      
      {/* Chat window */}
      {isOpen && (
        <div className="fixed z-40 bottom-24 right-6 w-80 sm:w-96 h-96 bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden border border-agrigreen-200 animate-fade-in">
          {/* Chat header */}
          <div className="bg-agrigreen-600 text-white p-3 flex items-center">
            <Leaf size={20} className="mr-2" />
            <h3 className="font-medium">Assistant AgriClim</h3>
          </div>
          
          {/* Chat messages */}
          <div className="flex-1 p-3 overflow-y-auto bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-3 max-w-[80%] ${
                  message.sender === 'user' ? 'ml-auto' : 'mr-auto'
                }`}
              >
                <div
                  className={`p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-agrigreen-500 text-white rounded-tr-none'
                      : 'bg-gray-200 text-gray-800 rounded-tl-none'
                  }`}
                >
                  {message.text}
                </div>
                <div
                  className={`text-xs mt-1 text-gray-500 ${
                    message.sender === 'user' ? 'text-right' : 'text-left'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex items-center space-x-1 mb-3 max-w-[80%]">
                <div className="bg-gray-200 p-3 rounded-lg text-gray-800 rounded-tl-none flex">
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse mr-1"></span>
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-75 mr-1"></span>
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150"></span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Chat input */}
          <div className="p-3 border-t border-gray-200 flex">
            <Input
              type="text"
              placeholder="Posez votre question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 mr-2 focus-visible:ring-agrigreen-500"
            />
            <Button 
              onClick={handleSendMessage}
              className="bg-agrigreen-600 hover:bg-agrigreen-700"
              disabled={isTyping}
            >
              {isTyping ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send size={18} />}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
