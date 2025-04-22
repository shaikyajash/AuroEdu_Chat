import React, { useState, useEffect, useRef } from "react";
import {
  PaperAirplaneIcon,
  CommandLineIcon,
} from "@heroicons/react/24/solid";
import useThemeStore from "../store/themeStore";
import useChatStore from "../store/chatStore";
import axios from "axios";
import axiosRetry from "axios-retry";

// Configure axios retry
axiosRetry(axios, {
  retries: 3,
  retryDelay: (retryCount) => retryCount * 1000,
  retryCondition: (error) => axiosRetry.isNetworkOrIdempotentRequestError(error),
});

// Create a cancelable axios instance
const axiosInstance = axios.create();

const formatTime = (date) => {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const ChatBubble = ({ message, isDarkMode }) => {
  const isUser = message.role === "user";
  const time = message.timestamp
    ? formatTime(new Date(message.timestamp))
    : formatTime(new Date());

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} group`}>
      <div className="flex flex-col max-w-[80%] gap-1">
        <div
          className={`p-3 rounded-xl shadow-sm ${
            isUser
              ? isDarkMode
                ? "bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-br-none"
                : "bg-gradient-to-br from-violet-500 to-indigo-500 text-white rounded-br-none"
              : isDarkMode
              ? "bg-gray-800 text-gray-100 rounded-bl-none border border-gray-700"
              : "bg-white text-gray-800 rounded-bl-none border border-gray-100 shadow-sm"
          }`}
        >
          <p className="whitespace-pre-wrap">
            {message.content}
          </p>
        </div>
        <p
          className={`text-xs opacity-0 group-hover:opacity-100 transition-opacity ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {time}
        </p>
      </div>
    </div>
  );
};

const TypingIndicator = ({ isDarkMode }) => (
  <div className="flex justify-start">
    <div
      className={`p-3 rounded-lg ${
        isDarkMode 
          ? "bg-gray-800 border border-gray-700" 
          : "bg-white border border-gray-100 shadow-sm"
      }`}
    >
      <div className="flex gap-2 items-center">
        <CommandLineIcon
          className={`h-4 w-4 ${
            isDarkMode ? "text-violet-400" : "text-violet-500"
          }`}
        />
        <div className="flex gap-1">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${
                isDarkMode 
                  ? "bg-violet-400" 
                  : "bg-violet-500"
              } animate-bounce`}
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
  const messagesEndRef = useRef(null);
  const abortControllerRef = useRef(null);
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const {
    messages,
    loading,
    setLoading,
    addMessage,
    currentSessionId,
    createNewSession,
  } = useChatStore();
  const [apiError, setApiError] = useState(false);

  // Create new session if none exists
  useEffect(() => {
    if (!currentSessionId) {
      createNewSession();
    }
    
    // Clean up function
    return () => {
      // Cancel any pending requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      // Reset loading state
      setLoading(false);
    };
  }, [currentSessionId, createNewSession, setLoading]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Debug logging for loading state
  useEffect(() => {
    console.log("Loading state:", loading);
  }, [loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    // Cancel previous request if exists
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
      const res = await axiosInstance.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "deepseek/deepseek-chat-v3-0324:free",
          messages: [...messages, { role: "user", content: input }],
        },
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY || ''}`,
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "AuroEdu",
            "Content-Type": "application/json",
          },
          signal: abortControllerRef.current.signal,
        }
      );

      // Check for valid response
      if (res.data && res.data.choices && res.data.choices.length > 0) {
        const aiResponse = res.data.choices[0].message?.content || "No response found.";
        addMessage({ role: "assistant", content: aiResponse });
      } else {
        throw new Error("Invalid API response format");
      }
    } catch (error) {
      // Only add error message if request wasn't cancelled
      if (!axios.isCancel(error)) {
        console.error("API Error:", error.message);
        setApiError(true);
        addMessage({
          role: "assistant",
          content: "Sorry, I encountered an error while processing your request. Please check your API key and try again."
        });
      }
    } finally {
      // Reset loading state and controller
      setLoading(false);
      abortControllerRef.current = null;
    }
  };

  return (
    <div
      className={`flex-1 h-screen overflow-hidden flex flex-col ${
        isDarkMode 
          ? "bg-gray-900 bg-gradient-to-br from-gray-900 to-gray-800" 
          : "bg-gray-50 bg-gradient-to-br from-gray-50 to-white"
      }`}
    >
      {/* API Error Banner */}
      {apiError && (
        <div className="bg-red-500 text-white px-4 py-2 text-sm shadow-md">
          API error occurred. Please check your console and verify your API key is correct.
        </div>
      )}
      
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto mb-2 space-y-6 p-4 md:p-6">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md mx-auto">
              <div className={`mb-4 text-5xl ${isDarkMode ? "text-violet-400" : "text-violet-500"}`}>💬</div>
              <p className={`text-lg font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                Start a conversation
              </p>
              <p className={`${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                Type a message below to begin chatting with the AI assistant.
              </p>
            </div>
          </div>
        )}
        
        {messages.map((message, index) => (
          <ChatBubble key={index} message={message} isDarkMode={isDarkMode} />
        ))}
        
        {loading && <TypingIndicator isDarkMode={isDarkMode} />}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Form */}
      <div
        className={`px-4 py-3 border-t relative z-10 ${
          isDarkMode
            ? "border-gray-800 bg-gray-900/70 backdrop-blur-sm" 
            : "border-gray-200 bg-white/70 backdrop-blur-sm shadow-sm"
        }`}
      >
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-4xl mx-auto">
          <div className="flex-1 min-w-0 relative">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className={`w-full px-4 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                isDarkMode 
                  ? "bg-gray-800 text-gray-100 border-gray-700 focus:ring-violet-500 placeholder-gray-500"
                  : "bg-white text-gray-900 border-gray-200 focus:ring-violet-500 placeholder-gray-400"
              }`}
            />
            {input.length > 0 && (
              <span
                className={`absolute right-4 bottom-3 text-xs ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                } transition-opacity`}
              >
                Press Enter ↵
              </span>
            )}
          </div>
          
          {/* Send Button */}
          <div className="relative group">
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className={`flex items-center justify-center p-3 rounded-full w-12 h-12 transition-all transform active:scale-95 ${
                loading || !input.trim()
                  ? isDarkMode
                    ? "bg-gray-700 cursor-not-allowed text-gray-500"
                    : "bg-gray-200 cursor-not-allowed text-gray-400"
                  : isDarkMode
                  ? "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-md"
                  : "bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-400 hover:to-indigo-400 text-white shadow-md"
              }`}
            >
              <PaperAirplaneIcon className="h-5 w-5" />
            </button>
            <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap">
              Send message
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatComponent;
