import { createContext, useContext, useEffect, useState } from "react";

// No explicit types needed in JavaScript, but we can keep the concept in mind.
// type Theme = "dark" | "light" | "system"

// type ThemeProviderProps = {
//   children: React.ReactNode
//   defaultTheme?: Theme
//   storageKey?: string
// }

// type ThemeProviderState = {
//   theme: Theme
//   setTheme: (theme: Theme) => void
// }

const initialState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = createContext(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}) {
  // Initialize theme from localStorage or use defaultTheme
  const [theme, setTheme] = useState(
    () => localStorage.getItem(storageKey) || defaultTheme
  );

  // Effect to apply the theme class to the document's root element
  useEffect(() => {
    const root = window.document.documentElement;

    // Remove existing theme classes
    root.classList.remove("light", "dark");

    // Apply system theme if 'system' is selected
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
      return;
    }

    // Apply the selected theme
    root.classList.add(theme);
  }, [theme]); // Re-run effect when theme changes

  // Value provided by the context
  const value = {
    theme,
    setTheme: (newTheme) => {
      // Save the new theme to localStorage
      localStorage.setItem(storageKey, newTheme);
      // Update the component's state
      setTheme(newTheme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  // Ensure the hook is used within the ThemeProvider
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
