import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Moon, Sun, Volume2, VolumeX, Timer, Palette } from 'lucide-react';
import { useSettings } from './SettingsContext';

const SettingsModal = ({ isOpen, onClose }) => {
  const { settings, updateSettings } = useSettings();

  const accentColors = [
    { name: 'Cyan', color: '#22d3ee' },
    { name: 'Fuchsia', color: '#d946ef' },
    { name: 'Violet', color: '#8b5cf6' },
    { name: 'Emerald', color: '#10b981' },
    { name: 'Amber', color: '#f59e0b' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg glass-panel rounded-[2.5rem] p-8 border-white/20 shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Palette className="w-6 h-6 text-fuchsia-400" /> Settings
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white/50 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-8">
              {/* Theme Selection */}
              <div className="space-y-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">Experience Mode</p>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => updateSettings({ theme: 'default' })}
                    className={`flex items-center justify-center gap-3 p-4 rounded-2xl border transition-all ${settings.theme === 'default' ? 'bg-white/20 border-white/40 text-white shadow-lg' : 'bg-black/20 border-white/5 text-white/40 hover:border-white/20'}`}
                  >
                    <Sun className="w-5 h-5" /> Default
                  </button>
                  <button 
                    onClick={() => updateSettings({ theme: 'dark' })}
                    className={`flex items-center justify-center gap-3 p-4 rounded-2xl border transition-all ${settings.theme === 'dark' ? 'bg-white/20 border-white/40 text-white shadow-lg' : 'bg-black/20 border-white/5 text-white/40 hover:border-white/20'}`}
                  >
                    <Moon className="w-5 h-5" /> Dark
                  </button>
                </div>
              </div>

              {/* Accent Colors */}
              <div className="space-y-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">Accent Color</p>
                <div className="flex flex-wrap gap-4">
                  {accentColors.map((cp) => (
                    <button 
                      key={cp.color}
                      onClick={() => updateSettings({ accentColor: cp.color })}
                      className={`w-12 h-12 rounded-full border-4 transition-all scale-100 hover:scale-110 ${settings.accentColor === cp.color ? 'border-white ring-4 ring-white/20 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
                      style={{ backgroundColor: cp.color }}
                      title={cp.name}
                    />
                  ))}
                </div>
              </div>

              {/* Audio & Timer Toggle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">Sound Effects</p>
                  <button 
                    onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${settings.soundEnabled ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300' : 'bg-white/5 border-white/10 text-white/40'}`}
                  >
                    <span className="font-semibold">{settings.soundEnabled ? 'Enabled' : 'Muted'}</span>
                    {settings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                  </button>
                </div>
                <div className="space-y-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">Pomodoro (min)</p>
                  <div className="flex items-center gap-4 bg-black/20 border border-white/10 rounded-2xl px-4 py-3">
                    <Timer className="w-5 h-5 text-white/40" />
                    <input 
                      type="number" 
                      value={settings.pomodoroDuration} 
                      onChange={(e) => updateSettings({ pomodoroDuration: parseInt(e.target.value) || 25 })}
                      className="bg-transparent text-white font-bold outline-none w-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 flex justify-end">
              <button 
                onClick={onClose}
                className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl transition-all border border-white/10"
              >
                Done
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SettingsModal;
