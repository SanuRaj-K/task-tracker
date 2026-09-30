import { useEffect, useState } from 'react';

const STORAGE_KEY = 'taskly.theme';

function initialTheme() {
  // The document is initialized before React loads to avoid a light-theme flash.
  const initialized = document.documentElement.dataset.theme;
  if (initialized === 'light' || initialized === 'dark') return initialized;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    // Theme switching still works when browser storage is unavailable.
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function useTheme() {
  const [theme, setTheme] = useState(initialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'dark' ? '#14131b' : '#7755d9');
  }, [theme]);

  function toggleTheme() {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    try {
      localStorage.setItem(STORAGE_KEY, nextTheme);
    } catch {
      // Keep the chosen theme for this session if it cannot be saved.
    }
  }

  return { theme, toggleTheme };
}
