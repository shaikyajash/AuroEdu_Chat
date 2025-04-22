import React, { useState, useEffect, useRef } from "react";
import { PaperAirplaneIcon, CommandLineIcon } from "@heroicons/react/24/solid";
import useThemeStore from "../store/themeStore";
import useChatStore from "../store/chatStore";
import axios from "axios";

// Simple chat bubble component
const ChatBubble = ({ message, isDarkMode }) => {
  const isUser = message.role === "user";
  
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} group`}>
      <div className="flex flex-col max-w-[80%] gap-1">
        <div
          className={`p-3 rounded-xl shadow-sm ${
            isUser
              ? isDarkMode
                ? "bg-violet-600 text-white rounded-br-none"
                : "bg-violet-500 text-white rounded-br-none"
              : isDarkMode
              ? "bg-gray-800 text-gray-100 rounded-bl-none border border-gray-700"
              : "bg-white text-gray-800 rounded-bl-none border border-gray-100"
          }`}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    </div>
  );
};

// Simple typing indicator
const TypingIndicator = ({ isDarkMode }) => (
  <div className="flex justify-start">
    <div className={`p-3 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
      <div className="flex gap-2 items-center">
        <CommandLineIcon className={`h-4 w-4 ${isDarkMode ? "text-violet-400" : "text-violet-500"}`} />
        <div className="flex gap-1">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${isDarkMode ? "bg-violet-400" : "bg-violet-500"} animate-bounce`}
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  </div>
);

const ChatComponent = () => {
  const [input, setInput] = useState("");
  const [apiError, setApiError] = useState(false);
  const messagesEndRef = useRef(null);
  const abortControllerRef = useRef(null);
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const { messages, loading, setLoading, addMessage, currentSessionId, createNewSession } = useChatStore();

  // Create new session if needed and ensure cleanup
  useEffect(() => {
    if (!currentSessionId) createNewSession();
    
    return () => {
      // Make sure loading is reset when component unmounts
      setLoading(false);
      // Abort any pending requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [currentSessionId, createNewSession, setLoading]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Forced reset of loading state after timeout
  useEffect(() => {
    let timer;
    if (loading) {
      // If loading persists for more than 20 seconds, force reset
      timer = setTimeout(() => {
        console.log("Force resetting loading state after timeout");
        setLoading(false);
      }, 20000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [loading, setLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    // Abort previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create new abort controller
    abortControllerRef.current = new AbortController();

    // Add user message
    addMessage({ role: "user", content: input });
    setLoading(true);
    setInput("");
    setApiError(false);

    try {
      console.log("Sending request to API with input:", input);
      const res = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "deepseek/deepseek-chat-v3-0324:free", // Make sure this model exists
          messages: [...messages, { role: "user", content: input }],
          temperature: 0.7,
          max_tokens: 1000
        },
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY || ''}`,
            "HTTP-Referer": window.location.href,
            "X-Title": "AuroEdu",
            "Content-Type": "application/json",
          },
          signal: abortControllerRef.current.signal,
          timeout: 30000 // Increase timeout to 30 seconds
        }
      );

      console.log("API Response:", res.data);

      // More detailed response validation
      if (res.data && res.data.choices && Array.isArray(res.data.choices) && res.data.choices.length > 0) {
        const aiMessage = res.data.choices[0].message;
        if (aiMessage && typeof aiMessage.content === 'string') {
          addMessage({ 
            role: "assistant", 
            content: aiMessage.content 
          });
        } else {
          console.error("Invalid message format in API response:", aiMessage);
          throw new Error("Invalid message format in response");
        }
      } else {
        console.error("Invalid API response structure:", res.data);
        throw new Error("Invalid API response structure");
      }
    } catch (error) {
      // Only add error message if request wasn't cancelled
      if (!axios.isCancel(error)) {
        console.error("API Error:", error.message, error.response?.data);
        setApiError(true);
        
        // Show more specific error message
        let errorMessage = "Sorry, I encountered an error. Please check your API key and try again.";
        if (error.response?.status === 401 || error.response?.status === 403) {
          errorMessage = "Authentication error. Please check your API key.";
        } else if (error.response?.status === 429) {
          errorMessage = "Rate limit exceeded. Please try again in a few moments.";
        } else if (error.message.includes("timeout")) {
          errorMessage = "Request timed out. The server took too long to respond.";
        }
        
        addMessage({
          role: "assistant",
          content: errorMessage
        });
      }
    } finally {
      // Always reset loading and abort controller
      setLoading(false);
      abortControllerRef.current = null;
    }
  };

  // Reset loading button function for emergencies
  const resetLoadingState = () => {
    setLoading(false);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  return (
    <div className={`flex flex-col h-full overflow-hidden ${
      isDarkMode ? "bg-gray-900" : "bg-gray-50"
    }`}>
      {/* Error notification - subtle and non-intrusive */}
      {apiError && (
        <div className="bg-red-500/80 text-white px-4 py-2 text-sm shadow-md flex justify-between items-center">
          <span>API connection error. Please check your API key.</span>
          <button 
            onClick={() => setApiError(false)} 
            className="text-white hover:text-gray-200"
          >
            ✕
          </button>
        </div>
      )}
      
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto mb-2 space-y-4 p-4 md:p-6 relative">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md">
              <div className={`mb-4 text-5xl ${isDarkMode ? "text-violet-400" : "text-violet-500"}`}>💬</div>
              <p className={`text-lg font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                Start a conversation
              </p>
            </div>
          </div>
        )}
        
        {messages.map((message, index) => (
          <ChatBubble key={index} message={message} isDarkMode={isDarkMode} />
        ))}
        
        {loading && <TypingIndicator isDarkMode={isDarkMode} />}
        
        <div ref={messagesEndRef} />
        
        {/* Subtle loading reset option - small, non-intrusive button */}
        {loading && (
          <div className="absolute bottom-2 right-2">
            <button 
              onClick={resetLoadingState}
              className={`text-xs px-2 py-1 rounded ${
                isDarkMode ? "bg-gray-800 text-gray-400" : "bg-gray-200 text-gray-600"
              } opacity-70 hover:opacity-100 transition-opacity`}
            >
              Reset
            </button>
          </div>
        )}
      </div>

      {/* Message Input Form */}
      <div className={`px-4 py-3 border-t ${
        isDarkMode ? "border-gray-800 bg-gray-900/90" : "border-gray-200 bg-white/90"
      } backdrop-blur-sm`}>
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-4xl mx-auto">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className={`flex-1 px-4 py-3 rounded-full focus:outline-none focus:ring-2 ${
              isDarkMode 
                ? "bg-gray-800 text-gray-100 border border-gray-700 focus:ring-violet-500/50" 
                : "bg-white text-gray-900 border border-gray-200 focus:ring-violet-500/50"
            }`}
          />
          
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className={`p-3 rounded-full w-12 h-12 flex items-center justify-center transition-all ${
              loading || !input.trim()
                ? isDarkMode ? "bg-gray-700 text-gray-500" : "bg-gray-200 text-gray-400"
                : isDarkMode ? "bg-violet-600 text-white" : "bg-violet-500 text-white"
            }`}
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-t-transparent rounded-full animate-spin" />
            ) : (
              <PaperAirplaneIcon className="h-5 w-5" />
            )}
          </button>
        </form>
        
        {/* Loading status indicator - subtle and unobtrusive */}
        {loading && (
          <div className={`text-center text-xs mt-1 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
            AI is responding...
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatComponent;
