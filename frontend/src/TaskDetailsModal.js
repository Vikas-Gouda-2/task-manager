import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Tag, AlignLeft, CheckCircle2, Circle, Trash2, Plus, Flag } from 'lucide-react';

// API Base URL - uses environment variable or defaults to localhost
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

const TaskDetailsModal = ({ task, isOpen, onClose, onUpdate, onDelete }) => {
  const [activeTask, setActiveTask] = useState(task);
  const [newSubtask, setNewSubtask] = useState("");

  useEffect(() => {
    setActiveTask(task);
  }, [task]);

  if (!activeTask) return null;

  const handleUpdate = (updates) => {
    const updated = { ...activeTask, ...updates };
    setActiveTask(updated);
    onUpdate(activeTask.id, updates);
  };

  const addSubtask = async (e) => {
    e?.preventDefault();
    if (!newSubtask.trim()) return;

    try {
      const res = await fetch(`${API_BASE_URL}/tasks/${activeTask.id}/subtasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newSubtask, completed: false })
      });
      const data = await res.json();
      setActiveTask(prev => ({
        ...prev,
        subtasks: [...(prev.subtasks || []), data]
      }));
      setNewSubtask("");
    } catch (error) {
      console.error("Error adding subtask", error);
    }
  };

  const toggleSubtask = async (subid, completed) => {
    try {
      await fetch(`${API_BASE_URL}/subtasks/${subid}?completed=${!completed}`, {
        method: "PUT"
      });
      setActiveTask(prev => ({
        ...prev,
        subtasks: prev.subtasks.map(s => s.id === subid ? { ...s, completed: !completed } : s)
      }));
    } catch (error) {
      console.error("Error toggling subtask", error);
    }
  };

  const deleteSubtask = async (subid) => {
    try {
      await fetch(`${API_BASE_URL}/subtasks/${subid}`, { method: "DELETE" });
      setActiveTask(prev => ({
        ...prev,
        subtasks: prev.subtasks.filter(s => s.id !== subid)
      }));
    } catch (error) {
      console.error("Error deleting subtask", error);
    }
  };

  const priorityColors = {
    1: 'text-emerald-400 bg-emerald-500/10',
    2: 'text-amber-400 bg-amber-500/10',
    3: 'text-rose-400 bg-rose-500/10',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-md" />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 30 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            className="relative w-full max-w-2xl glass-panel rounded-[3rem] border-white/20 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-8 pb-4 flex items-start justify-between">
              <div className="flex-1">
                <input 
                  value={activeTask.title} 
                  onChange={(e) => handleUpdate({ title: e.target.value })}
                  className="w-full bg-transparent text-3xl font-bold text-white outline-none focus:ring-2 focus:ring-cyan-400/20 rounded-xl px-2 -ml-2"
                />
                <p className="text-white/40 text-sm mt-1 flex items-center gap-2">
                  Created task earning <span className="text-yellow-400 font-bold">{activeTask.xp_reward} XP</span>
                </p>
              </div>
              <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-2xl text-white/50 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 pt-4 space-y-10 custom-scrollbar">
              {/* Properties Grid */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                   <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold flex items-center gap-2">
                     <Calendar className="w-3 h-3" /> Due Date
                   </p>
                   <input 
                     type="date" 
                     value={activeTask.due_date || ""} 
                     onChange={(e) => handleUpdate({ due_date: e.target.value })}
                     className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-400/50 transition-all"
                   />
                </div>
                <div className="space-y-2">
                   <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold flex items-center gap-2">
                     <Tag className="w-3 h-3" /> Category
                   </p>
                   <input 
                     type="text" 
                     placeholder="No category"
                     value={activeTask.category || ""} 
                     onChange={(e) => handleUpdate({ category: e.target.value })}
                     className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-400/50 transition-all"
                   />
                </div>
                <div className="space-y-2">
                   <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold flex items-center gap-2">
                     <Flag className="w-3 h-3" /> Priority
                   </p>
                   <div className="flex gap-2">
                      {[1, 2, 3].map(p => (
                        <button 
                          key={p} 
                          onClick={() => handleUpdate({ priority: p })}
                          className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${activeTask.priority === p ? `${priorityColors[p]} border-current shadow-lg` : 'bg-white/5 border-white/5 text-white/30 hover:bg-white/10'}`}
                        >
                          {p === 1 ? 'Low' : p === 2 ? 'Mid' : 'High'}
                        </button>
                      ))}
                   </div>
                </div>
              </div>

              {/* Notes Section */}
              <div className="space-y-3">
                <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold flex items-center gap-2">
                  <AlignLeft className="w-3 h-3" /> Notes & Thoughts
                </p>
                <textarea 
                  placeholder="Elaborate on your task..."
                  value={activeTask.notes || ""}
                  onChange={(e) => handleUpdate({ notes: e.target.value })}
                  className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white/80 outline-none focus:border-cyan-400/50 transition-all resize-none"
                />
              </div>

              {/* Subtasks Section */}
              <div className="space-y-4">
                <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold flex items-center gap-2">
                  <Plus className="w-3 h-3" /> Subtasks
                </p>
                <div className="space-y-2">
                  {activeTask.subtasks?.map(sub => (
                    <motion.div 
                      key={sub.id} 
                      initial={{ opacity: 0, x: -10 }} 
                      animate={{ opacity: 1, x: 0 }}
                      className="group flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <button onClick={() => toggleSubtask(sub.id, sub.completed)} className={sub.completed ? 'text-cyan-400' : 'text-white/20 hover:text-white/40'}>
                        {sub.completed ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                      </button>
                      <span className={`text-sm flex-1 ${sub.completed ? 'text-white/30 line-through' : 'text-white/80'}`}>{sub.title}</span>
                      <button onClick={() => deleteSubtask(sub.id)} className="opacity-0 group-hover:opacity-100 p-1.5 hover:text-rose-400 transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
                <form onSubmit={addSubtask} className="flex gap-2">
                   <input 
                    type="text" 
                    placeholder="Add a step..."
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    className="flex-1 bg-transparent border-b border-white/10 px-2 py-2 text-sm text-white focus:border-cyan-400 outline-none transition-colors"
                   />
                   <button type="submit" className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold text-white transition-all">Add</button>
                </form>
              </div>
            </div>

            {/* Footer */}
            <div className="p-8 pt-4 flex gap-4 border-t border-white/10 bg-black/20">
              <button 
                onClick={() => { onDelete(activeTask.id); onClose(); }} 
                className="px-6 py-3 text-rose-400 hover:bg-rose-500/10 rounded-2xl flex items-center gap-2 text-sm font-bold transition-all"
              >
                <Trash2 className="w-4 h-4" /> Delete Task
              </button>
              <div className="flex-1" />
              <button 
                onClick={onClose} 
                className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-2xl shadow-lg transition-all"
              >
                All Set
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TaskDetailsModal;
