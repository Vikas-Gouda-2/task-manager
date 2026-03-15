import React from 'react';
import { motion } from 'framer-motion';
import { BarChart2, PieChart, Activity, Target, ShieldCheck, Zap } from 'lucide-react';

const Dashboard = ({ tasks, profile }) => {
  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const highPriorityTasks = tasks.filter(t => !t.completed && t.priority === 3).length;

  // Simple stats calculation for mock "Weekly progress"
  const stats = [
    { label: 'Completion Rate', value: `${completionRate}%`, icon: PieChart, color: 'text-cyan-400' },
    { label: 'Completed', value: completedTasks, icon: ShieldCheck, color: 'text-emerald-400' },
    { label: 'High Priority', value: highPriorityTasks, icon: Activity, color: 'text-rose-400' },
    { label: 'Total Focus', value: `${profile?.xp || 0} XP`, icon: Target, color: 'text-yellow-400' },
  ];

  const badges = [
    { name: 'Early Bird', earned: completedTasks > 5, desc: 'Complete 5 tasks' },
    { name: 'Power User', earned: profile?.level >= 5, desc: 'Reach Level 5' },
    { name: 'Streak Master', earned: profile?.streak_days >= 3, desc: '3 day streak' },
    { name: 'Focused', earned: profile?.xp >= 500, desc: 'Earn 500 XP' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-12"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel p-6 rounded-3xl border-white/10 flex flex-col items-center text-center group hover:bg-white/10 transition-all cursor-default"
          >
            <stat.icon className={`w-8 h-8 ${stat.color} mb-3 group-hover:scale-110 transition-transform`} />
            <h4 className="text-2xl font-bold text-white mb-1">{stat.value}</h4>
            <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Achievements Section */}
        <div className="glass-panel p-8 rounded-[2.5rem] border-white/10">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400" /> Unlockable Achievements
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {badges.map((badge, i) => (
              <div 
                key={badge.name}
                className={`p-4 rounded-2xl border transition-all ${badge.earned ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/5 border-white/10 grayscale opacity-40'}`}
              >
                <p className={`font-bold text-sm ${badge.earned ? 'text-emerald-300' : 'text-white/60'}`}>{badge.name}</p>
                <p className="text-[10px] text-white/40 mt-1">{badge.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Level Path Section */}
        <div className="glass-panel p-8 rounded-[2.5rem] border-white/10 flex flex-col">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <Zap className="w-5 h-5 text-yellow-400" /> Level Progression
          </h3>
          <div className="flex-1 flex flex-col justify-center items-center gap-6">
             <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="64" cy="64" r="60" className="stroke-white/10" strokeWidth="8" fill="transparent" />
                  <motion.circle 
                    cx="64" cy="64" r="60" 
                    className="stroke-yellow-400" 
                    strokeWidth="8" 
                    fill="transparent" 
                    strokeDasharray="376.99"
                    initial={{ strokeDashoffset: 376.99 }}
                    animate={{ strokeDashoffset: 376.99 - (376.99 * (profile?.xp % 100) / 100) }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-white">{profile?.level || 1}</span>
                  <span className="text-[9px] uppercase tracking-widest text-white/40 font-bold">Level</span>
                </div>
             </div>
             <p className="text-center text-sm text-white/60">
               {100 - (profile?.xp % 100)} XP until Level {(profile?.level || 1) + 1}
             </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
