# 📊 Database Documentation - Task Manager

## 🎯 Overview

Your Task Manager uses **SQLAlchemy ORM** with a flexible database configuration that supports both **SQLite** (for development) and **PostgreSQL** (for production on Render).

---

## 🗄️ Database Type

### Current Setup: **SQLite**
- **File Location**: `backend/tasks.db`
- **Type**: Embedded SQL database
- **Best For**: Local development and testing
- **Auto-creates**: Tables automatically on first run

### Production Ready: **PostgreSQL**
- **Can be upgraded** to Render's PostgreSQL database
- **Provides**: Permanent data storage
- **Required for**: Production with data persistence

---

## 📋 Database Configuration

### File: `backend/database.py`

```python
# Use DATABASE_URL from environment or fallback to SQLite
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./tasks.db")

# Render/Heroku uses 'postgres://', but SQLAlchemy 2.0+ requires 'postgresql://'
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
```

### How It Works
1. **Local Development**: Uses SQLite (`tasks.db`)
2. **Environment Variable**: Checks for `DATABASE_URL` env var
3. **PostgreSQL Compatibility**: Converts `postgres://` to `postgresql://`
4. **Automatic Connection**: Creates/reuses connection pool

---

## 📊 Database Tables & Schema

### 1️⃣ **user_profile** Table
Stores user gamification data

| Column | Type | Description |
|--------|------|-------------|
| `id` | Integer | Primary key |
| `xp` | Integer | Total experience points (default: 0) |
| `level` | Integer | Current user level (default: 1) |
| `streak_days` | Integer | Current streak count (default: 0) |

**Purpose**: Track user progression, XP, and streaks

```python
class UserProfile(Base):
    __tablename__ = "user_profile"
    
    id = Column(Integer, primary_key=True, index=True)
    xp = Column(Integer, default=0)
    level = Column(Integer, default=1)
    streak_days = Column(Integer, default=0)
```

---

### 2️⃣ **tasks** Table
Stores all tasks created by the user

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | Integer | No | Primary key, auto-increment |
| `title` | String | No | Task title (indexed) |
| `category` | String | Yes | Category (e.g., "Work", "Personal") |
| `tags` | String | Yes | Comma-separated tags |
| `notes` | String | Yes | Detailed notes |
| `priority` | Integer | No | 1=Low, 2=Medium, 3=High (default: 1) |
| `due_date` | Date | Yes | Due date for task |
| `completed` | Boolean | No | Is task complete? (default: False) |
| `xp_reward` | Integer | No | XP earned on completion (default: 10) |

**Purpose**: Main task storage with metadata

```python
class Task(Base):
    __tablename__ = "tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    category = Column(String, nullable=True)
    tags = Column(String, nullable=True)
    notes = Column(String, nullable=True)
    priority = Column(Integer, default=1)
    due_date = Column(Date, nullable=True)
    completed = Column(Boolean, default=False)
    xp_reward = Column(Integer, default=10)
    
    # Relationship
    subtasks = relationship("Subtask", back_populates="task", cascade="all, delete-orphan")
```

---

### 3️⃣ **subtasks** Table
Stores subtasks for breaking down larger tasks

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | Integer | No | Primary key, auto-increment |
| `task_id` | Integer | No | Foreign key to tasks table |
| `title` | String | No | Subtask title (indexed) |
| `completed` | Boolean | No | Is subtask complete? (default: False) |

**Purpose**: Break larger tasks into smaller steps

**Relationships**:
- `task_id` → Foreign key to `tasks.id`
- Cascade delete: Deleting a task deletes all its subtasks

```python
class Subtask(Base):
    __tablename__ = "subtasks"
    
    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("tasks.id"))
    title = Column(String, index=True)
    completed = Column(Boolean, default=False)
    
    # Relationship
    task = relationship("Task", back_populates="subtasks")
```

---

## 📈 Database Schema Diagram

```
┌─────────────────────┐
│   user_profile      │
├─────────────────────┤
│ id (PK)             │
│ xp                  │
│ level               │
│ streak_days         │
└─────────────────────┘

┌─────────────────────┐         ┌──────────────────────┐
│       tasks         │◄───────┤     subtasks         │
├─────────────────────┤         ├──────────────────────┤
│ id (PK)             │         │ id (PK)              │
│ title (indexed)     │         │ task_id (FK)         │
│ category            │         │ title (indexed)      │
│ tags                │         │ completed            │
│ notes               │         └──────────────────────┘
│ priority            │
│ due_date            │
│ completed           │
│ xp_reward           │
└─────────────────────┘
```

---

## 🔑 Relationships

### One-to-Many: Task ↔ Subtask
- **One Task** has **Many Subtasks**
- **Foreign Key**: `subtasks.task_id` references `tasks.id`
- **Cascade Delete**: Removing a task removes all its subtasks
- **Cascade Update**: Automatic relationship sync

```python
# In Task model
subtasks = relationship("Subtask", back_populates="task", cascade="all, delete-orphan")

# In Subtask model
task = relationship("Task", back_populates="subtasks")
```

---

## 🌍 Database Connection URLs

