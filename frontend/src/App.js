import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, Reorder, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ListTodo, CheckCircle, Clock, Calendar, Tag, Edit2, X, Check, Timer, Plus, Trash2, Settings, BarChart2, Layout, Award } from "lucide-react";
import { useSoundEffects } from "./useSoundEffects";
import { useSettings } from "./SettingsContext";
import GamificationBar from "./GamificationBar";
import SettingsModal from "./SettingsModal";
import Dashboard from "./Dashboard";
import TaskDetailsModal from "./TaskDetailsModal";

// API Base URL - Render backend
const API_BASE_URL = "https://task-manager-api-25gl.onrender.com";

// Spring Physics configurations
const springTransition = {
  type: "spring",
  stiffness: 400,
  damping: 25,
};

// 3D Staggered Flip Variant for list mount
const flipVariant = {
  hidden: { opacity: 0, rotateX: 90, y: 50, scale: 0.9 },
  show: { opacity: 1, rotateX: 0, y: 0, scale: 1, transition: { ...springTransition, mass: 1.2 } },
  exit: { opacity: 0, scale: 0.8, filter: 'blur(10px)', transition: { duration: 0.3 } }
};

// Particle Explosion Component
const ParticleExplosion = () => {
  const particles = Array.from({ length: 24 });
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
      {particles.map((_, i) => {
        const angle = (Math.PI * 2 * i) / particles.length;
        const velocity = 60 + Math.random() * 80;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 1, x: 0, y: 0, scale: Math.random() * 0.6 + 0.4 }}
            animate={{
              opacity: 0,
              x: Math.cos(angle) * velocity,
              y: Math.sin(angle) * velocity,
              scale: 0
            }}
            transition={{ duration: 0.5 + Math.random() * 0.4, ease: "easeOut" }}
            className={`absolute w-2 h-2 rounded-full ${Math.random() > 0.5 ? 'bg-cyan-400' : 'bg-fuchsia-400'} shadow-[0_0_10px_currentColor]`}
          />
        );
      })}
    </div>
  );
};

