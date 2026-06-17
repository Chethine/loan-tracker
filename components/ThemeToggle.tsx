"use client";

import { useTheme } from "@/contexts/ThemeContext";

export default function ThemeToggle() {
  const { theme, mounted, toggle } = useTheme();

  if (!mounted) {
    return <div className="w-9 h-9" />;
  }

  return (
    <button
      onClick={toggle}
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="w-9 h-9 flex items-center justify-center rounded-lg
                 text-gray-500 hover:text-gray-700 hover:bg-gray-100
                 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700
                 transition-colors duration-150"
    >
      {theme === "dark" ? (
        /* Sun icon */
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1Zm0 16a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1ZM4.222 5.636a1 1 0 0 1 1.414-1.414l.707.707A1 1 0 0 1 4.93 6.343l-.707-.707Zm13.436 12.728a1 1 0 0 1 1.414-1.414l.707.707a1 1 0 0 1-1.414 1.414l-.707-.707ZM2 12a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2H3a1 1 0 0 1-1-1Zm18 0a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2h-1a1 1 0 0 1-1-1ZM4.929 17.657a1 1 0 0 1-1.414-1.414l.707-.707a1 1 0 0 1 1.414 1.414l-.707.707Zm14.142-13.435a1 1 0 0 1-1.414 1.414l-.707-.707a1 1 0 0 1 1.414-1.414l.707.707ZM12 7a5 5 0 1 1 0 10A5 5 0 0 1 12 7Z"/>
        </svg>
      ) : (
        /* Moon icon */
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
          <path d="M21.64 13a1 1 0 0 0-1.05-.14 8.05 8.05 0 0 1-3.37.73 8.15 8.15 0 0 1-8.14-8.1 8.59 8.59 0 0 1 .25-2A1 1 0 0 0 8 2.36a10.14 10.14 0 1 0 14 11.69 1 1 0 0 0-.36-1.05Z"/>
        </svg>
      )}
    </button>
  );
}
