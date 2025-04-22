import React, { useState, useEffect } from "react";
import useThemeStore from "../store/themeStore";
import ChatComponent from "../components/ChatComponent";
import Sidebar from "../components/SideBar";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";

function ChatScreen() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Prevent body scrolling when sidebar is open on mobile
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobile, sidebarOpen]);
  
  useEffect(() => {
    if (!isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  return (
    <div className={`flex h-screen w-screen overflow-hidden ${
      isDarkMode 
        ? 'bg-gradient-subtle from-secondary-900 via-secondary-800 to-secondary-900' 
        : 'bg-gradient-subtle from-primary-50 via-white to-accent-50'
    }`}>
      {isMobile && (
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`fixed top-3 ${sidebarOpen ? 'right-3' : 'left-3'} z-50 p-2 rounded-full shadow-md transition-all duration-300 ${
            isDarkMode 
              ? 'bg-gray-800 text-violet-400 hover:bg-gray-700' 
              : 'bg-white text-violet-600 hover:bg-gray-100'
          }`}
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {sidebarOpen ? (
            <XMarkIcon className="h-5 w-5" />
          ) : (
            <Bars3Icon className="h-5 w-5" />
          )}
        </button>
      )}
      
      <div className={`
        ${isMobile 
          ? `fixed inset-y-0 left-0 z-40 h-full transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0 w-[80vw]' : '-translate-x-full'}` 
          : 'relative'
        }
      `}>
        <Sidebar />
      </div>
      
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <div className={`flex-1 ${isMobile ? 'h-screen w-screen' : 'relative'}`}>
        <ChatComponent />
      </div>
    </div>
  );
}

export default ChatScreen;
