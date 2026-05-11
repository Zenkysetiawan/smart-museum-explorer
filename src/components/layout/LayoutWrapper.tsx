"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { supabase } from "@/lib/supabaseClient";

import Navbar from "../ui/Navbar";
import Footer from "../ui/Footer";

export default function LayoutWrapper({ children }: any) {
  const pathname = usePathname();

  const [user, setUser] = useState<any>(null);

  // 🔥 CHECK USER
  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
    }

    getUser();

    // 🔥 LISTENER LOGIN/LOGOUT
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // 🔥 ADMIN PAGE
  const isAdminPage = pathname.startsWith("/admin");

  return (
    <div className="flex flex-col min-h-screen">
      {/* 🔥 NAVBAR */}
      {!isAdminPage && <Navbar />}

      {/* 🔥 MAIN */}
      <main className="flex-1">{children}</main>

      {/* 🔥 FOOTER */}
      {!isAdminPage && <Footer />}
    </div>
  );
}
