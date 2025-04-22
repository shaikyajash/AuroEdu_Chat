import React, { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import ChatScreen from "./Screens/ChatScreen";
import NavigationBar from "./components/NavigationBar";
import DiscussionSection from "./components/DiscussionSection";
import ResourcesSection from "./components/ResourcesSection";
import AboutSection from "./components/AboutSection";
import useThemeStore from "./store/themeStore";

function App() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const location = useLocation();
  
  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className={`${isDarkMode ? "bg-slate-900" : "bg-gray-50"} min-h-screen`}>
      <NavigationBar />
      
      {/* Add padding to accommodate fixed navbar */}
      <main className="pt-16"> 
        <Routes>
          {/* Home/Chat Route */}
          <Route path="/" element={<ChatScreen />} />
          
          {/* Discussion Route */}
          <Route path="/discussions" element={
            <div className="container mx-auto py-6 px-4">
              <DiscussionSection />
            </div>
          } />
          
          {/* Resources Route */}
          <Route path="/resources" element={
            <div className="container mx-auto py-6 px-4">
              <ResourcesSection />
            </div>
          } />
          
          {/* About Route */}
          <Route path="/about" element={
            <div className="container mx-auto py-6 px-4">
              <AboutSection />
            </div>
          } />
          
          {/* Fallback route - redirects to home */}
          <Route path="*" element={<ChatScreen />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
