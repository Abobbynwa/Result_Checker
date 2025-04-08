import React from 'react';

const ThemeToggle = () => {
  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
  };

  return (
    <button onClick={toggleTheme} className="text-sm text-gray-600 hover:text-black">
      Toggle Theme
    </button>
  );
};

export default ThemeToggle;
