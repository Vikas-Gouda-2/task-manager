# 🗄️ Quick Database Reference

## What Database Did You Use?

### **SQLite** (Current) + **PostgreSQL** (Production Ready)

---

## 📊 The 3 Tables at a Glance

### **user_profile** 👤
```
Store: User XP, Level, Streak
Columns: id, xp, level, streak_days
```

### **tasks** ✓
```
Store: All tasks with metadata
Columns: id, title, category, priority, due_date, completed, xp_reward, notes, tags
```

### **subtasks** 📝
```
Store: Steps within tasks
Columns: id, task_id (FK), title, completed
```

---

## 🔗 Relationships

```
User Profile (1)
    ↓
Tasks (Many) ← → Subtasks (Many)
    ↑
  Cascade Delete
```

---

## 💾 Key Info

| Item | Value |
|------|-------|
| **Current DB** | SQLite |
| **File** | `backend/tasks.db` |
| **ORM** | SQLAlchemy 2.0+ |
| **API** | FastAPI with Pydantic |
| **Upgrade** | PostgreSQL (free on Render) |
| **Production** | ✅ Ready |

---

## 🚀 Instant Upgrade to PostgreSQL

```bash
1. Create PostgreSQL on Render
2. Set DATABASE_URL environment variable
3. Redeploy (auto-creates tables)
4. Done! Data persists forever
```

---

## 🎯 Complete Docs

See: `DATABASE_DOCUMENTATION.md` in your repo
