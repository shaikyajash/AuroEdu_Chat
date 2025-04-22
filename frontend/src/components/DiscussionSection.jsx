import React, { useState, useEffect } from "react";
import useThemeStore from "../store/themeStore";
// Import the mock data from JSON file
import mockDiscussionsData from "../data/mockDiscussions.json";

const DiscussionCard = ({ discussion, isDarkMode }) => {
  return (
    <div className={`p-5 rounded-lg mb-4 shadow-md ${
      isDarkMode ? "bg-slate-800 border border-slate-700" : "bg-white border border-teal-100"
    }`}>
      <div className="flex items-start gap-3">
        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
          isDarkMode ? "bg-slate-700 text-teal-400" : "bg-teal-600 text-white"
        }`}>
          <span className="font-medium">{discussion.avatar}</span>
        </div>
        <div className="flex-1">
          <h3 className={`font-semibold text-lg mb-1 ${
            isDarkMode ? "text-white" : "text-slate-800"
          }`}>
            {discussion.title}
          </h3>
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
              {discussion.author}
            </span>
            <span className={`text-xs ${isDarkMode ? "text-slate-500" : "text-slate-500"}`}>
              • {discussion.date}
            </span>
          </div>
          <p className={`mb-3 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
            {discussion.content}
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            {discussion.tags.map((tag, index) => (
              <span 
                key={index}
                className={`text-xs px-2 py-1 rounded-full ${
                  isDarkMode 
                    ? "bg-slate-700 text-teal-300" 
                    : "bg-teal-100 text-teal-700"
                }`}
              >
                #{tag}
              </span>
            ))}
          </div>
          <div className={`flex gap-4 text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
            <button className="flex items-center gap-1 hover:text-teal-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
              </svg>
              <span>{discussion.likes}</span>
            </button>
            <button className="flex items-center gap-1 hover:text-teal-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
              </svg>
              <span>{discussion.replies}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DiscussionSection = () => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const [discussions, setDiscussions] = useState([]);

  // Load discussions data when component mounts
  useEffect(() => {
    setDiscussions(mockDiscussionsData);
  }, []);

  return (
    <div className={`w-full max-w-3xl mx-auto px-4 ${isDarkMode ? "text-slate-100" : "text-slate-800"}`}>
      <div className="mb-6 flex justify-between items-center">
        <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-slate-800"}`}>
          Discussions
        </h2>
        <button className={`px-4 py-2 rounded-lg font-medium ${
          isDarkMode 
            ? "bg-teal-600 hover:bg-teal-700 text-white" 
            : "bg-teal-500 hover:bg-teal-600 text-white"
        } transition-colors`}>
          Start Discussion
        </button>
      </div>
      
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search discussions..."
          className={`w-full p-3 rounded-lg ${
            isDarkMode 
              ? "bg-slate-700 border border-slate-600 text-white placeholder:text-slate-400" 
              : "bg-white border border-slate-200 text-slate-800 placeholder:text-slate-400"
          } focus:outline-none focus:ring-2 focus:ring-teal-500`}
        />
      </div>
      
      {discussions.map(discussion => (
        <DiscussionCard 
          key={discussion.id} 
          discussion={discussion} 
          isDarkMode={isDarkMode} 
        />
      ))}
    </div>
  );
};

export default DiscussionSection;