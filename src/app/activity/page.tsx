"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function ActivityPage() {
  const [activities, setActivities] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    getUser();
  }, []);

  async function getUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    setUser(user);
    getActivities(user.id);
  }

  async function getActivities(userId: string) {
    const { data } = await supabase
      .from("activities")
      .select("*, items(*)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (data) setActivities(data);
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">📊 Aktivitas Saya</h1>

      {activities.length === 0 && (
        <p className="text-gray-500 text-center">Belum ada aktivitas 😢</p>
      )}

      <div className="space-y-4">
        {activities.map((a) => (
          <div
            key={a.id}
            className="bg-white border rounded-xl p-4 shadow hover:shadow-md transition"
          >
            <div className="flex justify-between items-center">
              <div>
                <Link href={`/item/${a.item_id}`}>
                  <h2 className="font-bold hover:underline">
                    {a.items?.name || "Item"}
                  </h2>
                </Link>

                <p className="text-sm text-gray-500">
                  {a.type === "view" && "📖 Membaca"}
                  {a.type === "quiz" && `🧠 Quiz (Skor: ${a.score})`}
                </p>
              </div>

              <span className="text-xs text-gray-400">
                {new Date(a.created_at).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
