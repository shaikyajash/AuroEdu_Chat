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
    const content = lastMsg.content.slice(0, 30) + (lastMsg.content.length > 30 ? "..." : "");
    return content;
  };

  return (
    <>
      <div className={`h-screen w-80 p-0 shadow-xl rounded-none backdrop-blur-sm ${
        isDarkMode 
          ? 'bg-secondary-800/90 text-secondary-100 border-r border-secondary-700' 
          : 'bg-white/80 text-secondary-900 border-r border-secondary-200'
      }`}>
        {/* Header */}
        <div className={`p-5 ${
          isDarkMode 
            ? 'bg-gradient-subtle from-secondary-800 to-secondary-900/50' 
            : 'bg-gradient-subtle from-primary-50 to-white'
        } border-b ${isDarkMode ? 'border-secondary-700' : 'border-secondary-200'}`}>
          <div className="flex items-center justify-between mb-3">
            <h4 className={`font-semibold text-xl ${
              isDarkMode ? 'text-primary-300' : 'text-primary-600'
            }`}>
              AuroEdu
            </h4>
            <div className="relative group">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full transition-colors ${
                  isDarkMode 
                    ? 'hover:bg-secondary-700 text-primary-300' 
                    : 'hover:bg-primary-50 text-primary-600'
                }`}
              >
                {isDarkMode ? (
                  <SunIcon className="h-5 w-5" />
                ) : (
                  <MoonIcon className="h-5 w-5" />
                )}
              </button>
              <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap">
                {isDarkMode ? "Light mode" : "Dark mode"}
              </span>
            </div>
          </div>
          <button
            className={`flex items-center gap-2 w-full shadow-sm py-2 px-4 rounded-md ${
              isDarkMode 
                ? 'bg-gradient-subtle from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white' 
                : 'bg-gradient-subtle from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 text-white'
            }`}
            onClick={createNewSession}
          >
            <PlusIcon className="h-4 w-4" />
            New Chat
          </button>
        </div>

        {/* Chat List */}
        <div className={`overflow-y-auto p-2 flex-1 ${
          isDarkMode ? 'text-secondary-100' : 'text-secondary-900'
        }`}>
          {chatSessions.map((session) => (
            <div
              key={session.id}
              onClick={() => switchSession(session.id)}
              className={`group mb-2 p-3 cursor-pointer ${
                isDarkMode 
                  ? 'hover:bg-secondary-700/50' 
                  : 'hover:bg-primary-50/50'
              } ${
                currentSessionId === session.id 
                  ? isDarkMode 
                    ? 'bg-secondary-700/50 border border-secondary-600'
                    : 'bg-primary-50/50 border border-primary-200'
                  : ''
              } rounded-xl transition-all duration-200`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <ChatBubbleLeftRightIcon className={`h-5 w-5 ${
                    isDarkMode 
                      ? currentSessionId === session.id
                        ? 'text-primary-400'
                        : 'text-secondary-400'
                      : currentSessionId === session.id
                        ? 'text-primary-600'
                        : 'text-secondary-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium truncate ${
                      currentSessionId === session.id
                        ? isDarkMode 
                          ? 'text-primary-300'
                          : 'text-primary-700'
                        : ''
                    }`}>
                      {session.name}
                    </p>
                    <p
                      className={`text-sm truncate ${
                        isDarkMode ? 'text-secondary-400' : 'text-secondary-600'
                      }`}
                    >
                      {getLastMessage(session.messages)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <div className={`opacity-0 group-hover:opacity-100 transition-opacity`}>
                  <button
                    className={`p-1 rounded-full ${
                      isDarkMode 
                        ? 'hover:bg-secondary-600 text-secondary-400 hover:text-secondary-200' 
                        : 'hover:bg-secondary-100 text-secondary-500 hover:text-secondary-700'
                    }`}
                    onClick={(e) => handleDelete(e, session.id)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {chatSessions.length === 0 && (
            <div className="flex flex-col items-center justify-center h-32 p-4">
              <p
                className={`text-center text-sm ${
                  isDarkMode ? 'text-secondary-400' : 'text-secondary-600'
                }`}
              >
                No chat sessions yet
              </p>
              <p
                className={`text-center text-sm ${
                  isDarkMode ? 'text-secondary-500' : 'text-secondary-500'
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-lg shadow-lg max-w-sm w-full ${
            isDarkMode ? 'bg-secondary-800' : 'bg-white'
          }`}>
            <h3 className={`text-lg font-medium mb-2 ${
              isDarkMode ? 'text-secondary-100' : 'text-gray-900'
            }`}>
              Delete Chat
            </h3>
            <p className={isDarkMode ? 'text-secondary-300 mb-6' : 'text-gray-600 mb-6'}>
              Are you sure you want to delete this chat? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className={`px-4 py-2 rounded ${
                  isDarkMode 
                    ? 'bg-secondary-700 text-white hover:bg-secondary-600' 
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
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