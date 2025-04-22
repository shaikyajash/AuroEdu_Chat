import React from "react";
import { Route, Routes } from "react-router-dom";
import ChatScreen from "./Screens/ChatScreen";


function App() {

  return (
    <Routes>
      <Route path="/" element={<ChatScreen />} />
      
    </Routes>
  );
}

export default App;
