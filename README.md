# Collaborative Task Manager

A full-stack task management application with real-time collaboration features, built using the MERN stack (MongoDB, Express, React, Node.js) with TypeScript and Socket.io.

## Features

- User authentication with JWT
- Create, update, and delete tasks
- Assign tasks to team members
- Real-time updates using Socket.io
- Dashboard with task statistics
- Notification system for task assignments
- Filter and search functionality
- Responsive design

## Tech Stack

### Frontend
- React 19 with TypeScript
- Vite (build tool)
- TailwindCSS (styling)
- React Query (server state management)
- Zustand (client state management)
- Socket.io Client (real-time updates)
- React Hook Form + Zod (form validation)
- Axios (HTTP client)

### Backend
- Node.js with TypeScript
- Express.js (web framework)
- MongoDB with Mongoose (database)
- Socket.io (WebSocket server)
- JWT (authentication)
- Bcrypt (password hashing)
- Zod (schema validation)

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Darshan-222004/Collaborative-task-manager.git
cd Collaborative-task-manager
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/collaborative-task-manager
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
BCRYPT_SALT_ROUNDS=10
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000
```

### 4. Run the Application

**Start MongoDB** (if running locally):
```bash
# Windows
net start MongoDB

# Mac/Linux
sudo systemctl start mongod
```

**Start Backend** (Terminal 1):
```bash
cd backend
npm run dev
```

**Start Frontend** (Terminal 2):
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Task Endpoints (Requires Authentication)

Add JWT token to headers:
```
Authorization: Bearer <your-jwt-token>
```

#### Create Task
```http
POST /tasks
Content-Type: application/json

{
  "title": "Build Login Page",
  "description": "Create responsive login UI",
  "priority": "High",
  "status": "To Do",
  "dueDate": "2025-12-31T23:59:59.000Z",
  "assignedToId": "user-id-here"
}
```

#### Get All Tasks
```http
GET /tasks?status=To Do&priority=High&page=1&limit=10
```

#### Update Task
```http
PATCH /tasks/:id
Content-Type: application/json

