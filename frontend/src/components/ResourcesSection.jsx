import React, { useState, useEffect } from "react";
import useThemeStore from "../store/themeStore";
import { 
  DocumentTextIcon, 
  VideoCameraIcon, 
  AcademicCapIcon,
  BookmarkIcon,
  ArrowTopRightOnSquareIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon
} from "@heroicons/react/24/outline";

// Import mock data from JSON file
import mockResourcesData from "../data/mockResources.json";

const ResourceCard = ({ resource, isDarkMode }) => {
  // Function to get icon based on resource type
  const getTypeIcon = (type) => {
    switch(type) {
      case 'document':
        return <DocumentTextIcon className="h-5 w-5" />;
      case 'video':
        return <VideoCameraIcon className="h-5 w-5" />;
      case 'course':
        return <AcademicCapIcon className="h-5 w-5" />;
      default:
        return <DocumentTextIcon className="h-5 w-5" />;
    }
  };

  // Function to get stats based on resource type
  const getStats = (resource) => {
    switch(resource.type) {
      case 'document':
        return `${resource.downloads} downloads`;
      case 'video':
        return `${resource.views} views • ${resource.duration}`;
      case 'course':
        return `${resource.enrolled} enrolled • ${resource.modules} modules`;
      default:
        return '';
    }
  };

  return (
    <div className={`flex flex-col md:flex-row gap-4 p-4 rounded-lg mb-4 ${
      isDarkMode ? "bg-slate-800 border border-slate-700" : "bg-white border border-gray-100"
    } shadow-md hover:shadow-lg transition-shadow`}>
      <div className="w-full md:w-48 h-32 flex-shrink-0 overflow-hidden rounded-md">
        <img 
          src={resource.thumbnail || "https://via.placeholder.com/300x200"} 
          alt={resource.title}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className={`font-semibold text-lg ${isDarkMode ? "text-white" : "text-slate-800"}`}>
              {resource.title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
                isDarkMode ? "bg-slate-700 text-teal-300" : "bg-teal-100 text-teal-700"
              }`}>
                {getTypeIcon(resource.type)}
                <span>{resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}</span>
              </span>
              <span className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                By {resource.author}
              </span>
              <span className={`text-xs ${isDarkMode ? "text-slate-500" : "text-slate-500"}`}>
                • {resource.date}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className={`p-1.5 rounded-full ${
              isDarkMode ? "bg-slate-700 hover:bg-slate-600 text-slate-300" : "bg-gray-100 hover:bg-gray-200 text-slate-600"
            }`}>
              <BookmarkIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <p className={`mt-2 text-sm ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
          {resource.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mt-3">
          {resource.tags.map((tag, index) => (
            <span 
              key={index}
              className={`text-xs px-2 py-0.5 rounded-full ${
                isDarkMode 
                  ? "bg-slate-700 text-slate-300" 
                  : "bg-gray-100 text-slate-600"
              }`}
            >
              #{tag}
            </span>
          ))}
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-1">
            {/* Star rating */}
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i} 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="currentColor" 
                  className={`w-4 h-4 ${
                    i < Math.floor(resource.rating) 
                      ? isDarkMode ? "text-teal-400" : "text-teal-500"
                      : isDarkMode ? "text-slate-600" : "text-gray-300"
                  }`}
                >
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                </svg>
              ))}
            </div>
            <span className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
              {resource.rating} • {getStats(resource)}
            </span>
          </div>
          
          <a 
            href="#" 
            className={`flex items-center gap-1 text-sm font-medium ${
              isDarkMode ? "text-teal-400 hover:text-teal-300" : "text-teal-600 hover:text-teal-500"
            }`}
          >
            <span>View</span>
            <ArrowTopRightOnSquareIcon className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

const ResourcesSection = () => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const [resources, setResources] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");

  // Load resources data when component mounts
  useEffect(() => {
    setResources(mockResourcesData);
  }, []);

  // Filter types
  const filters = [
    { id: "all", label: "All" },
    { id: "document", label: "Documents" },
    { id: "video", label: "Videos" },
    { id: "course", label: "Courses" }
  ];

  const filteredResources = activeFilter === "all" 
    ? resources 
    : resources.filter(resource => resource.type === activeFilter);

  return (
    <div className={`w-full max-w-5xl mx-auto px-4 ${isDarkMode ? "text-slate-100" : "text-slate-800"}`}>
      <div className="mb-6">
        <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-slate-800"}`}>
          Educational Resources
        </h1>
        <p className={`${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
          Explore our collection of high-quality learning materials to enhance your education
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className={`relative flex-1`}>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <MagnifyingGlassIcon className={`h-5 w-5 ${isDarkMode ? "text-slate-400" : "text-slate-400"}`} />
            </div>
            <input 
              type="text" 
              placeholder="Search resources..." 
              className={`w-full pl-10 pr-4 py-3 rounded-lg ${
                isDarkMode 
                  ? "bg-slate-700 border border-slate-600 text-white placeholder:text-slate-400" 
                  : "bg-white border border-slate-200 text-slate-800 placeholder:text-slate-400"
              } focus:outline-none focus:ring-2 focus:ring-teal-500`}
            />
          </div>
          
          <div className="flex items-center">
            <button className={`p-3 rounded-lg flex items-center gap-2 ${
              isDarkMode ? "bg-slate-700 text-slate-200" : "bg-white text-slate-700 border border-slate-200"
            }`}>
              <AdjustmentsHorizontalIcon className="h-5 w-5" />
              <span>Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map(filter => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeFilter === filter.id
                ? isDarkMode 
                  ? "bg-teal-600 text-white" 
                  : "bg-teal-500 text-white"
                : isDarkMode 
                  ? "bg-slate-800 text-slate-300 hover:bg-slate-700" 
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-gray-100"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
      
      {/* Resources List */}
      <div>
        {filteredResources.map(resource => (
          <ResourceCard 
            key={resource.id} 
            resource={resource} 
            isDarkMode={isDarkMode}
          />
        ))}
      </div>
    </div>
  );
};

export default ResourcesSection;