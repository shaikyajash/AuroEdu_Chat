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
  Input,
  Tooltip,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import {
  ChatBubbleLeftRightIcon,
  SunIcon,
  MoonIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  XMarkIcon,
  CheckIcon,
} from "@heroicons/react/24/solid";
import useThemeStore from "../store/themeStore";
import useChatStore from "../store/chatStore";

const Sidebar = () => {
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
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
    renameSession 
  } = useChatStore();

  const handleRename = (session) => {
    setEditingId(session.id);
    setEditName(session.name);
  };

  const handleSaveRename = () => {
    if (editName.trim()) {
      renameSession(editingId, editName.trim());
    }
    setEditingId(null);
    setEditName("");
  };

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

  return (
    <>
      <Card className={`h-screen w-72 p-4 shadow-xl rounded-none ${
        isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'
      }`}>
        <div className="mb-2 flex items-center justify-between p-4">
          <Typography variant="h5" className={isDarkMode ? 'text-gray-100' : 'text-blue-gray-900'}>
            AuroEdu Chat
          </Typography>
          <Tooltip content={isDarkMode ? "Light mode" : "Dark mode"}>
            <IconButton
              variant="text"
              color={isDarkMode ? "gray" : "blue-gray"}
              onClick={toggleTheme}
              className={isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}
            >
              {isDarkMode ? (
                <SunIcon className="h-5 w-5 text-yellow-300" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </IconButton>
          </Tooltip>
        </div>
        
        <div className="flex items-center justify-between px-4 mb-2">
          <Typography variant="h6" className={isDarkMode ? 'text-gray-300' : 'text-gray-900'}>
            Chat Sessions
          </Typography>
          <Tooltip content="New chat">
            <IconButton
              variant="text"
              size="sm"
              color={isDarkMode ? "gray" : "blue-gray"}
              onClick={createNewSession}
              className={isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}
            >
              <PlusIcon className="h-5 w-5" />
            </IconButton>
          </Tooltip>
        </div>

        <List className={`overflow-y-auto max-h-[calc(100vh-200px)] ${isDarkMode ? 'text-gray-100' : ''}`}>
          {chatSessions.map((session) => (
            <ListItem
              key={session.id}
              className={`group mb-2 relative ${isDarkMode ? 'hover:bg-gray-700' : ''} ${
                currentSessionId === session.id 
                  ? isDarkMode 
                    ? 'bg-gray-700'
                    : 'bg-blue-gray-50'
                  : ''
              }`}
              onClick={() => switchSession(session.id)}
            >
              <ListItemPrefix>
                <ChatBubbleLeftRightIcon className={`h-5 w-5 ${isDarkMode ? 'text-gray-100' : ''}`} />
              </ListItemPrefix>
              
              {editingId === session.id ? (
                <div className="flex-1 flex items-center gap-2 z-10 bg-inherit">
                  <div className="flex-1 min-w-0">
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className={`!border-t-blue-gray-200 focus:!border-t-gray-900 ${
                        isDarkMode ? '!text-gray-100' : ''
                      }`}
                      labelProps={{
                        className: "hidden",
                      }}
                      containerProps={{
                        className: "min-w-0 !mt-0",
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <IconButton
                    variant="text"
                    size="sm"
                    color={isDarkMode ? "gray" : "blue-gray"}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSaveRename();
                    }}
                    className={isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}
                  >
                    <CheckIcon className="h-4 w-4" />
                  </IconButton>
                  <IconButton
                    variant="text"
                    size="sm"
                    color={isDarkMode ? "gray" : "blue-gray"}
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingId(null);
                    }}
                    className={isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </IconButton>
                </div>
              ) : (
                <>
                  <span className="flex-1">{session.name}</span>
                  <ListItemSuffix className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <IconButton
                      variant="text"
                      size="sm"
                      color={isDarkMode ? "gray" : "blue-gray"}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRename(session);
                      }}
                      className={isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </IconButton>
                    <IconButton
                      variant="text"
                      size="sm"
                      color={isDarkMode ? "gray" : "blue-gray"}
                      onClick={(e) => handleDelete(e, session.id)}
                      className={isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </IconButton>
                  </ListItemSuffix>
                </>
              )}
            </ListItem>
          ))}
          {chatSessions.length === 0 && (
            <div className="text-center p-4">
              <Typography 
                variant="small"
                className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}
              >
                No chat sessions yet.
                Click the + button to start a new chat.
              </Typography>
            </div>
          )}
        </List>
      </Card>

      <Dialog open={showDeleteDialog} handler={() => setShowDeleteDialog(false)}>
        <DialogHeader>Confirm Deletion</DialogHeader>
        <DialogBody>
          Are you sure you want to delete this chat session? This action cannot be undone.
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="gray"
            onClick={() => setShowDeleteDialog(false)}
            className="mr-1"
          >
            Cancel
          </Button>
          <Button variant="gradient" color="red" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default Sidebar;