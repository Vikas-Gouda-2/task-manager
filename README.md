# 🎯 Task Manager - Full Stack Application

A production-ready task management application with gamification, animations, and real-time synchronization.

**Status:** ✅ **FULLY DEPLOYED & PRODUCTION READY**

---

## 🚀 Quick Start

### Try It Live (No Installation Required)
- **Frontend:** https://task-manager-frontend-0uf5.onrender.com
- **Backend API:** https://task-manager-api-25g1.onrender.com
- **GitHub Repo:** https://github.com/Vikas-Gouda-2/task-manager

### Run Locally

**Backend:**
```bash
cd backend
pip install -r requirements.txt
python3 -m uvicorn main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

Open http://localhost:3000 in your browser.

---

## ✨ Features

### Task Management
- ✅ Create, edit, delete tasks
- ✅ Set due dates and categories
- ✅ Mark tasks complete with particle animations
- ✅ Drag & drop reordering
- ✅ Filter by status and category
- ✅ Add detailed subtasks

### Gamification System
- ✅ Earn XP for completing tasks (10-30 XP per task)
- ✅ Automatic level progression (100 XP per level)
- ✅ Daily streak tracking
- ✅ Profile dashboard with statistics
- ✅ XP bar with visual feedback

### User Experience
- ✅ Beautiful dark theme with glassmorphism
- ✅ Smooth animations (3D tilt, particle explosions, aurora background)
- ✅ Optional sound effects (Web Audio API)
- ✅ Built-in Pomodoro timer (25-minute default, customizable)
- ✅ Fully responsive mobile design
- ✅ Customizable settings

---

## 🏗️ Technology Stack

### Backend
- **FastAPI 0.104.1** - Python REST API framework
- **Python 3.10** - Runtime
- **SQLAlchemy 2.0.23+** - ORM
- **Uvicorn 0.24.0** - ASGI server
- **SQLite** - Local database

### Frontend
- **React 19.2.4** - UI library
- **Framer Motion 12.36.0** - Animations
- **Tailwind CSS 3.4.19** - Styling
- **Lucide React 0.577.0** - Icons

### Deployment
- **Render.com** - Cloud hosting
- **GitHub** - Version control & CI/CD

---

## 📁 Project Structure

```
task_manager/
├── backend/
│   ├── main.py              # FastAPI app with 11 endpoints
│   ├── models.py           # SQLAlchemy ORM models (3 tables)
│   ├── schemas.py          # Pydantic validation
│   ├── database.py         # Database config
│   ├── migration.py        # Database setup
│   ├── requirements.txt    # Python dependencies
│   └── __init__.py
│
├── frontend/
│   ├── src/
│   │   ├── App.js                 # Main React component
│   │   ├── Dashboard.js           # Statistics dashboard
│   │   ├── TaskDetailsModal.js    # Task editor modal
│   │   ├── GamificationBar.js     # XP/Level/Streak display
│   │   ├── SettingsModal.js       # Settings UI
│   │   ├── SettingsContext.js     # Global state
│   │   ├── useSoundEffects.js     # Sound effects hook
│   │   ├── index.js               # Entry point
│   │   ├── index.css
│   │   └── App.css
│   │
│   ├── public/
│   │   └── index.html
│   │
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── render.yaml             # Render Blueprint configuration
├── Procfile                # Process definition
├── README.md               # This file
└── tasks.db                # SQLite database
```

---

## 🔌 API Endpoints

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | Get all tasks |
| GET | `/tasks/{id}` | Get task details |
| POST | `/tasks` | Create new task |
| PUT | `/tasks/{id}` | Update task |
| DELETE | `/tasks/{id}` | Delete task |

### Subtasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/tasks/{task_id}/subtasks` | Add subtask |
| PUT | `/subtasks/{id}` | Update subtask |
| DELETE | `/subtasks/{id}` | Delete subtask |

