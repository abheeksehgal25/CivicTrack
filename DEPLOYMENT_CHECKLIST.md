# ✅ CivicTrack Deployment Checklist

## Pre-Deployment Checklist

### ✅ Code Changes Made
- [x] Updated `server/package.json` with start script and Node.js engine
- [x] Updated `server/app.js` to bind to `0.0.0.0` for Render
- [x] Updated frontend API URLs to use environment variables
- [x] Created `render.yaml` for automated deployment
- [x] Updated `client/vite.config.js` for production build
- [x] Created comprehensive `.gitignore`
- [x] Created deployment documentation

### ✅ Files Ready for Deployment
- [x] `server/package.json` - Has start script and dependencies
- [x] `server/app.js` - Configured for production
- [x] `client/src/api/auth.js` - Uses environment variables
- [x] `client/src/api/issues.js` - Uses environment variables
- [x] `client/vite.config.js` - Production build config
- [x] `render.yaml` - Deployment configuration
- [x] `DEPLOYMENT.md` - Step-by-step instructions

## Deployment Steps

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### Step 2: Deploy Backend on Render
1. Go to [render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repository
4. Configure:
   - **Name**: `civictrack-backend`
   - **Environment**: Node
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

5. Add Environment Variables:
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://sehgalabheek:Ishiabhi@cluster0.nozc9is.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=64d976d58f058ea06b368ef4663a99b8cd17fe206923a53463185dc9bf93bc907bec85406a275735c3f560d1a9f233e7edf5c52c4f5f6974b368a0aec1cfd9e1
   JWT_EXPIRE=30d
   CORS_ORIGIN=https://civictrack-frontend.onrender.com
   ```

### Step 3: Deploy Frontend on Render
1. Create new Static Site
2. Configure:
   - **Name**: `civictrack-frontend`
   - **Environment**: Static Site
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

3. Add Environment Variable:
   ```
   VITE_API_URL=https://civictrack-backend.onrender.com
   ```

### Step 4: Update CORS
After frontend deployment, update backend CORS_ORIGIN with the actual frontend URL.

## Post-Deployment Verification

### ✅ Test These Features
- [ ] User registration
- [ ] User login
- [ ] Issue reporting
- [ ] Issue viewing
- [ ] Location-based filtering
- [ ] Admin dashboard access
- [ ] Issue flagging
- [ ] Responsive design

### ✅ Check These URLs
- [ ] Backend API: `https://civictrack-backend.onrender.com`
- [ ] Frontend App: `https://civictrack-frontend.onrender.com`
- [ ] API Health Check: `https://civictrack-backend.onrender.com/`

## Troubleshooting

### Common Issues
1. **Build Failures**: Check package.json dependencies
2. **CORS Errors**: Verify CORS_ORIGIN environment variable
3. **Database Connection**: Check MongoDB Atlas IP whitelist
4. **Environment Variables**: Ensure all variables are set correctly

### Quick Fixes
- Restart services after environment variable changes
- Check Render logs for detailed error messages
- Verify all environment variables are set correctly

## Success Indicators

✅ Backend responds to health check  
✅ Frontend loads without errors  
✅ User can register and login  
✅ Issues can be created and viewed  
✅ Admin dashboard is accessible  
✅ All features work as expected  

Your CivicTrack application will be live and accessible worldwide! 🌍 