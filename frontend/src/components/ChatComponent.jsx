import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  Input,
  Button,
  Typography,
  Spinner,
  Tooltip,
} from "@material-tailwind/react";
import { 
  PaperAirplaneIcon,
  CommandLineIcon,
} from "@heroicons/react/24/solid";
import useThemeStore from "../store/themeStore";
import useChatStore from "../store/chatStore";

const formatTime = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const ChatBubble = ({ message, isDarkMode }) => {
  const isUser = message.role === "user";
  const time = message.timestamp ? formatTime(new Date(message.timestamp)) : formatTime(new Date());

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} group`}>
      <div className="flex flex-col max-w-[80%] gap-1">
        <div
          className={`p-3 rounded-2xl shadow-sm backdrop-blur-sm ${
            isUser
              ? isDarkMode 
                ? "bg-gradient-subtle from-primary-600 to-primary-700 text-white rounded-br-md" 
                : "bg-gradient-subtle from-primary-500 to-primary-600 text-white rounded-br-md"
              : isDarkMode
                ? "bg-secondary-800/80 text-secondary-100 rounded-bl-md border border-secondary-700"
                : "bg-white/80 text-secondary-900 rounded-bl-md border border-secondary-200"
          }`}
        >
          <Typography className="whitespace-pre-wrap">{message.content}</Typography>
        </div>
        <Typography 
          variant="small" 
          className={`text-xs opacity-0 group-hover:opacity-100 transition-opacity ${
            isDarkMode ? 'text-secondary-400' : 'text-secondary-500'
          }`}
        >
          {time}
        </Typography>
      </div>
    </div>
  );
};

const TypingIndicator = ({ isDarkMode }) => (
  <div className="flex justify-start">
    <div className={`p-4 rounded-2xl shadow-sm ${
      isDarkMode 
        ? "bg-secondary-800/80 border border-secondary-700" 
        : "bg-white/80 border border-secondary-200"
    }`}>
      <div className="flex gap-2 items-center">
        <CommandLineIcon className={`h-5 w-5 ${
          isDarkMode ? "text-primary-400" : "text-primary-600"
        }`} />
        <div className="flex gap-1">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${
                isDarkMode 
                  ? "bg-primary-400 animate-bounce" 
                  : "bg-primary-600 animate-bounce"
              }`}
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
  const isDarkMode = useThemeStore(state => state.isDarkMode);
  const { 
    messages, 
    loading, 
    setLoading, 
    addMessage,
    currentSessionId,
    createNewSession
  } = useChatStore();

  useEffect(() => {
    if (!currentSessionId) {
      createNewSession();
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const MAX_RETRIES = 3;
  const RETRY_DELAY = 1000; // 1 second

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const makeApiCall = async (messages, retryCount = 0) => {
    try {
      const response = await fetch("https://www.openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "AuroEdu Chat",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo",
          messages: messages.map(({ role, content }) => ({ role, content })),
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.choices?.[0]?.message?.content) {
        throw new Error('Invalid response format');
      }

      return data;
    } catch (error) {
      if (retryCount < MAX_RETRIES && (error.message.includes('ERR_NAME_NOT_RESOLVED') || error.message.includes('Failed to fetch'))) {
        console.log(`Retrying API call (${retryCount + 1}/${MAX_RETRIES})...`);
        await sleep(RETRY_DELAY * (retryCount + 1));
        return makeApiCall(messages, retryCount + 1);
      }
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    addMessage(userMessage);
    setLoading(true);
    setInput("");

    try {
      const allMessages = [...messages, userMessage];
      const data = await makeApiCall(allMessages);
      
      addMessage({ 
        role: "assistant", 
        content: data.choices[0].message.content.trim()
      });
    } catch (error) {
      console.error("Error:", error);
      let errorMessage = "An error occurred. Please try again.";
      
      if (error.message.includes('ERR_NAME_NOT_RESOLVED')) {
        errorMessage = "Network error: Unable to connect to the API. Please check your internet connection.";
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage = "Network error: Connection failed. Please check your internet connection.";
      } else if (error.message.includes('API request failed')) {
        errorMessage = `API Error: ${error.message}`;
      }

      addMessage({ 
        role: "assistant", 
        content: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={`flex-1 h-screen overflow-hidden flex flex-col rounded-none backdrop-blur-sm ${
      isDarkMode ? 'bg-secondary-900/50' : 'bg-white/50'
    }`}>
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className={`text-center p-8 rounded-2xl ${
              isDarkMode 
                ? 'bg-secondary-800/50 border border-secondary-700' 
                : 'bg-white/80 border border-secondary-200'
            }`}>
              <Typography
                variant="h5"
                className={`mb-2 ${
                  isDarkMode ? 'text-primary-300' : 'text-primary-600'
                }`}
              >
                Welcome to AuroEdu Chat
              </Typography>
              <Typography
                variant="paragraph"
                className={`${
                  isDarkMode ? 'text-secondary-400' : 'text-secondary-600'
                }`}
              >
                Start a conversation by typing a message below.
              </Typography>
            </div>
          </div>
        )}
        {messages.map((message, index) => (
          <ChatBubble key={index} message={message} isDarkMode={isDarkMode} />
        ))}
        {loading && <TypingIndicator isDarkMode={isDarkMode} />}
        <div ref={messagesEndRef} />
      </div>

      <form 
        onSubmit={handleSubmit} 
        className={`flex gap-2 p-4 border-t relative z-10 ${
          isDarkMode 
            ? 'border-secondary-800 bg-secondary-900/90' 
            : 'border-secondary-200 bg-white/90'
        }`}
      >
        <div className="flex-1 min-w-0">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className={`!border-t-blue-gray-200 focus:!border-t-gray-900 ${
              isDarkMode 
                ? '!text-secondary-100 !border-secondary-700' 
                : 'text-secondary-900'
            }`}
            labelProps={{
              className: "hidden",
            }}
            containerProps={{
              className: "min-w-0 !mt-0",
            }}
            icon={
              <Typography 
                variant="small" 
                className={`${
                  isDarkMode ? 'text-secondary-400' : 'text-secondary-600'
                } opacity-0 transition-opacity`}
                style={{ opacity: input.length > 0 ? 1 : 0 }}
              >
                Press Enter ↵
              </Typography>
            }
          />
        </div>
        <Tooltip content="Send message">
          <Button 
            type="submit"
            disabled={loading || !input.trim()}
            className={`flex items-center gap-2 rounded-full p-3 ${
              isDarkMode
                ? 'bg-gradient-subtle from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600'
                : 'bg-gradient-subtle from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500'
            }`}
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </Button>
        </Tooltip>
      </form>
    </Card>
  );
};

export default ChatComponent;
