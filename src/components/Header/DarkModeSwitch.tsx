import React, { useState, useEffect } from "react";
import { Moon, Sun } from 'lucide-react';

const DarkModeSwitch = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
    document.documentElement.classList.toggle('dark', newMode);
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="relative flex h-8 w-14 items-center rounded-full bg-gray-300 dark:bg-gray-600 transition-colors duration-300"
      aria-label="Toggle Dark Mode"
    >
      {/* Contenedor de iconos con posición absoluta */}
      <div className="relative flex w-full items-center justify-between">
        {/* Luna (Modo oscuro) */}
        <div className={`absolute left-2 transition-opacity duration-300 ${darkMode ? 'opacity-100' : 'opacity-0'}`}>
          <Moon className="h-4 w-4 text-gray-100" />
        </div>

        {/* Sol (Modo claro) */}
        <div className={`absolute right-2 transition-opacity duration-300 ${darkMode ? 'opacity-0' : 'opacity-100'}`}>
          <Sun className="h-4 w-4 text-yellow-500" />
        </div>
      </div>

      {/* Switch (Botón móvil) */}
      <span
        className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-white dark:bg-gray-200 transition-transform duration-300 transform shadow-md ${darkMode ? 'translate-x-6' : 'translate-x-0'
          }`}
      />
    </button>
  );
};

export default DarkModeSwitch;
