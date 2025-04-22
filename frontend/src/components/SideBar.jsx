import React, { useState } from "react";
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  IconButton,
  Button,
  Tooltip,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Chip,
} from "@material-tailwind/react";
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
      <Card className={`h-screen w-80 p-0 shadow-xl rounded-none backdrop-blur-sm ${
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
            <Typography variant="h4" className={`font-semibold ${
              isDarkMode ? 'text-primary-300' : 'text-primary-600'
            }`}>
              AuroEdu
            </Typography>
            <Tooltip content={isDarkMode ? "Light mode" : "Dark mode"}>
              <IconButton
                variant="text"
                color={isDarkMode ? "white" : "blue-gray"}
                onClick={toggleTheme}
                className={`rounded-full ${
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
              </IconButton>
            </Tooltip>
          </div>
          <Button
            size="sm"
            className={`flex items-center gap-2 w-full shadow-sm ${
              isDarkMode 
                ? 'bg-gradient-subtle from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white' 
                : 'bg-gradient-subtle from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 text-white'
            }`}
            onClick={createNewSession}
          >
            <PlusIcon className="h-4 w-4" />
            New Chat
          </Button>
        </div>

        {/* Chat List */}
        <List className={`overflow-y-auto p-2 flex-1 ${
          isDarkMode ? 'text-secondary-100' : 'text-secondary-900'
        }`}>
          {chatSessions.map((session) => (
            <ListItem
              key={session.id}
              className={`group mb-2 ${
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
              onClick={() => switchSession(session.id)}
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
                    <Typography className={`font-medium truncate ${
                      currentSessionId === session.id
                        ? isDarkMode 
                          ? 'text-primary-300'
                          : 'text-primary-700'
                        : ''
                    }`}>
                      {session.name}
                    </Typography>
                    <Typography
                      variant="small"
                      className={`truncate ${
                        isDarkMode ? 'text-secondary-400' : 'text-secondary-600'
                      }`}
                    >
                      {getLastMessage(session.messages)}
                    </Typography>
                  </div>
                </div>
              </div>
              <ListItemSuffix>
                <div className={`opacity-0 group-hover:opacity-100 transition-opacity`}>
                  <IconButton
                    variant="text"
                    size="sm"
                    className={`rounded-full ${
                      isDarkMode 
                        ? 'hover:bg-secondary-600 text-secondary-400 hover:text-secondary-200' 
                        : 'hover:bg-secondary-100 text-secondary-500 hover:text-secondary-700'
                    }`}
                    onClick={(e) => handleDelete(e, session.id)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </IconButton>
                </div>
              </ListItemSuffix>
            </ListItem>
          ))}
          {chatSessions.length === 0 && (
            <div className="flex flex-col items-center justify-center h-32 p-4">
              <Typography 
                variant="small"
                className={`text-center ${
                  isDarkMode ? 'text-secondary-400' : 'text-secondary-600'
                }`}
              >
                No chat sessions yet
              </Typography>
              <Typography 
                variant="small"
                className={`text-center ${
                  isDarkMode ? 'text-secondary-500' : 'text-secondary-500'
                }`}
              >
                Click the New Chat button to start
              </Typography>
            </div>
          )}
        </List>
      </Card>

      <Dialog 
        open={showDeleteDialog} 
        handler={() => setShowDeleteDialog(false)}
        className={isDarkMode ? 'bg-secondary-800' : ''}
      >
        <DialogHeader className={`${
          isDarkMode ? 'text-secondary-100' : ''
        }`}>
          Delete Chat
        </DialogHeader>
        <DialogBody className={isDarkMode ? 'text-secondary-300' : ''}>
          Are you sure you want to delete this chat? This action cannot be undone.
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color={isDarkMode ? "white" : "gray"}
            onClick={() => setShowDeleteDialog(false)}
            className={`mr-1 ${
              isDarkMode 
                ? 'hover:bg-secondary-700' 
                : 'hover:bg-secondary-100'
            }`}
          >
            Cancel
          </Button>
          <Button
            variant="gradient"
            color="red"
            onClick={confirmDelete}
            className={isDarkMode ? 'bg-red-600 hover:bg-red-700' : ''}
          >
            Delete
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default Sidebar;