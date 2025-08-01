import { useTheme as useNextTheme } from "next-themes";

export const useTheme = () => {
  const { theme, setTheme, resolvedTheme } = useNextTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return {
    theme: resolvedTheme || 'light',
    setTheme,
    toggleTheme,
  };
}; 