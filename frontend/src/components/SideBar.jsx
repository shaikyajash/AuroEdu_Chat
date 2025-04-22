import React, { useState } from "react";
import {
  ChatBubbleLeftRightIcon,
  SunIcon,
  MoonIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import useThemeStore from "../store/themeStore";
import useChatStore from "../store/chatStore";

const Sidebar = () => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState(null);
  
  const isDarkMode = useThemeStore(state => state.isDarkMode);
  const toggleTheme = useThemeStore(state => state.toggleTheme);
  const { 
    chatSessions, 
    currentSessionId, 
    createNewSession, 
    switchSession,
    deleteSession,
  } = useChatStore();

  const handleDelete = (e, sessionId) => {
    e.stopPropagation();
    setSessionToDelete(sessionId);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (sessionToDelete) {
      deleteSession(sessionToDelete);
    }
    setShowDeleteDialog(false);
    setSessionToDelete(null);
  };

  const getLastMessage = (messages) => {
    if (!messages || messages.length === 0) return "No messages";
    
    const lastMsg = messages[messages.length - 1];
    // Check if content exists before trying to access it
    if (!lastMsg || !lastMsg.content) return "Empty message";
    
    const content = lastMsg.content.slice(0, 30) + (lastMsg.content.length > 30 ? "..." : "");
    return content;
  };

  return (
    <>
      <div className={`h-screen w-80 p-0 shadow-xl rounded-none backdrop-blur-sm ${
        isDarkMode 
          ? 'bg-slate-900/90 text-slate-100 border-r border-slate-800' 
          : 'bg-white/90 text-slate-900 border-r border-gray-100'
      }`}>
        {/* Header */}
        <div className={`p-5 ${
          isDarkMode 
            ? 'bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-800' 
            : 'bg-gradient-to-r from-white to-gray-50 border-b border-gray-100'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h4 className={`font-bold text-xl ${
              isDarkMode ? 'bg-gradient-to-r from-blue-400 to-blue-300 text-transparent bg-clip-text' : 'bg-gradient-to-r from-blue-600 to-blue-500 text-transparent bg-clip-text'
            }`}>
              AuroEdu
            </h4>
            <div className="relative group">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full transition-colors ${
                  isDarkMode 
                    ? 'bg-slate-800 hover:bg-slate-700 text-blue-400' 
                    : 'bg-gray-100 hover:bg-gray-200 text-blue-600'
                }`}
              >
                {isDarkMode ? (
                  <SunIcon className="h-5 w-5" />
                ) : (
                  <MoonIcon className="h-5 w-5" />
                )}
              </button>
              <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap">
                {isDarkMode ? "Light mode" : "Dark mode"}
              </span>
            </div>
          </div>
          <button
            className={`flex items-center justify-center gap-2 w-full py-3 px-4 rounded-full shadow-sm ${
              isDarkMode 
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white' 
                : 'bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-400 hover:to-blue-300 text-white'
            } transition-all transform active:scale-[0.98]`}
            onClick={createNewSession}
          >
            <PlusIcon className="h-4 w-4" />
            New Chat
          </button>
        </div>

        {/* Chat List */}
        <div className={`overflow-y-auto p-3 flex-1 ${
          isDarkMode ? 'text-slate-300' : 'text-slate-700'
        }`}>
          {chatSessions.map((session) => (
            <div
              key={session.id}
              onClick={() => switchSession(session.id)}
              className={`group mb-2 p-3 cursor-pointer transition-all duration-200 rounded-xl ${
                isDarkMode 
                  ? 'hover:bg-slate-800/70' 
                  : 'hover:bg-gray-100/70'
              } ${
                currentSessionId === session.id 
                  ? isDarkMode 
                    ? 'bg-slate-800 border border-slate-700 shadow-sm'
                    : 'bg-gray-100 border border-gray-200 shadow-sm'
                  : ''
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`p-2 rounded-lg ${
                    isDarkMode 
                      ? currentSessionId === session.id
                        ? 'bg-blue-900/50 text-blue-300'
                        : 'bg-slate-800 text-slate-400'
                      : currentSessionId === session.id
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-200 text-gray-500'
                  }`}>
                    <ChatBubbleLeftRightIcon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium truncate ${
                      currentSessionId === session.id
                        ? isDarkMode 
                          ? 'text-blue-300'
                          : 'text-blue-700'
                        : ''
                    }`}>
                      {session.name}
                    </p>
                    <p
                      className={`text-sm truncate ${
                        isDarkMode ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      {getLastMessage(session.messages)}
                    </p>
                  </div>
                </div>
                <div className={`opacity-0 group-hover:opacity-100 transition-opacity`}>
                  <button
                    className={`p-1.5 rounded-full ${
                      isDarkMode 
                        ? 'hover:bg-slate-700 text-slate-400 hover:text-red-400' 
                        : 'hover:bg-gray-200 text-gray-400 hover:text-red-500'
                    } transition-colors`}
                    onClick={(e) => handleDelete(e, session.id)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {chatSessions.length === 0 && (
            <div className="flex flex-col items-center justify-center h-32 p-6">
              <p
                className={`text-center text-sm ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                No chat sessions yet
              </p>
              <p
                className={`text-center text-sm ${
                  isDarkMode ? 'text-slate-500' : 'text-slate-500'
                }`}
              >
                Click the New Chat button to start
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className={`p-6 rounded-xl shadow-lg max-w-sm w-full ${
            isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white'
          }`}>
            <h3 className={`text-lg font-semibold mb-2 ${
              isDarkMode ? 'text-slate-100' : 'text-slate-900'
            }`}>
              Delete Chat
            </h3>
            <p className={isDarkMode ? 'text-slate-400 mb-6' : 'text-slate-600 mb-6'}>
              Are you sure you want to delete this chat? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className={`px-4 py-2 rounded-lg ${
                  isDarkMode 
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' 
                    : 'bg-gray-100 text-slate-700 hover:bg-gray-200'
                } transition-colors`}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className={`px-4 py-2 rounded-lg bg-gradient-to-r ${
                  isDarkMode
                    ? 'from-red-600 to-red-500 hover:from-red-500 hover:to-red-400'
                    : 'from-red-600 to-red-500 hover:from-red-500 hover:to-red-400'
                } text-white transition-colors`}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;