{
  "status": "In Progress",
  "priority": "Urgent"
}
```

#### Delete Task
```http
DELETE /tasks/:id
```

### Dashboard Endpoints

#### Get Dashboard Statistics
```http
GET /dashboard/stats
```

Returns:
```json
{
  "success": true,
  "data": {
    "total": 50,
    "completed": 20,
    "pending": 30,
    "overdue": 5,
    "assignedToMe": 15,
    "createdByMe": 35
  }
}
```

### Notification Endpoints

#### Get Notifications
```http
GET /notifications?includeRead=false
```

#### Mark Notification as Read
```http
PATCH /notifications/:id/read
```

## Architecture Overview

### Backend Architecture

The backend follows a **layered architecture** pattern:

```
backend/
├── controllers/     # Handle HTTP requests/responses
├── services/        # Business logic layer
├── repositories/    # Database operations
├── models/          # Mongoose schemas
├── middlewares/     # Auth, error handling
├── routes/          # API route definitions
├── sockets/         # Socket.io event handlers
├── config/          # Database & environment config
└── utils/           # Helper functions (JWT, logger)
```

**Design Pattern: Controller-Service-Repository**

1. **Controllers**: Handle HTTP requests, validate input, call services
2. **Services**: Contain business logic, orchestrate repositories
3. **Repositories**: Direct database operations using Mongoose

### Frontend Architecture

```
frontend/
├── components/      # Reusable UI components
│   ├── Layout/      # App layout with navigation
│   ├── Task/        # Task-related components
│   └── ui/          # Basic UI elements
├── pages/           # Page-level components
│   ├── auth/        # Login, Register
│   ├── dashboard/   # Dashboard page
│   └── tasks/       # Tasks page
├── hooks/           # Custom React hooks
├── store/           # Zustand state management
├── lib/             # Axios & Socket.io setup
└── api/             # API service functions
```

**State Management:**
- **Server State**: React Query (caching, auto-refetch)
- **Client State**: Zustand (authentication, UI state)

## Design Decisions

### Why MongoDB?

I chose MongoDB for this project because:
- **Flexible schema**: Task requirements can evolve without migrations
- **JSON-native**: Natural fit for JavaScript/TypeScript stack
- **Familiarity**: I have more experience debugging MongoDB issues
- **No SQL injection concerns**: Mongoose handles query sanitization

### JWT Authentication

JWT was chosen for authentication because:
- **Stateless**: Backend doesn't need to store sessions
- **Scalable**: Works well with distributed systems
- **Simple**: Token-based auth is straightforward to implement

Tokens are stored in localStorage (for this demo). In production, httpOnly cookies would be more secure.

### Socket.io for Real-Time

Socket.io was selected over plain WebSockets because:
- **Automatic fallbacks**: Falls back to long-polling if WebSockets fail
- **Room support**: Easy to broadcast to specific users
- **Reconnection handling**: Built-in reconnection logic

### React Query

React Query handles all server state because:
- **Automatic caching**: Reduces unnecessary API calls
- **Background refetching**: Keeps data fresh
- **Optimistic updates**: Better UX for mutations

## Socket.io Integration

### How Real-Time Works

1. Client connects to Socket.io server on page load
2. JWT token sent during connection handshake
3. User joins a room based on their user ID
4. Server emits events to relevant users

### Socket Events

**Server → Client:**
- `task:created` - New task created
- `task:updated` - Task modified
- `task:deleted` - Task removed
- `task:assigned` - Task assigned to user

**Example Flow:**
```
1. User A creates task, assigns to User B
2. Backend saves task to MongoDB
3. Backend creates notification
4. Backend emits Socket.io event to User B's room
5. User B's browser receives event
6. React Query cache invalidated
7. UI updates automatically
```

## Trade-offs & Assumptions

### Trade-offs

**MongoDB vs PostgreSQL:**
I chose MongoDB because I'm more comfortable with it and have debugged it more. PostgreSQL would provide stronger ACID guarantees, but MongoDB's flexibility and my familiarity with it made development faster.

**JWT in localStorage:**
Not the most secure approach (httpOnly cookies would be better), but simpler for a demo. The token is sent with every request and verified by the backend.

**Socket.io vs WebSockets:**
Socket.io provides automatic fallbacks and reconnection handling, making it more reliable across different network conditions compared to plain WebSockets.

### Assumptions

- MongoDB is running locally or accessible via MongoDB Atlas
- JWT tokens in localStorage are acceptable for a demo/learning project
- Single MongoDB instance (production would use replica sets)
- Users have basic knowledge of terminal commands

## Testing

```bash
cd backend
npm test
```

Tests cover:
- Task creation and validation
- User authentication
- Error handling
- Business logic

## Deployment

This application is production-ready and can be deployed to Railway.

**Deployment Guide:** See [RAILWAY_DEPLOY.md](./RAILWAY_DEPLOY.md) for complete deployment instructions.

**Production Features:**
- Environment-based configuration
- CORS properly configured
- Health check endpoint (`/health`)
- TypeScript compilation for production
- Socket.io with authentication

## Project Structure

```
collaborative-task-manager/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── controllers/    # HTTP request handlers
│   │   ├── services/       # Business logic
│   │   ├── repositories/   # Database layer
│   │   ├── models/         # Mongoose schemas
│   │   ├── sockets/        # Socket.io handlers
│   │   └── config/         # Configuration
│   ├── .env.example        # Environment template
│   └── package.json
│
├── frontend/               # React + TypeScript
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Pages
│   │   ├── hooks/         # Custom hooks
│   │   ├── lib/           # Axios & Socket.io
│   │   └── store/         # State management
│   ├── .env.example       # Environment template
│   └── package.json
│
├── RAILWAY_DEPLOY.md      # Deployment guide
└── README.md              # This file
```

## Contact

**Name:** N Darshan Bharadwaj  
**Email:** darshanbharadwaj04@gmail.com  
**Phone:** +91 8073388324  
**GitHub:** [Darshan-222004](https://github.com/Darshan-222004)

## License

MIT License
