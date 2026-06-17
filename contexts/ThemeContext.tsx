"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { createClient } from "@/lib/supabase/client";

type Theme = "light" | "dark";

interface ThemeCtx {
  theme: Theme;
  mounted: boolean;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeCtx>({
  theme: "light",
  mounted: false,
  toggle: () => {},
});

function applyTheme(t: Theme) {
  if (t === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  // On mount: read from localStorage, then sync from Supabase
  useEffect(() => {
    const local = (localStorage.getItem("theme") ?? "light") as Theme;
    setTheme(local);
    applyTheme(local);
    setMounted(true);

    // Async: pull preference from Supabase for cross-device sync
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase
        .from("user_preferences")
        .select("theme")
        .eq("user_id", user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (data?.theme && data.theme !== local) {
            const remote = data.theme as Theme;
            setTheme(remote);
            localStorage.setItem("theme", remote);
            applyTheme(remote);
          }
        });
    });
  }, []);

  const toggle = useCallback(async () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    applyTheme(next);

    // Persist to Supabase for cross-device sync
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from("user_preferences")
        .upsert({ user_id: user.id, theme: next }, { onConflict: "user_id" });
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, mounted, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
