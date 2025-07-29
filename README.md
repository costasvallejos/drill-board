# Hockey Drill Board

Interactive hockey drill generator with AI-powered drill creation and animations.

## Features

- Generate drills for shooting, passing, and skating
- Real-time animations showing player movements
- AI-powered drill generation using Groq API

## Technologies Used

### Frontend:
- React 19
- Vite
- Framer Motion for animations
- Custom CSS for styling

### Backend:
- Node.js
- Express.js
- Groq API for AI drill generation

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Groq API key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/costasvallejos/drill-board.git
   cd drill-board
   ```

2. **Install dependencies:**
   ```bash
   npm install
   npm run install-all
   ```

3. **Set up environment variables:** Create a `.env` file in the backend directory:
   ```bash
   cd backend
   echo "GROQ_API_KEY=your_groq_api_key_here" > .env
   cd ..
   ```

4. **Start the development servers:**
   ```bash
   npm run dev
   ```
   This will start both the backend (Express server) and frontend (React dev server) simultaneously.

5. **Open the application in your web browser:**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5050

## Usage

1. Select a category (Shooting, Passing, Skating)
2. Watch the AI generate a custom drill
3. See the animation with player movements
4. Practice the drill
