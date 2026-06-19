import {
createContext,
useContext,
useEffect,
useState,
ReactNode,
} from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
theme: Theme;
setTheme: (
theme: Theme
) => void;
toggleTheme: () => void;
}

const ThemeContext =
createContext<
ThemeContextType | undefined

> (undefined);

const STORAGE_KEY =
"task-app-theme";

export function ThemeProvider({
children,
}: {
children: ReactNode;
}) {
const [theme, setTheme] =
useState<Theme>(() => {
if (
typeof window ===
"undefined"
) {
return "light";
}


  const saved =
    localStorage.getItem(
      STORAGE_KEY
    );

  return saved === "dark"
    ? "dark"
    : "light";
});


useEffect(() => {
if (
typeof window !==
"undefined"
) {
localStorage.setItem(
STORAGE_KEY,
theme
);
}
}, [theme]);

const toggleTheme = () => {
setTheme(
theme === "light"
? "dark"
: "light"
);
};

return (
<ThemeContext.Provider
value={{
theme,
setTheme,
toggleTheme,
}}
>
{children}
</ThemeContext.Provider>
);
}

export function useTheme() {
const context =
useContext(ThemeContext);

if (!context) {
throw new Error(
"useTheme must be used within ThemeProvider"
);
}

return context;
}

export { ThemeContext };
