'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Cpu, ShieldCheck } from 'lucide-react';

// Component for the AI Typing Indicator
const TypingIndicator = () => (
  <div className="flex items-center space-x-1 p-3 bg-gray-800 text-white border border-gray-700 rounded-2xl rounded-tl-lg shadow-md max-w-[80%] md:max-w-[70%]">
    <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
    <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
    <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
  </div>
);

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  // 🔑 Ref for the flexible textarea
  const textareaRef = useRef(null); 

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll to bottom whenever messages change
  useEffect(scrollToBottom, [messages]);

  // 🔑 Effect to resize the textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to collapse it if content shrinks
      textarea.style.height = 'auto'; 
      // Set the height to fit the content, respecting max height set by CSS
      textarea.style.height = `${textarea.scrollHeight}px`; 
    }
  }, [input]); // Recalculate height whenever input state changes

  async function handleSubmit(e) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage]; 
    
    setMessages(newMessages); 
    setInput('');
    setIsLoading(true);

    try {
        // --- 🔑 Actual API Call to your /api/chat route ---
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: newMessages }), 
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `API error: ${response.statusText}`);
        }

        const data = await response.json();
        const aiMessage = data.message;
        
        setMessages((prev) => [...prev, aiMessage]);
        // ---------------------------------------------------

    } catch (error) {
        console.error("Chat API error:", error);
        setMessages((prev) => [
            ...prev,
            { role: 'assistant', content: `Sorry, there was an issue connecting. Error: ${error.message}` },
        ]);
    } finally {
        setIsLoading(false);
    }
  }

  // Allow submission on Enter key, but only create a newline on Shift+Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent default newline behavior
      handleSubmit(e);
    }
  };

  // Placeholder for custom Tailwind scrollbar utility
  const scrollbarClasses = 'scrollbar-thin scrollbar-thumb-teal-400 scrollbar-track-gray-800';


  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white font-sans">
      {/* Header */}
      <header className="bg-gray-900/90 backdrop-blur-md border-b border-gray-800 sticky top-0 z-20 shadow-lg">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-teal-400 to-green-500 bg-clip-text text-transparent">
            ZERO-TRACE AI Chat
          </h1>
          <div className='flex items-center gap-2 text-sm text-gray-400 font-medium px-3 py-1 bg-gray-800 rounded-full shadow-inner'>
            <ShieldCheck size={16} className='text-teal-400' />
            100% Private Session
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <div 
        className={`flex-1 overflow-y-auto px-4 md:px-8 py-6 max-w-5xl mx-auto w-full space-y-6 ${scrollbarClasses}`}
      >
        {messages.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl font-medium"
            >
              <Cpu className="w-10 h-10 mx-auto text-teal-400 mb-4" />
              Start your first truly private conversation!
            </motion.div>
          </div>
        )}

        <AnimatePresence>
          {messages.map((m, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex items-start gap-3 max-w-[80%] md:max-w-[70%]`}
              >
                {/* AI Avatar/Icon (Teal/Green) */}
                {m.role !== 'user' && (
                    <Bot size={20} className="mt-1 text-teal-400 flex-shrink-0" />
                )}
                
                <div
                  className={`p-4 rounded-3xl shadow-lg transition leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-teal-600 text-white rounded-br-lg' 
                      : 'bg-gray-800 text-gray-200 border border-gray-700 rounded-tl-lg' 
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>
                </div>

                {/* User Avatar/Icon (Teal/Green) */}
                {m.role === 'user' && (
                    <User size={20} className="mt-1 text-teal-600 flex-shrink-0" />
                )}
              </div>
            </motion.div>
          ))}
          
          {/* AI Typing Indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <TypingIndicator />
            </div>
          )}
          
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Footer / Input Box (Now using Textarea) */}
      <footer className="sticky bottom-0 bg-gray-900/90 backdrop-blur-md border-t border-gray-800 shadow-2xl">
        <form
          onSubmit={handleSubmit}
          className="max-w-5xl mx-auto flex items-end gap-3 p-4">
          {/* 🔑 Flexible Textarea */}
          <textarea
            ref={textareaRef}
            rows={1} // Start with a single row
            className="flex-1 resize-none overflow-hidden max-h-40 px-5 py-3 rounded-2xl border border-gray-700 bg-gray-800 text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none shadow-inner transition-all disabled:bg-gray-700 disabled:text-gray-500"
            placeholder={isLoading ? 'The AI is thinking...' : 'Type your message (Shift+Enter for new line)...'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown} // Handle Enter key submission
            disabled={isLoading}
          />
          {/* End Flexible Textarea */}

          <button
            type="submit"
            disabled={isLoading || !input.trim()} 
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-semibold text-gray-900 transition-all shadow-lg ${
              (isLoading || !input.trim())
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-teal-400 to-green-500 hover:shadow-teal-500/50 hover:scale-[1.02]' 
            }`}
          >
            <Send size={18} />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </footer>
    </div>
  );
}