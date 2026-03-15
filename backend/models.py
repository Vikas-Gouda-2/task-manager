from sqlalchemy import Column, Integer, String, Boolean, Date, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class UserProfile(Base):
    __tablename__ = "user_profile"

    id = Column(Integer, primary_key=True, index=True)
    xp = Column(Integer, default=0)
    level = Column(Integer, default=1)
    streak_days = Column(Integer, default=0)

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    category = Column(String, nullable=True)
    tags = Column(String, nullable=True) # Stored as comma separated strings
    notes = Column(String, nullable=True)
    priority = Column(Integer, default=1) # 1: Low, 2: Medium, 3: High
    due_date = Column(Date, nullable=True)
    completed = Column(Boolean, default=False)
    xp_reward = Column(Integer, default=10) # XP gained for completing
    
    subtasks = relationship("Subtask", back_populates="task", cascade="all, delete-orphan")

class Subtask(Base):
    __tablename__ = "subtasks"

    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("tasks.id"))
    title = Column(String, index=True)
    completed = Column(Boolean, default=False)
    
    task = relationship("Task", back_populates="subtasks")