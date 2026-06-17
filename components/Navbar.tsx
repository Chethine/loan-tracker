"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar({ email }: { email: string }) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-30
                    dark:bg-gray-900 dark:border-gray-700">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏦</span>
          <div>
            <span className="font-bold text-gray-900 dark:text-white text-base leading-tight block">
              Liability Tracker
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500 hidden sm:block">
              Sri Lanka
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:block text-sm text-gray-500 dark:text-gray-400 truncate max-w-[180px]">
            {email}
          </span>
          <ThemeToggle />
          <button
            onClick={handleLogout}
            className="btn-secondary text-sm px-3 py-1.5"
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
}
