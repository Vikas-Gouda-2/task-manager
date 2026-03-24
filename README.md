# 🎯 Task Manager

A production-ready task management application with gamification, animations, and Pomodoro timer.

**Live Demo:** https://task-manager-frontend-0uf5.onrender.com  
**GitHub:** https://github.com/Vikas-Gouda-2/task-manager

---

## ✨ Features

- ✅ Create, edit, delete tasks with due dates & categories
- ✅ Mark tasks complete with particle animations
- ✅ Earn XP for completing tasks (10-30 XP per task)
- ✅ Auto-level up (100 XP = 1 level)
- ✅ Daily streak tracking
- ✅ Pomodoro timer (25 min work, 5 min break)
- ✅ Beautiful dark theme with glassmorphism
- ✅ Smooth 3D animations & effects
- ✅ Sound effects (Web Audio API)
- ✅ Fully responsive mobile design
- ✅ Drag & drop task reordering

---

## 🚀 Quick Start

### Live (No Installation)
Visit: https://task-manager-frontend-0uf5.onrender.com

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

Open http://localhost:3000

---

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| **Frontend** | React 19, Framer Motion, Tailwind CSS |
| **Backend** | FastAPI, SQLAlchemy, Python 3.10 |
| **Database** | SQLite |
| **Deployment** | Render.com |

---

## 📁 Project Structure

```
task_manager/
├── backend/
│   ├── main.py           # FastAPI app (11 endpoints)
│   ├── models.py         # Database models
│   ├── schemas.py        # Validation
│   ├── database.py       # DB config
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── App.js        # Main component
│   │   ├── Dashboard.js  # Stats view
│   │   ├── GamificationBar.js
│   │   ├── SettingsModal.js
│   │   └── useSoundEffects.js
│   └── package.json
│
├── render.yaml           # Deployment config
└── README.md
```

---

## 🔌 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/tasks` | Get all tasks |
| POST | `/tasks` | Create task |
| PUT | `/tasks/{id}` | Update task |
| DELETE | `/tasks/{id}` | Delete task |
| GET | `/profile` | Get user profile |

**Docs:** http://localhost:8000/docs

---

## 🎮 How to Use

1. **Create Task** - Type task name & click "Add Task"
2. **Complete Task** - Click checkbox to mark done
3. **Earn XP** - Gain 10-30 XP per task
4. **Level Up** - Every 100 XP = 1 level
5. **Pomodoro** - Click timer to start 25-min work session
6. **Settings** - Customize theme, sounds, timer duration

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| **Frontend won't load** | Check backend running: `curl http://localhost:8000/tasks` |
| **Tasks not appearing** | Open DevTools (F12) → Network tab → check API requests |
| **No sound** | Check browser audio permissions & settings |
| **Animations choppy** | Close other browser tabs, update browser |

---

## 📚 Deployment (Render)

1. Push to GitHub: `git push origin main`
2. Go to https://dashboard.render.com
3. Select "task-manager" repo
4. Click "Deploy"
5. Wait 3-5 minutes

---

## 📦 Dependencies

**Backend:**
```
fastapi==0.104.1
uvicorn[standard]==0.24.0
sqlalchemy>=2.0.23
python-multipart==0.0.6
```

**Frontend:**
```
react@19.2.4
framer-motion@12.36.0
tailwind-css@3.4.19
lucide-react@0.577.0
```

---

## 🔗 Links

- 🌐 **Live App:** https://task-manager-frontend-0uf5.onrender.com
- 📚 **API Docs:** https://task-manager-api-25g1.onrender.com/docs
- 💻 **GitHub:** https://github.com/Vikas-Gouda-2/task-manager
- 🎛️ **Render Dashboard:** https://dashboard.render.com

---

**Version:** 1.0.0 | **Status:** Production Ready ✅
