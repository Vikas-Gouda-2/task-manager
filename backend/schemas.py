from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date

class UserProfileBase(BaseModel):
    xp: int = 0
    level: int = 1
    streak_days: int = 0

class UserProfileResponse(UserProfileBase):
    id: int

    class Config:
        from_attributes = True

class SubtaskBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=100)
    completed: bool = False

class SubtaskCreate(SubtaskBase):
    pass

class SubtaskResponse(SubtaskBase):
    id: int
    task_id: int

    class Config:
        from_attributes = True

class TaskBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=100, description="The title of the task")
    category: Optional[str] = Field(None, max_length=50, description="Optional category (e.g. Work, Personal)")
    tags: Optional[str] = Field(None, description="Comma-separated tags")
    notes: Optional[str] = Field(None, description="Detailed notes for the task")
    priority: int = Field(1, ge=1, le=3, description="Priority: 1 (Low) to 3 (High)")
    due_date: Optional[date] = Field(None, description="Optional due date for the task")
    completed: bool = False
    xp_reward: int = Field(10, description="XP gained for completing")

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=100)
    category: Optional[str] = Field(None, max_length=50)
    tags: Optional[str] = None
    notes: Optional[str] = None
    priority: Optional[int] = Field(None, ge=1, le=3)
    due_date: Optional[date] = None
    completed: Optional[bool] = None

class TaskResponse(TaskBase):
    id: int
    subtasks: List[SubtaskResponse] = []

    class Config:
        from_attributes = True
