# Collaborative Task Manager

A full-stack collaborative task management application with real-time updates, built with TypeScript, React, Node.js, MongoDB, and Socket.io.

## 🚀 Features

- **User Authentication**: Secure JWT-based authentication with bcrypt password hashing
- **Task CRUD Operations**: Create, read, update, and delete tasks with full CRUD support
- **Real-Time Collaboration**: Live updates via Socket.io when tasks are created, updated, or deleted
- **Persistent Notifications**: In-app notification system for task assignments
- **Dashboard Analytics**: View statistics for assigned, created, and overdue tasks
- **Advanced Filtering**: Filter tasks by status, priority, assignee, and creator
- **Responsive Design**: Mobile-first UI built with Tailwind CSS

---

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Architecture](#architecture)
- [Socket.io Integration](#socketio-integration)
- [Testing](#testing)
- [Deployment](#deployment)

---

## 🛠️ Tech Stack

### Frontend
- **React** (v18) with TypeScript
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **React Query** (@tanstack/react-query) - Server state management
- **Zustand** - Client state management
- **Socket.io Client** - Real-time communication
- **React Hook Form** + **Zod** - Form validation
- **Axios** - HTTP client

### Backend
- **Node.js** with TypeScript
- **Express.js** - Web framework
- **MongoDB** with **Mongoose** (ODM)
- **Socket.io** - WebSocket server
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Zod** - Schema validation

---

## ✅ Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (v6 or higher) - Running locally or remote connection string

---

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Darshan-222004/Collaborative-task-manager.git
cd Collaborative-task-manager
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

## 🔐 Environment Variables

### Backend (.env)

Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/collaborative-task-manager

# JWT Secret (use a strong random string in production)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Frontend URL for CORS
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000
```

---

## ▶️ Running the Application

### Start MongoDB

Ensure MongoDB is running:

```bash
# Windows
net start MongoDB

# Mac/Linux
sudo systemctl start mongod
```

### Start Backend Server

```bash
cd backend
npm run dev
```

Backend will run on **http://localhost:5000**

### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

Frontend will run on **http://localhost:5173**

---

## 📡 API Documentation

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
  "password": "SecurePass123"
}

Response: 201 Created
{
  "success": true,
  "data": {
    "user": { "_id": "...", "name": "John Doe", "email": "john@example.com" },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response: 200 OK
{
  "success": true,
  "data": {
    "user": { "_id": "...", "name": "John Doe", "email": "john@example.com" },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Task Endpoints (Requires Authentication)

All task endpoints require the `Authorization` header:
```
Authorization: Bearer <your-jwt-token>
```

#### Create Task
```http
POST /tasks
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "Build Login Page",
  "description": "Create responsive login UI with validation",
  "priority": "High",
  "status": "To Do",
  "dueDate": "2025-12-31T23:59:59.000Z",
  "assignedToId": "507f1f77bcf86cd799439011"
}

Response: 201 Created
{
  "success": true,
  "data": {
    "_id": "...",
    "title": "Build Login Page",
    "description": "...",
    "priority": "High",
    "status": "To Do",
    "creatorId": { "_id": "...", "name": "John Doe" },
    "assignedToId": { "_id": "...", "name": "Jane Smith" },
    "createdAt": "2025-12-19T...",
    "updatedAt": "2025-12-19T..."
  }
}
```

#### Get All Tasks (with filtering)
```http
GET /tasks?status=To Do&priority=High&page=1&limit=10
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "data": {
    "tasks": [...],
    "pagination": {
      "total": 25,
      "page": 1,
      "limit": 10,
      "pages": 3
    }
  }
}
```

#### Update Task
```http
PATCH /tasks/:id
Content-Type: application/json
Authorization: Bearer <token>

{
  "status": "In Progress",
  "priority": "Urgent"
}

Response: 200 OK
```

#### Delete Task
```http
DELETE /tasks/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "message": "Task deleted successfully"
}
```

### Dashboard Endpoints

#### Get Dashboard Stats
```http
GET /dashboard/stats
Authorization: Bearer <token>

Response: 200 OK
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
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "message": "You have been assigned to task: 'Build Login Page'",
      "isRead": false,
      "taskId": { "title": "Build Login Page", "status": "To Do" },
      "createdAt": "2025-12-19T..."
    }
  ]
}
```

#### Mark Notification as Read
```http
PATCH /notifications/:id/read
Authorization: Bearer <token>

