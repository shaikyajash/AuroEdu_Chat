import React from "react";
import Sidebar from "../components/Sidebar";
import useThemeStore from "../store/themeStore";
import ChatComponent from "../components/ChatComponent";

function ChatScreen() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  return (
    
      <div className={`flex min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
        <Sidebar />
        <ChatComponent />
      </div>
  );
}

export default ChatScreen;
