import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('taskManagerSettings');
    return saved ? JSON.parse(saved) : {
      theme: 'default',
      accentColor: '#22d3ee', // Cyan 400
      soundEnabled: true,
      pomodoroDuration: 25,
      breakDuration: 5,
    };
  });

  useEffect(() => {
    localStorage.setItem('taskManagerSettings', JSON.stringify(settings));
    
    // Apply theme variables
    document.documentElement.style.setProperty('--accent-color', settings.accentColor);
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
