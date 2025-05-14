import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Define the theme context
interface ThemeContextType {
  currentTheme: string;
  setTheme: (theme: string) => void;
}

// Create the context with default values
const ThemeContext = createContext<ThemeContextType>({
  currentTheme: 'sunset',
  setTheme: () => {},
});

// Hook for easy access to the theme context
export const useTheme = () => useContext(ThemeContext);

// Theme provider component
interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Initialize state from localStorage if available
  const [currentTheme, setCurrentTheme] = useState<string>(() => {
    const saved = localStorage.getItem('dashboard-theme');
    return saved || 'sunset';
  });

  // Update localStorage when theme changes
  useEffect(() => {
    localStorage.setItem('dashboard-theme', currentTheme);
    
    // You could also make an API call here to save the theme preference
    // Example: api.post('/user/preferences', { theme: currentTheme });
  }, [currentTheme]);

  // Set theme function
  const setTheme = (theme: string) => {
    setCurrentTheme(theme);
  };

  // Provide the theme context to children
  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};