Response: 200 OK
```

---

## 🏗️ Architecture

### Backend Architecture

The backend follows a **layered architecture** with clear separation of concerns:

```
backend/
├── src/
│   ├── controllers/     # HTTP request handlers
│   ├── services/        # Business logic layer
│   ├── repositories/    # Database access layer
│   ├── models/          # Mongoose schemas (Task, User, Notification)
│   ├── dtos/            # Zod validation schemas
│   ├── middlewares/     # Auth, error handling
│   ├── routes/          # Express route definitions
│   ├── sockets/         # Socket.io event handlers
│   ├── config/          # DB connection, environment
│   └── utils/           # JWT, logger utilities
```

**Design Pattern: Controller-Service-Repository**

1. **Controllers**: Handle HTTP requests/responses, call services
2. **Services**: Contain business logic, orchestrate repositories
3. **Repositories**: Direct database operations using Mongoose

**Why MongoDB?**
- **Flexible Schema**: Task requirements may evolve (tags, attachments, etc.)
- **Horizontal Scalability**: Sharding support for growth
- **Rich Queries**: Complex filtering and aggregation support
- **JSON-Native**: Natural fit for JavaScript/TypeScript stack
- **Mongoose ODM**: Provides schema validation and  type safety

### Frontend Architecture

```
frontend/
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── Layout/      # AppLayout with sidebar
│   │   ├── Task/        # TaskCard, TaskModal
│   │   ├── Notification/# NotificationDropdown
│   │   └── ui/          # Button, Input, etc.
│   ├── pages/           # Page-level components
│   │   ├── auth/        # Login, Register
│   │   ├── dashboard/   # DashboardPage
│   │   └── tasks/       # TasksPage
│   ├── hooks/           # Custom React hooks
│   │   ├── useTasks.ts
│   │   ├── useDashboard.ts
│   │   └── useNotifications.ts
│   ├── store/           # Zustand state management
│   ├── lib/             # Axios, Socket.io setup
│   └── api/             # API service functions
```

**State Management:**
- **Server State**: React Query (caching, auto-refetch, mutations)
- **Client State**: Zustand (auth, UI state)

---

## 🔄 Socket.io Integration

### How Real-Time Works

1. **Connection**: Client connects to Socket.io server on page load
2. **Authentication**: JWT token sent during connection handshake
3. **Room Joining**: User automatically joins a room based on their user ID
4. **Event Broadcasting**: Server emits events to relevant users

### Socket Events

**Server → Client:**
- `task:created` - New task created
- `task:updated` - Task modified
- `task:deleted` - Task removed
- `task:status_changed` - Status updated
- `task:assigned` - Task assigned to user (targeted)

**Client Behavior:**
- Listens for events and invalidates React Query cache
- UI automatically re-renders with fresh data

**Example Flow (Task Assignment):**
```
1. User A creates task, assigns to User B
2. Backend creates task in MongoDB
3. Backend creates notification in MongoDB
4. Backend emits Socket.io event: `task:assigned` → User B's room
5. User B's browser receives event
6. React Query cache invalidated
7. UI fetches new data and shows notification badge
```

### Implementation Details

**Backend** (`task.socket.ts`):
```typescript
socket.on('task:created', (data) => {
  io.emit('task:created', data); // Broadcast to all
  
  if (data.assignedToId) {
    io.to(data.assignedToId).emit('task:assigned', data); // Targeted
  }
});
```

**Frontend** (`useTasks.ts`):
```typescript
socket.on('task:created', () => {
  queryClient.invalidateQueries(['tasks']);
});
```

---

## 🧪 Testing

### Backend Unit Tests

Run tests:
```bash
cd backend
npm test
```

**Test Coverage:**
- Task creation validation (valid user, notifications)
- Error handling (non-existent user assignment)
- Business logic (self-assignment notification skip)

Test files located in: `backend/src/tests/`

---

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Deploy `dist/` folder to Vercel or Netlify

3. Set environment variables in hosting platform:
```
VITE_API_URL=https://your-backend-url.com/api/v1
VITE_SOCKET_URL=https://your-backend-url.com
```

### Backend Deployment (Render/Railway)

1. Push code to GitHub

2. Connect repository to Render/Railway

3. Set environment variables:
```
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=...
FRONTEND_URL=https://your-frontend-url.com
```

4. Deploy!

### MongoDB Atlas (Recommended for Production)

1. Create free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Get connection string
3. Update `MONGODB_URI` in backend environment

---

## 📝 Trade-offs & Assumptions

### Trade-offs

1. **MongoDB vs PostgreSQL**: Chose MongoDB for schema flexibility and horizontal scaling, trading ACID guarantees for performance
2. **React Query vs Redux**: Used React Query for server state to reduce boilerplate; Zustand for minimal client state
3. **Socket.io vs WebSockets**: Socket.io provides fallback mechanisms (long-polling) for broader browser support

### Assumptions

- Users have MongoDB running locally or access to MongoDB Atlas
- JWT tokens stored in localStorage (consider httpOnly cookies for production)
- Single MongoDB instance (consider replica sets for production)
- Tasks belong to a single user (no multi-tenant support yet)

---

## 👥 Contributors

- **N Darshan Bharadwaj** - Full-stack development

---

## 📄 License

MIT License - feel free to use this project for learning and development!

---

## 🆘 Support

For issues or questions:
- Open an issue on GitHub
- Email: darshannayak222004@gmail.com

---

**Built with ❤️ using TypeScript, React, Node.js, and MongoDB**
