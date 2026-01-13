import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, Pencil, AlertCircle } from 'lucide-react';
import { ChatMessage } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const API_KEY = "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";

const SYSTEM_PROMPT = `You are a friendly and helpful AI assistant for Akshay Krishnan's portfolio. 
        
About Akshay:
- Creative Product Designer specializing in Canvas interactions, React, and Framer Motion.
- Experience in SaaS (Gravity One), E-Commerce (Velvet), and Data Viz (EcoTrack).
- Loves creating high-fidelity whiteboard collaboration simulations.

Your Tone:
- Casual, enthusiastic, and professional.
- Keep answers concise and engaging.
- Act like you are chatting on a collaborative whiteboard.`;

export const ChatPanel: React.FC<Props> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
        setTimeout(scrollToBottom, 100);
    }
  }, [messages, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userText,
      createdAt: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setError(false);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: userText }
          ],
          stream: true
        })
      });

      if (!response.ok) throw new Error('Failed to fetch from OpenAI');

      // Create a placeholder for the AI response
      const assistantId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, {
        id: assistantId,
        role: 'assistant',
        content: '',
        createdAt: Date.now()
      }]);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ') && line !== 'data: [DONE]') {
              try {
                const data = JSON.parse(line.slice(6));
                const content = data.choices[0]?.delta?.content || '';
                assistantContent += content;
                
                setMessages(prev => prev.map(m => 
                  m.id === assistantId ? { ...m, content: assistantContent } : m
                ));
              } catch (e) {
                // Ignore parse errors for partial chunks
              }
            }
          }
        }
      }

    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-[60]"
          />

          {/* Side Panel - Positioned on Right */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-[400px] z-[70] shadow-2xl flex flex-col"
            style={{
              backgroundColor: '#fafafa',
              backgroundImage: 'linear-gradient(#e5e7eb 1px, transparent 1px)',
              backgroundSize: '100% 2rem'
            }}
          >
            {/* Dashed Border Decoration */}
            <div className="absolute left-0 top-0 bottom-0 w-[2px] border-l-2 border-dashed border-gray-400 pointer-events-none" />

            {/* Header */}
            <div className="p-6 flex items-center justify-between bg-white/80 backdrop-blur-sm border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-yellow-300 rounded-md border border-gray-800 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                   <Sparkles size={18} className="text-gray-900" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-800 text-lg leading-none">Ask Assistant</h2>
                  <span className="text-xs text-gray-500 font-hand">Powered by OpenAI</span>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              
              {/* Static Welcome Message */}
              <div className="flex justify-start">
                 <div className="relative max-w-[85%] group">
                    <div className="absolute -left-3 -top-3 text-blue-400 transform -rotate-12">
                        <Pencil size={16} fill="#A6E3E9" />
                    </div>
                    <div className="p-4 shadow-sm border border-gray-300/50 text-sm leading-relaxed bg-[#E0F7FA] -rotate-1 font-hand text-lg text-gray-700 rounded-bl-none" style={{ boxShadow: '4px 4px 0px rgba(0,0,0,0.05)' }}>
                      <p className="whitespace-pre-wrap">Hi! I'm the AI Assistant. Ask me anything about Akshay's work, experience, or resume.</p>
                    </div>
                 </div>
              </div>

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {/* Message Bubble */}
                  <div className="relative max-w-[85%] group">
                    {/* Visual Anchor/Pin for AI */}
                    {msg.role === 'assistant' && (
                      <div className="absolute -left-3 -top-3 text-blue-400 transform -rotate-12">
                        <Pencil size={16} fill="#A6E3E9" />
                      </div>
                    )}

                    <div
                      className={`
                        p-4 shadow-sm border border-gray-300/50 text-sm leading-relaxed
                        ${msg.role === 'user' 
                          ? 'bg-[#FFF9B1] rotate-1 font-sans text-gray-800 rounded-br-none' // User: Yellow Sticky, Clean Font
                          : 'bg-[#E0F7FA] -rotate-1 font-hand text-lg text-gray-700 rounded-bl-none' // AI: Blue Sticky, Handwritten
                        }
                      `}
                      style={{
                        boxShadow: '4px 4px 0px rgba(0,0,0,0.05)'
                      }}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
                <div className="flex justify-start">
                  <div className="bg-[#E0F7FA] p-3 px-6 -rotate-1 font-hand text-gray-500 rounded-lg shadow-sm animate-pulse">
                    Writing...
                  </div>
                </div>
              )}
              
              {error && (
                 <div className="flex justify-center">
                    <div className="bg-red-50 text-red-500 px-4 py-2 rounded-lg text-xs flex items-center gap-2">
                        <AlertCircle size={14} />
                        <span>Could not connect to AI. Check Internet or Key.</span>
                    </div>
                 </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white/80 border-t border-gray-200">
              <form 
                onSubmit={handleSubmit}
                className="relative flex items-center"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about my experience..."
                  disabled={isLoading}
                  className="w-full bg-white border-2 border-gray-200 rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:border-[#2D9BF0] focus:ring-4 focus:ring-blue-50 transition-all font-medium text-gray-700 placeholder-gray-400 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 p-2 bg-[#2D9BF0] text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={16} />
                </button>
              </form>
              <div className="text-center mt-2">
                <span className="text-[10px] text-gray-400 font-medium">
                  AI can make mistakes. Check important info.
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};