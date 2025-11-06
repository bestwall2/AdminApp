"use client";

import { Sun, Moon, Bell, User } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex items-center justify-between p-4 bg-card-light dark:bg-card-dark">
      <div></div>
      <div className="flex items-center space-x-4">
        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
          {theme === 'light' ? <Moon /> : <Sun />}
        </button>
        <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
          <Bell />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
          <User />
        </button>
      </div>
    </header>
  );
};
