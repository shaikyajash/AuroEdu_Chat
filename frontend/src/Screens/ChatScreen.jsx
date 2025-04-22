import React from "react";
import useThemeStore from "../store/themeStore";
import ChatComponent from "../components/ChatComponent";
import Sidebar from "../components/SideBar";

function ChatScreen() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  return (
    <div className={`flex min-h-screen ${
      isDarkMode 
        ? 'bg-gradient-subtle from-secondary-900 via-secondary-800 to-secondary-900' 
        : 'bg-gradient-subtle from-primary-50 via-white to-accent-50'
    }`}>
      <Sidebar/>
      <ChatComponent />
    </div>
  );
}

export default ChatScreen;
