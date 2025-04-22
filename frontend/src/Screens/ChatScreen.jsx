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
    <div className={`fixed inset-x-0 top-16 bottom-0 md:flex ${
      isDarkMode ? "bg-slate-900 text-white" : "bg-gray-50 text-slate-800"
    }`}>
      {isMobile && (
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`fixed top-20 ${sidebarOpen ? 'right-3' : 'left-3'} z-40 p-2 rounded-full shadow-md transition-all duration-300 ${
            isDarkMode 
              ? 'bg-slate-800 text-teal-400 hover:bg-slate-700' 
              : 'bg-white text-teal-600 hover:bg-gray-100'
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
          ? `fixed inset-y-16 left-0 z-30 h-[calc(100%-64px)] transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0 w-[80vw]' : '-translate-x-full'}` 
          : 'w-1/4 max-w-xs'
        }
      `}>
        <Sidebar />
      </div>
      
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 top-16 bg-black opacity-50 z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <div className="flex-1 overflow-hidden h-full">
        <ChatComponent />
      </div>
    </div>
  );
}

export default ChatScreen;
