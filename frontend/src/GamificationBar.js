import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Award, Flame } from 'lucide-react';

const GamificationBar = ({ profile }) => {
  if (!profile) return null;

  const xpProgress = (profile.xp % 100);
  const currentLevel = profile.level;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto px-6 pt-4 flex items-center gap-6"
    >
      {/* Level Badge */}
      <div className="flex items-center gap-3 glass-panel px-4 py-2 rounded-2xl border-white/20">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-600 flex items-center justify-center shadow-lg">
          <Award className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Level</p>
          <p className="text-xl font-bold text-white leading-none">{currentLevel}</p>
        </div>
      </div>

      {/* XP Progress Bar */}
      <div className="flex-1 glass-panel px-4 py-3 rounded-2xl border-white/20 flex flex-col gap-1.5">
        <div className="flex justify-between items-center px-1">
          <span className="text-[10px] uppercase tracking-widest text-white/60 font-bold flex items-center gap-1">
            <Zap className="w-3 h-3 text-yellow-400" /> XP Progress
          </span>
          <span className="text-[10px] font-bold text-white/80">{profile.xp % 100} / 100</span>
        </div>
        <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${xpProgress}%` }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-fuchsia-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]"
          />
        </div>
      </div>

      {/* Streak */}
      <div className="flex items-center gap-3 glass-panel px-4 py-2 rounded-2xl border-white/20">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-orange-600 flex items-center justify-center shadow-lg">
          <Flame className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Streak</p>
          <p className="text-xl font-bold text-white leading-none">{profile.streak_days || 0}d</p>
        </div>
      </div>
    </motion.div>
  );
};

export default GamificationBar;
