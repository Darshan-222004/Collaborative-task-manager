# Collaborative Task Manager

A task management app where teams can create, assign, and track tasks together. Built it to learn full-stack development with real-time features.

## What It Does

You can create tasks, assign them to people, and see updates happen live. There's a dashboard that shows your stats, notifications when you get assigned tasks, and filters to find what you need.

## How to Run It

### What You Need
- Node.js (v18+)
- MongoDB running somewhere
- That's it

### Setup

1. **Clone and install:**
```bash
git clone https://github.com/Darshan-222004/Collaborative-task-manager.git
cd Collaborative-task-manager

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

2. **Set up environment files:**

Backend `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/collaborative-task-manager
JWT_SECRET=put-any-random-string-here
FRONTEND_URL=http://localhost:5173
```

Frontend `.env`:
```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000
```

3. **Run it:**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Open http://localhost:5173 and you're good to go.

## Tech Stack

**Frontend:** React + TypeScript, TailwindCSS for styling, React Query for data fetching

**Backend:** Node.js + Express, MongoDB with Mongoose

**Real-time:** Socket.io for live updates

## API Endpoints

Base URL: `http://localhost:5000/api/v1`

### Auth
```http
POST /auth/register
{
  "name": "Your Name",
  "email": "you@example.com",
  "password": "yourpassword"
}

POST /auth/login
{
  "email": "you@example.com",
  "password": "yourpassword"
}
```

### Tasks (needs auth token)
```http
# Add token to headers: Authorization: Bearer <your-token>

GET /tasks                    # Get all tasks
POST /tasks                   # Create task
PATCH /tasks/:id              # Update task
DELETE /tasks/:id             # Delete task

GET /dashboard/stats          # Get your stats
GET /notifications            # Get notifications
```

## How I Built It

### Backend Structure
```
backend/
├── controllers/    # Handle requests
├── services/       # Business logic
├── repositories/   # Talk to database
├── models/         # MongoDB schemas
└── sockets/        # Real-time events
```

I used the controller-service-repository pattern because it keeps things organized. Controllers handle the HTTP stuff, services have the logic, and repositories deal with the database.

### Why MongoDB?

Honestly, I'm just more comfortable with it. I've worked with it before, debugged it more, and know how to fix things when they break. Plus, I don't have to worry about SQL injection attacks that I might miss. MongoDB's simpler for me to reason about.

Could I have used PostgreSQL? Sure. But I'd spend more time fighting with SQL syntax and migrations instead of building features.

### JWT for Auth

I went with JWT because it's stateless - the backend doesn't need to remember sessions. Token gets sent with each request, backend verifies it, done. Stored in localStorage for now (yeah, I know httpOnly cookies are more secure, but this works for a demo).

### Real-Time Updates

Socket.io handles the live updates. When someone creates or updates a task:
1. Backend saves it to MongoDB
2. Emits a Socket.io event
3. Frontend receives event
4. UI updates automatically

It's pretty straightforward. Socket.io also has fallbacks if WebSockets don't work, which is nice.

### Frontend State

I used React Query for server data (tasks, notifications) because it handles caching and refetching automatically. Zustand for auth state because it's tiny and simple - just 3 lines to set up.

## Design Decisions

**Layered Architecture:** Keeps code organized. If I need to swap MongoDB for something else later, I only touch the repository layer.

**TypeScript Everywhere:** Catches bugs before runtime. The type safety between frontend and backend saved me hours of debugging.

**Zod Validation:** Validates data on both ends. Same schema for frontend forms and backend API.

**Notifications in DB:** Could've done them in-memory, but I wanted them to persist. If you close the app and come back, your notifications are still there.

## Trade-offs & Assumptions

**Trade-offs I made:**

- **MongoDB over PostgreSQL:** I'm more comfortable with MongoDB. I've debugged it more, know how it works, and don't have to worry about SQL injection vulnerabilities I might miss. Could've used Postgres, but I'd spend more time fighting with migrations than building features.

- **JWT in localStorage:** Not the most secure (httpOnly cookies would be better), but it's simpler for a demo. The token gets sent with every request, backend verifies it, done.

- **Socket.io for real-time:** Could've used plain WebSockets, but Socket.io has automatic fallbacks if WebSockets don't work. More reliable across different networks.

**Assumptions:**

- You're running this locally or have MongoDB Atlas set up
- JWT tokens in localStorage are fine for a demo/learning project
- Single MongoDB instance is okay (production would need replica sets)
- Users understand basic terminal commands to run npm

## Running Tests

```bash
cd backend
npm test
```

I wrote tests for task creation, validation, and error cases. Should add more but these cover the critical paths.

## Deployment

**Frontend (Vercel):**
```bash
cd frontend
npm run build
# Upload dist/ folder
```

**Backend (Render/Railway):**
- Push to GitHub
- Connect repo
- Set environment variables
- Deploy

**Database (MongoDB Atlas):**
- Free tier works fine
- Get connection string
- Update MONGODB_URI

## Contact

Darshan - darshannayak222004@gmail.com

Built this to learn full-stack development and real-time features. Feel free to use it, break it, or improve it.

---

**Note:** This is a learning project. It works, but it's not production-ready. Use it to learn, not to run your actual business (yet).
