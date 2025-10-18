# ChessMaster - Premium Online Chess Platform

## Project Overview
ChessMaster is a modern, professional-looking full-stack online chess platform built with React, Node.js/Express, PostgreSQL, and WebSockets. It offers a premium chess experience with AI opponents, real-time multiplayer, and beautiful UI.

## Features
- **User Authentication**: JWT-based signup/login system with secure password hashing
- **Three Game Modes**:
  - AI Mode: Play against Stockfish engine with adjustable difficulty (easy, medium, hard)
  - Online Multiplayer: Real-time matches with other players using WebSocket
  - Friendly Match: Create/join games using unique game codes
- **Real-time Features**: 
  - Live move synchronization via WebSocket
  - In-game chat for multiplayer matches
- **User Dashboard**: Track wins, losses, draws, and view match history
- **Profile Page**: Detailed statistics and game history
- **Beautiful UI**: Dark theme with teal accents (#14b8a6), smooth animations, responsive design

## Tech Stack
### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- chess.js for game logic
- wouter for routing
- TanStack Query for data fetching
- WebSocket client for real-time features

### Backend
- Express.js server
- PostgreSQL database with Drizzle ORM
- JWT authentication
- WebSocket server (ws package)
- bcrypt for password hashing
- chess.js for move validation
- Simple AI opponent (Stockfish simulation)

## Database Schema
- **users**: id, username, password, wins, losses, draws
- **games**: id, player1_id, player2_id, mode, difficulty, game_code, fen, pgn, result, winner_id, status
- **chat_messages**: id, game_id, user_id, message, created_at

## API Endpoints
### Auth
- POST /api/auth/signup
- POST /api/auth/login
- GET /api/auth/profile

### Game
- POST /api/game/create
- GET /api/game/:id
- POST /api/game/move
- POST /api/game/resign
- GET /api/game/recent
- GET /api/game/history

### Chat
- POST /api/game/chat
- GET /api/game/chat/:gameId

## WebSocket Events
- join: Join a game room
- move: Broadcast chess moves to opponents
- chat: Real-time chat messages

## Project Structure
```
├── client/
│   ├── src/
│   │   ├── components/      # Reusable components (Chessboard, MoveList, etc.)
│   │   ├── pages/          # Page components (Landing, Dashboard, Game, etc.)
│   │   ├── lib/            # Utilities (auth, queryClient)
│   │   └── App.tsx         # Main app with routing
├── server/
│   ├── routes.ts           # API endpoints and WebSocket server
│   ├── storage.ts          # Database operations
│   └── db.ts               # Database connection
├── shared/
│   └── schema.ts           # Shared TypeScript types and Drizzle schema
└── design_guidelines.md    # UI/UX design specifications
```

## Development
- Run `npm run dev` to start both frontend and backend
- Database migrations: `npm run db:push`
- Access at http://localhost:5000

## Recent Changes
- Complete chess platform implementation with all three game modes
- WebSocket integration for real-time multiplayer
- PostgreSQL database with full persistence
- Beautiful dark theme UI with smooth animations
- AI opponent integration with difficulty levels
