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

## Design Decisions and Trade-offs

**Why MongoDB?**
I chose MongoDB primarily because I am much more familiar and comfortable with it compared to relational databases like PostgreSQL. I have spent more time debugging and building with MongoDB, so I can move significantly faster. With PostgreSQL, I would have to worry about complex SQL syntax, migrations, and potential SQL injection vulnerabilities that I might miss. MongoDB's usage of JSON-like documents feels much more natural to work with in a JavaScript/TypeScript environment, allowing me to focus on building features rather than wrestling with database schemas.

**Backend Architecture**
I implemented the Controller-Service-Repository pattern to keep the codebase organized and maintainable. The Controllers handle the incoming HTTP requests and responses, ensuring the input is valid before passing it on. The Services contain the actual business logic of the application. The Repositories are strictly responsible for direct database interactions. This separation means if I ever needed to swap out the database or change business rules, I would only have to touch specific layers rather than rewriting the entire backend.

**Authentication**
I used JWT (JSON Web Tokens) for authentication because it is stateless, meaning the server doesn't need to keep track of sessions in memory or a database. The token is generated upon login and sent with every subsequent request, which the backend then verifies. For this project, I am storing the token in localStorage. While httpOnly cookies are generally more secure, storing it in localStorage was a simpler approach that worked well for this specific implementation.

**Real-time Functionality**
I integrated Socket.io to handle real-time updates. When a user performs an action like creating or assigning a task, the backend saves it to the database and then immediately emits an event. The frontend listens for these events and automatically updates the UI without the user needing to refresh. I chose Socket.io over plain WebSockets because it automatically handles fallbacks (like long-polling) if a connection cannot be established, making it much more reliable.

## Assumptions
I have assumed that MongoDB is running locally or that a valid MongoDB Atlas URI is provided. I also assumed that tasks currently belong to individual users and we haven't implemented shared team workspaces yet. Finally, I assumed that the user has basic knowledge of terminal commands to run the project.

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

**Live Demo:** [https://collaborative-task-manager-production.up.railway.app](https://collaborative-task-manager-production.up.railway.app)

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
