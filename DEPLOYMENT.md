# 🚀 CivicTrack Deployment Guide

## Render Deployment Instructions

### Prerequisites
- GitHub repository with your code
- Render account (free tier available)
- MongoDB Atlas database (already configured)

### Step 1: Deploy Backend API

1. **Go to Render Dashboard**
   - Visit [render.com](https://render.com)
   - Sign up/Login with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

3. **Configure Backend Service**
   ```
   Name: civictrack-backend
   Environment: Node
   Region: Choose closest to you
   Branch: main
   Root Directory: server
   Build Command: npm install
   Start Command: npm start
   ```

4. **Add Environment Variables**
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://sehgalabheek:Ishiabhi@cluster0.nozc9is.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=64d976d58f058ea06b368ef4663a99b8cd17fe206923a53463185dc9bf93bc907bec85406a275735c3f560d1a9f233e7edf5c52c4f5f6974b368a0aec1cfd9e1
   JWT_EXPIRE=30d
   CORS_ORIGIN=https://civictrack-frontend.onrender.com
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note the URL (e.g., `https://civictrack-backend.onrender.com`)

### Step 2: Deploy Frontend

1. **Create New Static Site**
   - Click "New +" → "Static Site"
   - Connect your GitHub repository

2. **Configure Frontend Service**
   ```
   Name: civictrack-frontend
   Environment: Static Site
   Region: Choose closest to you
   Branch: main
   Root Directory: client
   Build Command: npm install && npm run build
   Publish Directory: dist
   ```

3. **Add Environment Variable**
   ```
   VITE_API_URL=https://civictrack-backend.onrender.com
   ```

4. **Deploy**
   - Click "Create Static Site"
   - Wait for deployment to complete
   - Your app will be available at the provided URL

### Step 3: Update CORS (After Frontend Deployment)

1. **Update Backend CORS**
   - Go to your backend service on Render
   - Update the `CORS_ORIGIN` environment variable with your frontend URL
   - Redeploy the backend

### Environment Variables Summary

**Backend (.env)**
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://sehgalabheek:Ishiabhi@cluster0.nozc9is.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=64d976d58f058ea06b368ef4663a99b8cd17fe206923a53463185dc9bf93bc907bec85406a275735c3f560d1a9f233e7edf5c52c4f5f6974b368a0aec1cfd9e1
JWT_EXPIRE=30d
CORS_ORIGIN=https://civictrack-frontend.onrender.com
```

**Frontend (Environment Variable)**
```env
VITE_API_URL=https://civictrack-backend.onrender.com
```

### Troubleshooting

1. **Build Failures**
   - Check the build logs in Render
   - Ensure all dependencies are in package.json

2. **CORS Errors**
   - Verify CORS_ORIGIN matches your frontend URL exactly
   - Include protocol (https://)

3. **Database Connection**
   - Ensure MongoDB Atlas IP whitelist includes Render's IPs
   - Check connection string format

4. **Environment Variables**
   - Double-check all environment variables are set correctly
   - Restart services after changing environment variables

### URLs After Deployment

- **Frontend**: `https://civictrack-frontend.onrender.com`
- **Backend**: `https://civictrack-backend.onrender.com`

### Features Available After Deployment

✅ User Registration & Login  
✅ Issue Reporting with Photos  
✅ Location-based Issue Filtering  
✅ Issue Flagging & Moderation  
✅ Admin Dashboard with Analytics  
✅ Responsive Design  
✅ Real-time Status Updates  

Your CivicTrack application will be live and accessible worldwide! 🌍 