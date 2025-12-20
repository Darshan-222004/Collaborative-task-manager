# Build stage for frontend
FROM node:18-alpine as frontend-build
WORKDIR /app/frontend
# Copy pre-built frontend dist from repository
COPY frontend/dist ./dist

# Build stage for backend
FROM node:18-alpine as backend-build
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --only=production
# Copy pre-built backend dist from repository
COPY backend/dist ./dist

# Production stage
FROM node:18-alpine
WORKDIR /app

# Copy backend build
COPY --from=backend-build /app/backend/dist ./backend/dist
COPY --from=backend-build /app/backend/package*.json ./backend/
COPY --from=backend-build /app/backend/node_modules ./backend/node_modules

# Copy frontend build to backend public (or serve statically)
# For this setup, we'll serve frontend files from the backend or a separate nginx, 
# but for simplicity in a single container, let's copy to a public dir in backend
COPY --from=frontend-build /app/frontend/dist ./backend/public

WORKDIR /app/backend
CMD ["node", "dist/index.js"]
