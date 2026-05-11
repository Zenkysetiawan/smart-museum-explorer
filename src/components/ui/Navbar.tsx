"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

import {
  Menu,
  X,
  Home,
  ScanLine,
  Bookmark,
  Activity,
  LayoutDashboard,
  LogOut,
  LogIn,
} from "lucide-react";

type NavbarProps = {
  user: any;
};

export default function Navbar({ user }: NavbarProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔥 MOBILE MENU
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (user) {
      getProfile(user.id);
    } else {
      setName("");
      setRole("");
      setLoading(false);
    }
  }, [user]);

  // 🔥 GET PROFILE
  async function getProfile(userId: string) {
    const { data } = await supabase
      .from("profiles")
      .select("name, role")
      .eq("id", userId)
      .single();

    if (data) {
      setName(data.name);
      setRole(data.role);
    }

    setLoading(false);
  }

  // 🔥 LOGOUT
  async function handleLogout() {
    await supabase.auth.signOut();

    router.push("/login");
  }

  // 🔥 ACTIVE LINK
  const active = (path: string) =>
    pathname === path
      ? "bg-white text-blue-700 shadow"
      : "text-white hover:bg-white/10";

  if (loading) return null;

  return (
    <nav className="sticky top-0 z-50 backdrop-blur bg-blue-600/95 text-white shadow-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 🔥 LOGO */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-lg sm:text-xl"
          >
            <span className="text-2xl">🏛️</span>

            <span className="hidden sm:block">Smart Museum</span>
          </Link>

          {/* 🔥 DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/"
              className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${active("/")}`}
            >
              <Home className="w-4 h-4" />
              Home
            </Link>

            {/* 🌍 GLOBAL */}
            <Link
              href="/scan"
              className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${active("/scan")}`}
            >
              <ScanLine className="w-4 h-4" />
              Scan
            </Link>

            {/* 👤 USER */}
            {user && (
              <>
                <Link
                  href="/bookmark"
                  className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${active("/bookmark")}`}
                >
                  <Bookmark className="w-4 h-4" />
                  Bookmark
                </Link>

                <Link
                  href="/activity"
                  className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${active("/activity")}`}
                >
                  <Activity className="w-4 h-4" />
                  Activity
                </Link>
              </>
            )}

            {/* 👑 ADMIN */}
            {role === "admin" && (
              <Link
                href="/admin"
                className={`px-4 py-2 rounded-xl transition flex items-center gap-2 text-yellow-200 ${active("/admin")}`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
            )}
          </div>

          {/* 🔥 RIGHT */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    Halo, {name || "User"} 👋
                  </p>

                  <p className="text-xs text-blue-100">{role}</p>
                </div>

                <button
                  onClick={handleLogout}
                  className="bg-white text-blue-700 px-4 py-2 rounded-xl hover:bg-gray-100 transition flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => router.push("/login")}
                className="bg-white text-blue-700 px-4 py-2 rounded-xl hover:bg-gray-100 transition flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Login
              </button>
            )}
          </div>

          {/* 🔥 MOBILE BUTTON */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-xl hover:bg-white/10 transition"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* 🔥 MOBILE MENU */}
      {open && (
        <div className="md:hidden border-t border-white/10 bg-blue-600/95 backdrop-blur">
          <div className="px-4 py-4 space-y-2">
            <Link
              href="/"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${active("/")}`}
              onClick={() => setOpen(false)}
            >
              <Home className="w-5 h-5" />
              Home
            </Link>

            {/* 🌍 GLOBAL */}
            <Link
              href="/scan"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${active("/scan")}`}
              onClick={() => setOpen(false)}
            >
              <ScanLine className="w-5 h-5" />
              Scan
            </Link>

            {/* 👤 USER */}
            {user && (
              <>
                <Link
                  href="/bookmark"
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${active("/bookmark")}`}
                  onClick={() => setOpen(false)}
                >
                  <Bookmark className="w-5 h-5" />
                  Bookmark
                </Link>

                <Link
                  href="/activity"
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${active("/activity")}`}
                  onClick={() => setOpen(false)}
                >
                  <Activity className="w-5 h-5" />
                  Activity
                </Link>
              </>
            )}

            {/* 👑 ADMIN */}
            {role === "admin" && (
              <Link
                href="/admin"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition text-yellow-200 ${active("/admin")}`}
                onClick={() => setOpen(false)}
              >
                <LayoutDashboard className="w-5 h-5" />
                Dashboard
              </Link>
            )}

            {/* 🔐 AUTH */}
            <div className="pt-4 border-t border-white/10">
              {user ? (
                <div className="space-y-3">
                  <div className="px-2">
                    <p className="font-medium">Halo, {name || "User"} 👋</p>

                    <p className="text-sm text-blue-100">{role}</p>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full bg-white text-blue-700 px-4 py-3 rounded-xl hover:bg-gray-100 transition flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setOpen(false);
                    router.push("/login");
                  }}
                  className="w-full bg-white text-blue-700 px-4 py-3 rounded-xl hover:bg-gray-100 transition flex items-center justify-center gap-2"
                >
                  <LogIn className="w-5 h-5" />
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
