# Task Manager - Deployment Guide

This guide will help you deploy your Task Manager application to the internet using **Render Blueprint**. This is the easiest "one-click" way to get both your Frontend and Backend running perfectly.

## Step 1: Push Your Code to GitHub

Render deploys directly from GitHub. You need to push your code there first.

In your terminal, inside `/Users/viswa/Documents/task_manager`:

```bash
git add .
git commit -m "Configure for one-click deployment"
git push origin main
```

---

## Step 2: One-Click Deployment on Render

1. Go to [dashboard.render.com/blueprints](https://dashboard.render.com/blueprints)
2. Click **New Blueprint Instance**
3. Select your GitHub repository (`task-manager`)
4. Click **Next**
5. Render will automatically detect the configuration in `render.yaml`.
6. Click **Apply**

---

## Step 3: Access Your App

Render will now build both services. Once complete:

1. Go to your [Render Dashboard](https://dashboard.render.com)
2. You will see two new services:
   - **task-manager-api** (Backend)
   - **task-manager-frontend** (Frontend)
3. Click on **task-manager-frontend** to find your **Live Link**.

---

## Important Notes

### Data Persistence (SQLite)
Internal data is stored in `tasks.db` (SQLite). On Render's free tier, this file is reset whenever the service restarts (every 15-30 minutes of inactivity).
**To keep your data permanently**: Create a free PostgreSQL database on Render and add its **Internal Database URL** as an environment variable named `DATABASE_URL` in your **task-manager-api** service settings.

### Cold Starts
Services spin down after 15 minutes of inactivity on the free tier. The first request after a break might take ~30 seconds. This is normal!

Enjoy your live task manager! 🚀