### Profile
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/profile` | Get user profile (XP, level, streak) |
| PUT | `/profile` | Update profile settings |

**API Documentation:** http://localhost:8000/docs (Swagger UI)

---

## 📊 Database Schema

### UserProfile Table
```
id (Primary Key)
xp (Integer) - Total experience points
level (Integer) - Current level
streak_days (Integer) - Consecutive completed days
```

### Tasks Table
```
id (Primary Key)
title (String) - Task title
category (String, nullable)
priority (Integer) - Priority level (1-3)
due_date (Date, nullable)
completed (Boolean)
xp_reward (Integer) - XP earned on completion
```

### Subtasks Table
```
id (Primary Key)
task_id (Foreign Key) - Parent task
title (String)
completed (Boolean)
```

---

## 🎮 How It Works

### Creating a Task
1. Type task title in input field
2. Optionally set due date and category
3. Click "Add Task"
4. Task appears in the list

### Earning XP
1. Complete a task by clicking the checkbox
2. Particle animation plays
3. Gain 10-30 XP
4. XP bar updates

### Leveling Up
- Every 100 XP = 1 level
- Level increases automatically
- "Level Up!" sound plays

### Pomodoro Timer
1. Click timer in header to start
2. Default: 25 minutes work, 5 minutes break
3. Customize in Settings
4. Alert sound when timer ends

---

## 🚀 Deployment

### Deploy to Render

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Create Render Blueprint**
   - Go to https://dashboard.render.com/blueprints
   - Select this GitHub repo
   - Click "Deploy"

3. **Frontend Build (if needed)**
   - Go to https://dashboard.render.com
   - Click "task-manager-frontend"
   - Click "Manual Deploy"
   - Wait 3-5 minutes

Both services deploy automatically with the included `render.yaml`.

---

## 🧪 Testing

### Test Backend
```bash
# Get all tasks
curl http://localhost:8000/tasks

# Create a task
curl -X POST http://localhost:8000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Task", "xp_reward": 20}'

# Get user profile
curl http://localhost:8000/profile
```

### Test Frontend
1. Open http://localhost:3000
2. Create a few tasks
3. Complete tasks and verify XP increases
4. Test settings and animations
5. Test on mobile device

---

## 🐛 Troubleshooting

### Frontend Won't Connect
- Check `API_BASE_URL` in `src/App.js`
- Verify backend is running: `curl http://localhost:8000/tasks`
- Check browser console (F12) for errors

### Tasks Not Appearing
- Open DevTools (F12)
- Check Network tab for API requests
- Verify backend response

### Sound Effects Not Playing
- Check browser audio permissions
- Verify settings haven't disabled sounds
- Try in incognito mode

### Animations Look Choppy
- Close other browser tabs
- Update browser to latest version
- Disable extensions

---

## 📦 Dependencies

### Backend
```
fastapi==0.104.1
uvicorn[standard]==0.24.0
sqlalchemy>=2.0.23
python-multipart==0.0.6
```

### Frontend
```
react@19.2.4
react-dom@19.2.4
framer-motion@12.36.0
tailwind-css@3.4.19
lucide-react@0.577.0
```

---

## 💡 Tips & Tricks

### Keyboard Shortcuts
- Focus input: Click and start typing
- Create task: Type + Press Enter
- Complete task: Click checkbox
- Delete task: Click task → Delete button

### Best Practices
- Set realistic XP rewards
- Use categories to organize
- Enable sounds for motivation
- Take Pomodoro breaks regularly
- Track streaks for consistency

---

## 📝 Development Notes

### Key Features

**3D Tilt Animation:**
- Tasks tilt when hovering
- Smooth physics using Framer Motion
- Glare effect highlights tilt

**Particle Explosion:**
- 24 particles burst on task completion
- Random angle and velocity
- Cyan and fuchsia colors

**Aurora Background:**
- Animated CSS gradients
- Two independent orbs
- 40% opacity for balance

**Gamification:**
- XP stored in database
- Level = xp // 100 + 1
- Streak tracks consecutive days

---

## 🔗 Links

- **Live App:** https://task-manager-frontend-0uf5.onrender.com
- **API Docs:** https://task-manager-api-25g1.onrender.com/docs
- **GitHub:** https://github.com/Vikas-Gouda-2/task-manager
- **Render Dashboard:** https://dashboard.render.com

---

## 📧 Support

For issues:
1. Check this README
2. Review API docs at `/docs`
3. Check browser console for errors
4. Create an issue on GitHub

---

**Version:** 1.0.0  
**Status:** Production Ready ✅  
**Last Updated:** March 2026