// Extracted Task Card for individual 3D physics hook management
const TaskCard = ({ task, onComplete, onDelete, onDetails, formatDate }) => {
  const [showParticles, setShowParticles] = useState(false);

  // 3D Tilt values tracking mouse position
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };
  
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleComplete = (e) => {
    e.stopPropagation();
    if (!task.completed) {
      setShowParticles(true);
      setTimeout(() => setShowParticles(false), 1000);
    }
    onComplete(task.id, task.completed);
  };

  const priorityColors = {
    1: 'border-emerald-500/30',
    2: 'border-amber-500/30',
    3: 'border-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.1)]',
  };

  return (
    <Reorder.Item 
      value={task} 
      variants={flipVariant}
      initial="hidden"
      animate="show"
      exit="exit"
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileDrag={{ scale: 1.05, rotateX: 0, rotateY: 0, zIndex: 50, cursor: "grabbing" }}
      className={`group relative flex flex-col p-6 rounded-[2rem] border transition-all duration-500 cursor-grab overflow-hidden ${task.completed ? 'bg-white/5 border-white/5 opacity-60 backdrop-blur-xl' : `bg-white/10 backdrop-blur-3xl border-white/20 hover:bg-white/20 ${priorityColors[task.priority || 1]} shadow-xl text-white`}`}
      onClick={() => onDetails(task)}
    >
      
      {/* Glare and Particles */}
      {!task.completed && (
         <motion.div 
            className="absolute inset-0 pointer-events-none z-0 opacity-0 group-hover:opacity-40 transition-opacity duration-300"
            style={{ background: 'radial-gradient(circle at center, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 60%)', left: glareX, top: glareY, transform: 'translate(-50%, -50%)', width: '200%', height: '200%' }}
         />
      )}

      <div className="flex items-center justify-between w-full h-full relative z-10" style={{ transform: "translateZ(30px)" }}>
        <div className="flex items-center gap-5 flex-1 min-w-0 pr-4">
          <div className="relative">
            <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.85 }} onClick={handleComplete} className={`relative flex-shrink-0 transition-colors duration-300 z-20 ${task.completed ? 'text-cyan-400' : 'text-white/30 hover:text-cyan-400 group-hover:text-white/60'}`}>
              {task.completed ? <CheckCircle className="w-8 h-8 drop-shadow-[0_0_10px_rgba(34,211,238,0.6)]" /> : <div className="w-8 h-8 rounded-full border-2 border-current" />}
            </motion.button>
            {showParticles && <ParticleExplosion />}
          </div>
          
          <div className="flex flex-col gap-1 min-w-0">
            <span className={`text-lg font-semibold truncate transition-all duration-300 ${task.completed ? 'text-white/30 line-through' : 'text-white/90'}`}>
              {task.title}
            </span>
            {(task.due_date || task.category) && (
              <div className="flex flex-wrap items-center gap-2">
                {task.category && (
                  <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg ${task.completed ? 'bg-white/5 text-white/40' : 'bg-white/10 text-white/70'}`}>
                    <Tag className="w-3 h-3" /> {task.category}
                  </span>
                )}
                {task.due_date && (
                  <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium ${task.completed ? 'text-white/40' : 'text-fuchsia-300/90'}`}>
                    <Clock className="w-3.5 h-3.5" /> {formatDate(task.due_date)}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
          <div className="text-[9px] uppercase tracking-widest font-black text-yellow-400/60">+ {task.xp_reward || 10} XP</div>
          {task.subtasks?.length > 0 && (
            <div className="text-[10px] text-white/40 font-bold">{task.subtasks.filter(s => s.completed).length} / {task.subtasks.length} subtasks</div>
          )}
        </div>
      </div>
    </Reorder.Item>
  );
};


function App() {
  const { settings } = useSettings();
  const playSound = useSoundEffects();
  
  const [tasks, setTasks] = useState([]);
  const [profile, setProfile] = useState(null);
  const [activeView, setActiveView] = useState("tasks"); // "tasks" | "dashboard"
  
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  
  const [filterMode, setFilterMode] = useState("all"); 
  const [currentCategoryFilter, setCurrentCategoryFilter] = useState("All");

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(settings.pomodoroDuration * 60);

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/tasks`);
      const data = await res.json();
      setTasks(data);
    } catch (error) { console.error("Failed to fetch tasks", error); }
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/profile`);
      const data = await res.json();
      if (profile && data.level > profile.level) {
        playSound('level-up');
      }
      setProfile(data);
    } catch (error) { console.error("Failed to fetch profile", error); }
  };

  useEffect(() => {
    fetchTasks();
    fetchProfile();
  }, []);

  useEffect(() => {
    setTimeLeft(settings.pomodoroDuration * 60);
  }, [settings.pomodoroDuration]);

  // Pomodoro
  useEffect(() => {
    let interval = null;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0) {
      playSound('success');
      setTimerActive(false);
      setTimeLeft(settings.breakDuration * 60);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft, playSound, settings.breakDuration]);

  const addTask = async (e) => {
    e?.preventDefault();
    if (!title.trim()) return;
    playSound('pop');

    const payload = {
      title,
      category: category.trim() ? category : null,
      due_date: dueDate ? dueDate : null,
      priority: 1,
      xp_reward: Math.floor(Math.random() * 20) + 10 // Dynamic XP
    };

    try {
      await fetch(`${API_BASE_URL}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      setTitle(""); setCategory(""); setDueDate("");
      fetchTasks();
    } catch (error) { console.error("Error adding task", error); }
  };

  const completeTask = async (id, isCompleted) => {
    if (!isCompleted) playSound('success');
    await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !isCompleted })
    });
    fetchTasks();
    fetchProfile();
  };

  const updateTask = async (id, updates) => {
    await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates)
    });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    playSound('swoosh');
    await fetch(`${API_BASE_URL}/tasks/${id}`, { method: "DELETE" });
    fetchTasks();
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = filterMode === "all" ? true : filterMode === "pending" ? !task.completed : task.completed;
    const matchesCategory = currentCategoryFilter === "All" ? true : task.category === currentCategoryFilter;
    return matchesStatus && matchesCategory;
  });

  const uniqueCategories = ["All", ...new Set(tasks.map(t => t.category).filter(Boolean))];

  return (
    <div className={`min-h-screen transition-colors duration-1000 ${settings.theme === 'dark' ? 'bg-[#020617]' : 'bg-slate-950'} text-white font-sans overflow-hidden relative`}>
      
      {/* Aurora Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
         <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-[var(--accent-color)]/20 rounded-full blur-[150px] animate-aurora-1" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[1000px] h-[1000px] bg-fuchsia-500/20 rounded-full blur-[180px] animate-aurora-2" />
      </div>

      <div className="relative z-10 flex flex-col h-screen w-full overflow-hidden">
        
        {/* Header */}
        <header className="w-full glass-panel border-b border-white/10 z-50">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-4 cursor-default">
                 <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${settings.accentColor}, #6366f1)` }}>
                   <ListTodo className="w-5 h-5" />
                 </div>
                 <h1 className="text-xl font-black tracking-tighter hidden sm:block">TASK MASTER</h1>
               </div>

               <nav className="flex bg-white/5 p-1 rounded-xl border border-white/10 gap-1">
                  <button onClick={() => { playSound('pop'); setActiveView("tasks"); }} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeView === 'tasks' ? 'bg-white/10 text-[var(--accent-color)] shadow-sm' : 'text-white/40 hover:text-white/60'}`}>
                    <Layout className="w-3.5 h-3.5" /> Focus
                  </button>
                  <button onClick={() => { playSound('pop'); setActiveView("dashboard"); }} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeView === 'dashboard' ? 'bg-white/10 text-fuchsia-400 shadow-sm' : 'text-white/40 hover:text-white/60'}`}>
                    <BarChart2 className="w-3.5 h-3.5" /> Stats
                  </button>
               </nav>
            </div>

            <div className="flex items-center gap-4">
              <div 
                className={`flex items-center gap-3 glass-panel px-4 py-2 rounded-xl border-white/10 cursor-pointer hover:bg-white/10 transition-all ${timerActive ? 'animate-pulse ring-1 ring-cyan-500/50' : ''}`}
                onClick={() => setTimerActive(!timerActive)}
              >
                <Timer className={`w-4 h-4 ${timerActive ? 'text-cyan-400' : 'text-white/40'}`} />
                <span className="font-mono font-bold text-sm tracking-wider">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
              </div>
              <button 
                onClick={() => { playSound('pop'); setIsSettingsOpen(true); }}
                className="p-2.5 hover:bg-white/10 rounded-xl border border-white/10 transition-all group"
              >
                <Settings className="w-5 h-5 text-white/40 group-hover:text-white group-hover:rotate-45 transition-all" />
              </button>
            </div>
          </div>
        </header>

        {/* Gamification Bar */}
        <GamificationBar profile={profile} />

        {/* Scrollable Content Container */}
        <main className="flex-1 overflow-y-auto w-full style-scroll pb-24 px-6 pt-12">
          <div className="max-w-4xl mx-auto relative px-1">
            
            <AnimatePresence mode="wait">
              {activeView === "tasks" ? (
                <motion.div key="tasks" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
                  
                  {/* Task Input */}
                  <form onSubmit={addTask} className={`relative glass-panel rounded-[2.5rem] p-4 border transition-all duration-500 ${isFocused ? 'border-[var(--accent-color)]/50 shadow-2xl' : 'border-white/10'}`}>
                    <div className="flex items-center group">
                      <Plus className={`w-8 h-8 ml-4 transition-all duration-700 ${isFocused ? `text-[var(--accent-color)] rotate-90 scale-110` : 'text-white/20'}`} />
                      <input 
                        className="flex-1 bg-transparent border-none px-6 py-6 text-2xl font-bold placeholder:text-white/10 text-white outline-none"
                        placeholder="What needs solving?"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                      />
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={!title.trim()} className={`mr-2 px-10 py-5 rounded-[1.5rem] font-bold transition-all shadow-xl ${title.trim() ? 'bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white' : 'bg-white/5 text-white/10 cursor-not-allowed border border-white/5'}`}>Add Action</motion.button>
                    </div>
                    {isFocused && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="flex items-center gap-6 px-10 pb-4 pt-4 border-t border-white/5 mt-2">
                        <div className="flex items-center gap-2 group/field">
                          <Calendar className="w-4 h-4 text-white/30 group-hover/field:text-cyan-400" />
                          <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="bg-transparent text-sm text-white/60 outline-none cursor-pointer hover:text-white" />
                        </div>
                        <div className="flex items-center gap-2 group/field">
                          <Tag className="w-4 h-4 text-white/30 group-hover/field:text-fuchsia-400" />
                          <input type="text" placeholder="Add Category" value={category} onChange={e => setCategory(e.target.value)} className="bg-transparent text-sm text-white/60 outline-none w-32 placeholder:text-white/10 hover:text-white" />
                        </div>
                      </motion.div>
                    )}
                  </form>

                  {/* Filters & List */}
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 overflow-x-auto pb-2 noscroll">
                        {uniqueCategories.map(cat => (
                          <button key={cat} onClick={() => { playSound('pop'); setCurrentCategoryFilter(cat); }} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${currentCategoryFilter === cat ? 'bg-white/20 text-white border border-white/20' : 'bg-white/5 text-white/30 hover:bg-white/10'}`}>{cat}</button>
                        ))}
                      </div>
                      <div className="flex bg-black/20 p-1 rounded-xl border border-white/10">
                        {['all', 'pending', 'completed'].map(f => (
                          <button key={f} onClick={() => { playSound('pop'); setFilterMode(f); }} className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${filterMode === f ? 'bg-white/10 text-white shadow-sm' : 'text-white/30 hover:text-white/50'}`}>{f}</button>
                        ))}
                      </div>
                    </div>

                    <Reorder.Group axis="y" values={tasks} onReorder={setTasks} className="space-y-4 pb-20">
                      <AnimatePresence mode="popLayout">
                        {filteredTasks.map(task => (
                          <TaskCard key={task.id} task={task} onComplete={completeTask} onDelete={deleteTask} onDetails={setSelectedTask} formatDate={(d) => new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} />
                        ))}
                      </AnimatePresence>
                    </Reorder.Group>
                  </div>

                </motion.div>
              ) : (
                <Dashboard tasks={tasks} profile={profile} />
              )}
            </AnimatePresence>

          </div>
        </main>

      </div>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <TaskDetailsModal 
        task={selectedTask} 
        isOpen={!!selectedTask} 
        onClose={() => setSelectedTask(null)} 
        onUpdate={updateTask} 
        onDelete={deleteTask} 
      />
    </div>
  );
}

export default App;