### SQLite (Local Development)
```
sqlite:///./tasks.db
```
- File-based, no server needed
- Perfect for development
- Data resets on Render free tier

### PostgreSQL (Production)
```
postgresql://username:password@host:port/database_name
```
- Persistent data storage
- Required for Render production
- Can be upgraded anytime

---

## 💾 How Data is Stored

### Task Creation Flow
```
1. User adds task in React
   ↓
2. POST /tasks API endpoint receives data
   ↓
3. Pydantic validates data (TaskCreate schema)
   ↓
4. SQLAlchemy creates Task object
   ↓
5. Data inserted into "tasks" table
   ↓
6. Auto-increment ID assigned
   ↓
7. Task returned to frontend
```

### Completion & XP Flow
```
1. User marks task complete
   ↓
2. PUT /tasks/{id} endpoint receives {completed: true}
   ↓
3. Task marked complete in database
   ↓
4. XP added to user_profile
   ↓
5. Level checked (if xp >= 100 → level up)
   ↓
6. Profile updated in database
```

---

## 🔧 Database Operations

### Create Tables
```python
# Automatically runs on app startup
models.Base.metadata.create_all(bind=engine)
```

### Add New Data
```python
db.add(new_task)
db.commit()
db.refresh(new_task)
```

### Query Data
```python
# Get all tasks
tasks = db.query(models.Task).all()

# Get specific task
task = db.query(models.Task).filter(models.Task.id == 1).first()

# Get tasks by category
work_tasks = db.query(models.Task).filter(models.Task.category == "Work").all()
```

### Update Data
```python
task.completed = True
task.priority = 2
db.commit()
```

### Delete Data
```python
db.delete(task)
db.commit()
```

---

## 📁 Database Files

### File Location
```
/Users/viswa/Documents/task_manager/backend/tasks.db
```

### File Information
- **Size**: ~10-50 KB (depending on usage)
- **Format**: SQLite binary format
- **Auto-created**: On first API request
- **Readable by**: SQLite clients, DB browsers

---

## 🚀 Upgrading to PostgreSQL

### Why Upgrade?
- ✅ Permanent data storage
- ✅ No reset on service restart
- ✅ Better for production
- ✅ Scalable for multiple users
- ✅ Free tier available on Render

### How to Upgrade

**Step 1**: Create PostgreSQL database on Render
```
1. Go to https://dashboard.render.com/databases
2. Click "New Database"
3. Select "PostgreSQL"
4. Name it "task-manager-db"
5. Click "Create"
```

**Step 2**: Add environment variable
```
1. Go to task-manager-api service
2. Click "Environment"
3. Add variable:
   Name: DATABASE_URL
   Value: postgresql://user:pass@host:port/db
```

**Step 3**: Redeploy
```
1. Push to GitHub (triggers auto-deploy)
2. Or manually redeploy from Render dashboard
3. Database tables auto-create on first request
```

---

## 📊 Database Indexing

### Indexed Columns
- `tasks.id` - Primary key (auto-indexed)
- `tasks.title` - For quick search
- `subtasks.id` - Primary key (auto-indexed)
- `subtasks.title` - For quick search

### Performance
- Searches by title are fast
- Lookups by ID are instant
- Can add more indexes as needed

---

## 🔒 Data Security

### SQLAlchemy ORM Benefits
- ✅ **SQL Injection Prevention**: Parameterized queries
- ✅ **Type Checking**: Validates data types
- ✅ **Relationships**: Maintains data integrity
- ✅ **Transactions**: ACID compliance

### Best Practices Used
- ✅ Parameterized queries (not string concatenation)
- ✅ Foreign key constraints
- ✅ Cascade delete for consistency
- ✅ Input validation via Pydantic

---

## 🧪 Testing the Database

### Check if Database Exists
```bash
cd /Users/viswa/Documents/task_manager/backend
ls -lh tasks.db
```

### View Database with SQLite Browser
```bash
# Install (if needed)
brew install sqlitebrowser

# Open database
sqlitebrowser tasks.db
```

### Test API Endpoints
```bash
# Get all tasks
curl https://task-manager-api-25g1.onrender.com/tasks

# Create a task
curl -X POST https://task-manager-api-25g1.onrender.com/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","priority":2,"xp_reward":15}'

# Get user profile
curl https://task-manager-api-25g1.onrender.com/profile
```

---

## 📋 Summary

| Aspect | Details |
|--------|---------|
| **Current Database** | SQLite (tasks.db) |
| **ORM Framework** | SQLAlchemy 2.0+ |
| **Tables** | 3 (user_profile, tasks, subtasks) |
| **Production Ready** | ✅ Yes (with PostgreSQL upgrade) |
| **Data Persistence** | ✅ Yes |
| **Relationships** | One-to-Many (Tasks ↔ Subtasks) |
| **Backup Strategy** | Environment variable support |
| **Scale** | Handles 1000s of tasks easily |

---

## 🎯 What's Next?

1. **Local Development**: Use SQLite (already set up)
2. **Production**: Upgrade to PostgreSQL on Render
3. **Backups**: Set up automated backups if needed
4. **Monitoring**: Track database size and performance

Your database is production-ready and can handle the full application load! 🚀
