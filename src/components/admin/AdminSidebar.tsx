"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  const menu = [
    { name: "Dashboard", path: "/admin", icon: "🏛️" },
    { name: "Quiz", path: "/admin/quiz", icon: "🧠" },
    { name: "Home", path: "/", icon: "🌐" },
  ];

  return (
    <>
      {/* 🔥 MOBILE TOP BAR */}
      <div className="md:hidden flex items-center justify-between bg-gray-900 text-white px-4 py-3 shadow">
        <div>
          <h1 className="text-lg font-bold">🏛️ Smart Museum</h1>
          <p className="text-xs text-gray-400">Admin Panel</p>
        </div>

        <button onClick={() => setOpen(true)} className="text-xl font-bold">
          ☰
        </button>
      </div>

      {/* 🔥 OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* 🔥 SIDEBAR */}
      <div
        className={`
          fixed z-50 top-0 left-0 h-screen w-64
          bg-gradient-to-b from-gray-900 via-gray-800 to-black
          text-white p-6
          border-r border-white/10 backdrop-blur-md
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:block
        `}
      >
        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-xl font-bold tracking-wide">🏛️ Smart Museum</h1>
          <p className="text-xs text-gray-400">Admin Panel</p>
        </div>

        {/* MENU */}
        <div className="space-y-2">
          {menu.map((m) => {
            const active = pathname === m.path;

            return (
              <button
                key={m.path}
                onClick={() => {
                  router.push(m.path);
                  setOpen(false);
                }}
                className={`
                  flex items-center gap-3 w-full px-3 py-2 rounded-lg transition
                  ${active ? "bg-white/20 font-semibold" : "hover:bg-white/10"}
                `}
              >
                <span>{m.icon}</span>
                <span>{m.name}</span>
              </button>
            );
          })}
        </div>

        {/* FOOTER */}
        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/20 transition"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </>
  );
}
