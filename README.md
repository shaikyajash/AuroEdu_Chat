# AuroEdu Chat

## Overview
AuroEdu Chat is an interactive AI-powered educational chat application built with React and Vite. The application simulates real-time educational discussions with AI models, providing a seamless interface for learning and exploration.

## Features
- **AI-Powered Education**: Engage in educational discussions with OpenRouter AI models
- **Real-time Chat Interface**: Intuitive chat interface with typing indicators and message history
- **Session Management**: Create, switch between, and manage multiple chat sessions
- **Responsive Design**: Fully responsive interface that works on desktop and mobile devices
- **Dark/Light Mode**: Toggle between dark and light themes with persistent preferences
- **Advanced Theme Options**: Customize font sizes, chat bubble colors, and theme presets
- **Persistent State**: All chats and settings are preserved between sessions

## Project Structure
```
frontend/
├── public/
├── src/
│   ├── components/         # UI components
│   │   ├── ChatComponent.jsx
│   │   └── SideBar.jsx  
│   ├── Screens/           # Page components
│   │   └── ChatScreen.jsx
│   ├── store/             # State management
│   │   ├── chatStore.js
│   │   └── themeStore.js
│   ├── utils/             # Utility functions
│   │   └── apiCheck.js
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── .env.example           # Environment variables template
├── tailwind.config.js     # Tailwind configuration
├── vite.config.js         # Vite configuration
└── package.json           # Dependencies and scripts
```

## Technologies
- **Frontend**: React.js with Vite build tool
- **Routing**: React Router DOM for navigation
- **State Management**: Zustand with persist middleware for persistent state
- **HTTP Client**: Axios for API communication
- **UI Framework**: TailwindCSS for styling
- **Icons**: Heroicons for UI icons
- **API Integration**: OpenRouter API for AI model access

## Prerequisites
- Node.js (v16 or higher)
- NPM or Yarn
- OpenRouter API key

## Getting Started
1. Clone the repository
   ```
   git clone https://github.com/your-username/auroedu-chat.git
   cd AuroEdu_Chat/frontend
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Set up environment variables
   - Copy `.env.example` to `.env`
   - Add your OpenRouter API key to the `.env` file:
     ```
     VITE_OPENROUTER_API_KEY=your_api_key_here
     ```

4. Start the development server
   ```
   npm run dev
   ```

5. Access the application at `http://localhost:5173`

## Building for Production
```
npm run build
```
The build artifacts will be stored in the `dist/` directory.

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the MIT License.
