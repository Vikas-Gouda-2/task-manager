from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

import models
from schemas import TaskCreate, TaskUpdate, TaskResponse, UserProfileResponse, SubtaskCreate, SubtaskResponse
from database import engine, SessionLocal

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

models.Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- GAMIFICATION LOGIC ---
XP_PER_LEVEL = 100

def check_level_up(user_profile: models.UserProfile):
    new_level = (user_profile.xp // XP_PER_LEVEL) + 1
    if new_level > user_profile.level:
        user_profile.level = new_level
        return True
    return False

@app.get("/profile", response_model=UserProfileResponse)
def get_user_profile(db: Session = Depends(get_db)):
    profile = db.query(models.UserProfile).first()
    if not profile:
        profile = models.UserProfile()
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile

# --- TASK ROUTES ---

@app.get("/tasks", response_model=List[TaskResponse])
def get_tasks(db: Session = Depends(get_db)):
    return db.query(models.Task).all()


@app.post("/tasks", response_model=TaskResponse)
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    new_task = models.Task(**task.model_dump())
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task


@app.delete("/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if task:
        db.delete(task)
        db.commit()
        return {"message": "Task deleted"}
    raise HTTPException(status_code=404, detail="Task not found")


@app.put("/tasks/{task_id}", response_model=TaskResponse)
def update_task(task_id: int, task_update: TaskUpdate, db: Session = Depends(get_db)):
    # Fetch existing task
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # Check if task is newly completed to award XP
    was_completed = task.completed
    is_completing = task_update.completed is True and not was_completed

    # Update only the provided fields
    update_data = task_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(task, key, value)

    # Award XP if newly completed
    level_up = False
    if is_completing:
        profile = db.query(models.UserProfile).first()
        if not profile:
            profile = models.UserProfile()
            db.add(profile)
        
        profile.xp += task.xp_reward
        level_up = check_level_up(profile)
        
    db.commit()
    db.refresh(task)
    
    # We don't change TaskResponse to return level_up right now, 
    # the frontend can poll /profile or we can return it in a custom header
    return task

# --- SUBTASK ROUTES ---

@app.post("/tasks/{task_id}/subtasks", response_model=SubtaskResponse)
def create_subtask(task_id: int, subtask: SubtaskCreate, db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
        
    new_subtask = models.Subtask(**subtask.model_dump(), task_id=task_id)
    db.add(new_subtask)
    db.commit()
    db.refresh(new_subtask)
    return new_subtask

@app.put("/subtasks/{subtask_id}", response_model=SubtaskResponse)
def toggle_subtask(subtask_id: int, completed: bool, db: Session = Depends(get_db)):
    subtask = db.query(models.Subtask).filter(models.Subtask.id == subtask_id).first()
    if not subtask:
        raise HTTPException(status_code=404, detail="Subtask not found")
        
    subtask.completed = completed
    db.commit()
    db.refresh(subtask)
    return subtask

@app.delete("/subtasks/{subtask_id}")
def delete_subtask(subtask_id: int, db: Session = Depends(get_db)):
    subtask = db.query(models.Subtask).filter(models.Subtask.id == subtask_id).first()
    if subtask:
        db.delete(subtask)
        db.commit()
        return {"message": "Subtask deleted"}
    raise HTTPException(status_code=404, detail="Subtask not found")