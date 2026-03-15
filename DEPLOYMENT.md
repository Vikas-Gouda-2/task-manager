# Task Manager - Deployment Guide

This guide will help you deploy your Task Manager application to the internet using **Render** (free tier).

## Overview

Your application consists of:
- **Frontend**: React app (will be hosted on Render as a static site)
- **Backend**: FastAPI app (will be hosted on Render as a web service)

Both services can run on Render's free tier!

---

## Step 1: Push Your Code to GitHub

Render deploys directly from GitHub. You need to push your code there first.

### Create a GitHub Repository

1. Go to [github.com](https://github.com) and sign in (or create an account)
2. Click **New Repository**
3. Name it `task-manager`
4. Set it to **Public** (free tier requirement)
5. Click **Create Repository**

### Push Your Code

In your terminal, inside `/Users/viswa/Documents/task_manager`:

```bash
git remote add origin https://github.com/Vikas-Gouda-2/task-manager.git
git branch -M main
git push -u origin main
```

Your code is ready! Just execute the commands above to push to GitHub.

---

## Step 2: Deploy the Backend on Render

### Create a Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub (this makes deployment easier)
3. Click **Authorize Render**

### Deploy Backend Service

1. Click **New** → **Web Service**
2. Choose your GitHub repository (`task-manager`)
3. Fill in the settings:
   - **Name**: `task-manager-api`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: `Free` (at bottom)
4. Click **Create Web Service**

Render will automatically build and deploy your backend. You'll get a URL like:
```
https://task-manager-api-xxxx.onrender.com
```

**Save this URL!** You'll need it for the frontend.

---

## Step 3: Deploy the Frontend on Render

### Create a Static Site

1. On Render dashboard, click **New** → **Static Site**
2. Choose your GitHub repository (`task-manager`)
3. Fill in the settings:
   - **Name**: `task-manager-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/build`
4. Before deploying, add environment variable:
   - Go to **Environment** tab
   - Add:
     - **Key**: `REACT_APP_API_URL`
     - **Value**: Your backend URL from Step 2 (e.g., `https://task-manager-api-xxxx.onrender.com`)
5. Click **Create Static Site**

Render will build and deploy your frontend. You'll get a URL like:
```
https://task-manager-frontend-xxxx.onrender.com
```

---

## Step 4: Share Your Application

Your application is now live! You can access it at your frontend URL:
```
https://task-manager-frontend-xxxx.onrender.com
```

Share this URL with anyone to let them use your task manager!

---

## Important Notes

### Free Tier Limitations
- Services spin down after 15 minutes of inactivity
- First request after idle takes ~30 seconds to start
- This is normal on the free tier!

### Future Upgrades
When you're ready for production:
- Upgrade to paid tier for always-on services
- Add a custom domain
- Increase database storage

---

## Troubleshooting

### Backend not responding?
1. Check the backend logs on Render dashboard
2. Verify the API URL in frontend `.env.production`
3. Check that CORS is enabled in your FastAPI app

### Frontend shows errors?
1. Open browser DevTools (F12)
2. Check the Console tab for error messages
3. Verify `REACT_APP_API_URL` is set correctly

### Want to update your app?
Just push changes to GitHub:
```bash
git add .
git commit -m "Your changes"
git push
```

Render will automatically redeploy!

---

## Next Steps

After deployment works:
1. Add a custom domain (paid feature)
2. Set up automatic deployments on push (already enabled!)
3. Monitor performance in Render dashboard
4. Scale up to paid tier when needed

Enjoy your live task manager! 🚀
