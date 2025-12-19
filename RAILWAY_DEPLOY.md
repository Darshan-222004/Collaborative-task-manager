# Railway Deployment Guide

## Quick Deploy Checklist

✅ Backend uses `process.env.PORT`  
✅ Socket.io attached to HTTP server  
✅ CORS configured with `FRONTEND_URL`  
✅ No hardcoded localhost URLs  
✅ Build scripts added  
✅ Health endpoint at `/health`  
✅ Frontend uses environment variables  

---

## Backend Deployment (Railway)

### 1. Create New Project
- Go to Railway.app
- Click "New Project"
- Select "Deploy from GitHub repo"
- Choose your repository

### 2. Configure Backend Service
- **Root Directory**: `backend`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

### 3. Add Environment Variables
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanager
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://your-frontend-url.railway.app
BCRYPT_SALT_ROUNDS=10
```

### 4. Get Backend URL
After deployment, Railway will give you a URL like:
```
https://your-backend.railway.app
```

---

## Frontend Deployment (Railway)

### 1. Create Second Service
- In the same Railway project, click "New Service"
- Select "Deploy from GitHub repo"
- Choose the same repository

### 2. Configure Frontend Service
- **Root Directory**: `frontend`
- **Build Command**: `npm install && npm run build`
- **Start Command**: (Railway auto-detects Vite)

### 3. Add Environment Variables
```env
VITE_API_URL=https://your-backend.railway.app/api/v1
VITE_SOCKET_URL=https://your-backend.railway.app
```

**IMPORTANT**: Replace `your-backend.railway.app` with your actual backend URL from step 1.

---

## MongoDB Setup (MongoDB Atlas)

### 1. Create Free Cluster
- Go to mongodb.com/cloud/atlas
- Create free M0 cluster
- Create database user
- Whitelist all IPs: `0.0.0.0/0` (for Railway)

### 2. Get Connection String
```
mongodb+srv://username:password@cluster.mongodb.net/taskmanager?retryWrites=true&w=majority
```

### 3. Add to Backend Environment
Paste this as `MONGODB_URI` in Railway backend environment variables.

---

## Update Backend FRONTEND_URL

After frontend deploys, you'll get a URL like:
```
https://your-frontend.railway.app
```

**Go back to backend environment variables and update:**
```env
FRONTEND_URL=https://your-frontend.railway.app
```

Then redeploy backend (Railway will auto-redeploy on env change).

---

## Verification Steps

### 1. Check Backend Health
Visit: `https://your-backend.railway.app/health`

Should return:
```json
{
  "status": "OK",
  "timestamp": "2025-12-20T..."
}
```

### 2. Check Frontend Loads
Visit: `https://your-frontend.railway.app`

Should show login page.

### 3. Test Full Flow
1. Register a new user
2. Login
3. Create a task
4. Assign it to yourself
5. Check if notification appears (real-time test)

### 4. Check Socket.io Connection
Open browser console (F12) and look for:
```
Socket.io connected
```

If you see errors, check:
- `VITE_SOCKET_URL` matches backend URL
- CORS `FRONTEND_URL` matches frontend URL

---

## Common Issues & Fixes

### Issue: "CORS Error"
**Fix**: Make sure `FRONTEND_URL` in backend matches your frontend Railway URL exactly (including https://).

### Issue: "Socket.io not connecting"
**Fix**: 
1. Check `VITE_SOCKET_URL` in frontend env
2. Make sure it's the backend URL WITHOUT `/api/v1`
3. Check browser console for errors

### Issue: "Cannot connect to MongoDB"
**Fix**:
1. Whitelist `0.0.0.0/0` in MongoDB Atlas
2. Check connection string has correct username/password
3. Make sure database name is included in URI

### Issue: "Backend crashes on startup"
**Fix**:
1. Check Railway logs
2. Make sure all required env variables are set
3. Verify `JWT_SECRET` is at least 32 characters

---

## Environment Variables Summary

### Backend (.env)
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-here
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://your-frontend.railway.app
BCRYPT_SALT_ROUNDS=10
```

### Frontend (.env)
```env
VITE_API_URL=https://your-backend.railway.app/api/v1
VITE_SOCKET_URL=https://your-backend.railway.app
```

---

## Post-Deployment

After both services are running:

1. ✅ Test login/register
2. ✅ Test task creation
3. ✅ Test real-time updates (create task, see notification)
4. ✅ Test on mobile (Railway URLs work on any device)

Your app is now live! 🚀

---

## Troubleshooting Logs

### View Backend Logs
Railway Dashboard → Backend Service → Logs

### View Frontend Logs
Railway Dashboard → Frontend Service → Logs

### Common Log Errors

**"MongoDB connection failed"**
- Check MONGODB_URI
- Whitelist IPs in Atlas

**"JWT secret must be at least 32 characters"**
- Generate longer JWT_SECRET

**"CORS policy blocked"**
- Update FRONTEND_URL in backend
- Redeploy backend

---

## Need Help?

If deployment fails:
1. Check Railway logs
2. Verify all environment variables
3. Test `/health` endpoint
4. Check MongoDB Atlas connection
