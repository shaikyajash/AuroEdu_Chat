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
          className={`p-3 rounded-xl ${
            isUser
              ? isDarkMode 
                ? "bg-blue-900 text-white rounded-br-none"
                : "bg-blue-500 text-white rounded-br-none"
              : isDarkMode
                ? "bg-gray-800 text-gray-100 rounded-bl-none"
                : "bg-gray-200 text-gray-900 rounded-bl-none"
          }`}
        >
          <Typography className="whitespace-pre-wrap">{message.content}</Typography>
        </div>
        <Typography 
          variant="small" 
          className={`text-xs opacity-0 group-hover:opacity-100 transition-opacity ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
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
    <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-200"}`}>
      <div className="flex gap-2 items-center">
        <CommandLineIcon className={`h-5 w-5 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`} />
        <div className="flex gap-1">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${isDarkMode ? "bg-gray-400" : "bg-gray-600"} animate-bounce`}
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    addMessage({ role: "user", content: input });
    setLoading(true);
    setInput("");

    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${import.meta.env.VITE_API_KEY}`,
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "AuroEdu",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-chat-v3-0324:free",
          messages: [...messages, { role: "user", content: input }]
        })
      });

      const data = await res.json();
      const aiResponse = data.choices?.[0]?.message?.content || "No response found.";
      
      addMessage({ role: "assistant", content: aiResponse });
    } catch (error) {
      console.error("Error:", error);
      addMessage({ 
        role: "assistant", 
        content: "Sorry, I encountered an error while processing your request." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={`flex-1 h-screen overflow-hidden flex flex-col rounded-none ${
      isDarkMode ? 'bg-gray-900' : 'bg-white'
    }`}>
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <Typography
              variant="paragraph"
              className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
            >
              Start a conversation by typing a message below.
            </Typography>
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
          isDarkMode ? 'border-gray-800 bg-gray-900' : 'border-blue-gray-100 bg-white'
        }`}
      >
        <div className="flex-1 min-w-0">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className={`!border-t-blue-gray-200 focus:!border-t-gray-900 ${
              isDarkMode ? '!text-gray-100' : 'text-gray-900'
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
                className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} opacity-0 transition-opacity`}
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
            className="flex items-center gap-2 rounded-full p-3"
            color={isDarkMode ? "blue-gray" : "blue"}
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </Button>
        </Tooltip>
      </form>
    </Card>
  );
};

export default ChatComponent;
