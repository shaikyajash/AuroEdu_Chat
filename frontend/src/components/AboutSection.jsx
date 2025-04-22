import React from "react";
import useThemeStore from "../store/themeStore";
import { 
  UserGroupIcon,
  LightBulbIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  PresentationChartLineIcon
} from "@heroicons/react/24/outline";

const FeatureCard = ({ icon, title, description, isDarkMode }) => {
  return (
    <div className={`p-6 rounded-xl ${
      isDarkMode ? "bg-slate-800 border border-slate-700" : "bg-white border border-gray-100"
    } shadow-md hover:shadow-lg transition-shadow`}>
      <div className={`p-3 inline-flex rounded-lg mb-4 ${
        isDarkMode ? "bg-slate-700 text-teal-400" : "bg-teal-100 text-teal-600"
      }`}>
        {icon}
      </div>
      
      <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? "text-white" : "text-slate-800"}`}>
        {title}
      </h3>
      
      <p className={`${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
        {description}
      </p>
    </div>
  );
};

const TeamMember = ({ name, role, bio, avatar, isDarkMode }) => {
  return (
    <div className={`p-6 rounded-xl ${
      isDarkMode ? "bg-slate-800 border border-slate-700" : "bg-white border border-gray-100"
    } shadow-md hover:shadow-lg transition-shadow`}>
      <div className="flex items-center gap-4 mb-4">
        <div className={`h-16 w-16 rounded-full flex items-center justify-center text-xl font-bold ${
          isDarkMode ? "bg-slate-700 text-teal-400 border border-slate-600" : "bg-teal-100 text-teal-600"
        }`}>
          {avatar || name.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <h3 className={`text-xl font-semibold ${isDarkMode ? "text-white" : "text-slate-800"}`}>
            {name}
          </h3>
          <p className={`${isDarkMode ? "text-teal-400" : "text-teal-600"}`}>
            {role}
          </p>
        </div>
      </div>
      
      <p className={`${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
        {bio}
      </p>
    </div>
  );
};

const AboutSection = () => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  
  // Features data
  const features = [
    {
      icon: <LightBulbIcon className="h-6 w-6" />,
      title: "AI-Powered Learning",
      description: "Leverage advanced AI technology to enhance your educational experience with personalized learning paths and intelligent feedback."
    },
    {
      icon: <ChatBubbleLeftRightIcon className="h-6 w-6" />,
      title: "Interactive Discussions",
      description: "Engage in meaningful conversations with peers and educators in our structured discussion forums dedicated to various academic subjects."
    },
    {
      icon: <DocumentTextIcon className="h-6 w-6" />,
      title: "Rich Resources",
      description: "Access a growing library of high-quality educational materials including documents, videos, and interactive courses across disciplines."
    },
    {
      icon: <UserGroupIcon className="h-6 w-6" />,
      title: "Community Learning",
      description: "Join a vibrant community of learners and educators who collaborate to solve problems and share knowledge."
    },
    {
      icon: <GlobeAltIcon className="h-6 w-6" />,
      title: "Accessible Anywhere",
      description: "Study anytime, anywhere with our platform that works seamlessly across devices and provides offline access to key materials."
    },
    {
      icon: <PresentationChartLineIcon className="h-6 w-6" />,
      title: "Progress Tracking",
      description: "Monitor your educational journey with detailed analytics and insights that help you understand your strengths and areas for improvement."
    }
  ];
  
  // Team members data
  const team = [
    {
      name: "Dr. Sarah Chen",
      role: "Founder & Education Director",
      bio: "With over 15 years of experience in educational technology, Dr. Chen founded AuroEdu to bridge the gap between traditional learning and modern AI capabilities."
    },
    {
      name: "Michael Rodriguez",
      role: "Chief Technology Officer",
      bio: "Michael leads our technical team with expertise in AI, machine learning, and educational software development from his previous work at leading tech companies."
    },
    {
      name: "Jessica Patel",
      role: "Curriculum Designer",
      bio: "A former professor with a passion for innovative teaching methods, Jessica ensures our platform delivers academically rigorous and engaging content."
    }
  ];

  return (
    <div className={`w-full max-w-5xl mx-auto px-4 py-6 ${isDarkMode ? "text-slate-100" : "text-slate-800"}`}>
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-slate-800"}`}>
          About <span className={isDarkMode ? "text-teal-400" : "text-teal-600"}>AuroEdu</span>
        </h1>
        
        <p className={`text-xl max-w-3xl mx-auto ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
          Transforming education through AI-powered learning experiences and community collaboration
        </p>
      </div>
      
      {/* Mission Section */}
      <div className="mb-16">
        <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? "text-white" : "text-slate-800"}`}>
          Our Mission
        </h2>
        
        <div className={`p-6 rounded-xl ${
          isDarkMode ? "bg-slate-800/50 border border-slate-700" : "bg-teal-50/50 border border-teal-100"
        }`}>
          <p className={`text-lg mb-4 ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}>
            At AuroEdu, we believe that education should be accessible, engaging, and tailored to each learner's unique needs. Our mission is to harness the power of artificial intelligence to create a learning environment where:
          </p>
          
          <ul className={`list-disc list-inside space-y-2 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
            <li>Students can learn at their own pace and in their preferred style</li>
            <li>Educators can leverage technology to enhance their teaching and reach more learners</li>
            <li>Communities can form around shared educational interests and goals</li>
            <li>Knowledge becomes more accessible to people of diverse backgrounds</li>
            <li>Learning becomes a lifelong, enjoyable journey rather than a finite task</li>
          </ul>
        </div>
      </div>
      
      {/* Features Grid */}
      <div className="mb-16">
        <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? "text-white" : "text-slate-800"}`}>
          Platform Features
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              isDarkMode={isDarkMode}
            />
          ))}
        </div>
      </div>
      
      {/* Team Section */}
      <div className="mb-16">
        <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? "text-white" : "text-slate-800"}`}>
          Our Team
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((member, index) => (
            <TeamMember 
              key={index}
              name={member.name}
              role={member.role}
              bio={member.bio}
              isDarkMode={isDarkMode}
            />
          ))}
        </div>
      </div>
      
      {/* Get in Touch */}
      <div>
        <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? "text-white" : "text-slate-800"}`}>
          Get in Touch
        </h2>
        
        <div className={`p-6 rounded-xl text-center ${
          isDarkMode ? "bg-slate-800 border border-slate-700" : "bg-white border border-gray-100"
        } shadow-md`}>
          <p className={`mb-6 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
            We're always looking to improve our platform and welcome feedback from our community. If you have questions, suggestions, or would like to collaborate with us, please reach out.
          </p>
          
          <a 
            href="mailto:contact@auroedu.com" 
            className={`inline-block px-6 py-3 rounded-lg font-medium ${
              isDarkMode 
                ? "bg-teal-600 hover:bg-teal-700 text-white" 
                : "bg-teal-500 hover:bg-teal-600 text-white"
            } transition-colors`}
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;