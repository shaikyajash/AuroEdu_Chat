import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import useThemeStore from "../store/themeStore";
import { 
  HomeIcon, 
  ChatBubbleLeftRightIcon, 
  BookOpenIcon, 
  InformationCircleIcon,
  UserCircleIcon,
  XMarkIcon,
  Bars3Icon
} from "@heroicons/react/24/outline";

const NavigationBar = () => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check if a path is active
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  // Navigation links data to avoid repetition
  const navigationLinks = [
    {
      to: "/",
      icon: <HomeIcon className="h-5 w-5" />,
      label: "Home"
    },
    {
      to: "/discussions",
      icon: <ChatBubbleLeftRightIcon className="h-5 w-5" />,
      label: "Discussions"
    },
    {
      to: "/resources",
      icon: <BookOpenIcon className="h-5 w-5" />,
      label: "Resources"
    },
    {
      to: "/about",
      icon: <InformationCircleIcon className="h-5 w-5" />,
      label: "About"
    }
  ];
  
  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  // Close mobile menu when a link is clicked
  const handleLinkClick = () => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 shadow-md ${
      isDarkMode ? "bg-slate-900 text-slate-100" : "bg-teal-600 text-white"
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2" onClick={handleLinkClick}>
              <div className={`p-1.5 rounded-lg ${
                isDarkMode ? "bg-teal-800" : "bg-teal-700"
              }`}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M11.7 2.805a.75.75 0 0 1 .6 0A60.65 60.65 0 0 1 22.83 8.72a.75.75 0 0 1-.231 1.337 49.949 49.949 0 0 0-9.902 3.912l-.003.002-.34.18a.75.75 0 0 1-.707 0A50.009 50.009 0 0 0 7.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 0 1 4.653-2.52.75.75 0 0 0-.65-1.352 56.129 56.129 0 0 0-4.78 2.589 1.858 1.858 0 0 0-.859 1.228 49.803 49.803 0 0 0-4.634-1.527.75.75 0 0 1-.231-1.337A60.653 60.653 0 0 1 11.7 2.805Z" />
                  <path d="M13.06 15.473a48.45 48.45 0 0 1 7.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 0 1-.46.71 47.878 47.878 0 0 0-8.105 4.342.75.75 0 0 1-.832 0 47.877 47.877 0 0 0-8.104-4.342.75.75 0 0 1-.461-.71c.035-1.442.121-2.87.255-4.286A48.4 48.4 0 0 1 6 13.18v1.27a1.5 1.5 0 0 0-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.661a6.729 6.729 0 0 0 .551-1.608 1.5 1.5 0 0 0 .14-2.67v-.645a48.549 48.549 0 0 1 3.44 1.668 2.25 2.25 0 0 0 2.12 0Z" />
                  <path d="M4.462 19.462c.42-.419.753-.89 1-1.394.453.213.902.434 1.347.661a6.743 6.743 0 0 1-1.286 1.794.75.75 0 0 1-1.06-1.06Z" />
                </svg>
              </div>
              <span className={`text-xl font-bold ${
                isDarkMode ? "text-teal-400" : "text-white"
              }`}>AuroEdu</span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-1">
            {navigationLinks.map((link) => (
              <Link 
                key={link.to}
                to={link.to} 
                className={`flex items-center gap-1.5 px-4 py-2 rounded-md transition-colors ${
                  isActive(link.to) 
                    ? isDarkMode 
                      ? "bg-slate-800 text-teal-400"
                      : "bg-teal-700 text-white"
                    : "hover:bg-opacity-20 hover:bg-teal-700"
                }`}
                onClick={handleLinkClick}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {/* User Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full ${
                isDarkMode 
                  ? "bg-slate-800 hover:bg-slate-700 text-teal-400" 
                  : "bg-teal-700 hover:bg-teal-800 text-white"
              } transition-colors`}
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                </svg>
              )}
            </button>
            
            <div className={`hidden md:flex items-center justify-center h-9 w-9 rounded-full ${
              isDarkMode ? "bg-slate-800 text-teal-400 border border-slate-700" : "bg-teal-700 text-white"
            }`}>
              <UserCircleIcon className="h-6 w-6" />
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-md focus:outline-none"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu - expanded when isMobileMenuOpen is true */}
      <div className={`md:hidden px-4 py-3 ${
        isDarkMode ? "bg-slate-800 border-t border-slate-700" : "bg-teal-700 border-t border-teal-500"
      } ${isMobileMenuOpen ? "block" : "hidden"}`}>
        {navigationLinks.map((link) => (
          <Link 
            key={link.to}
            to={link.to} 
            className={`flex items-center gap-2 py-3 px-2 ${
              isActive(link.to) 
                ? isDarkMode 
                  ? "text-teal-400 bg-slate-700 rounded-md" 
                  : "text-white bg-teal-600 rounded-md"
                : "text-white hover:bg-opacity-20 hover:bg-teal-600 rounded-md"
            }`}
            onClick={handleLinkClick}
          >
            {link.icon}
            <span>{link.label}</span>
          </Link>
        ))}
        
        {/* Mobile user profile link */}
        <div className="flex items-center gap-2 py-3 px-2 mt-2 border-t border-teal-500">
          <div className={`flex items-center justify-center h-8 w-8 rounded-full ${
            isDarkMode ? "bg-slate-700 text-teal-400" : "bg-teal-600 text-white"
          }`}>
            <UserCircleIcon className="h-6 w-6" />
          </div>
          <span>Profile</span>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;