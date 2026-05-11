"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

type Bookmark = {
  id: number;
  item: {
    id: number;
    name: string;
    image_url: string;
    origin: string;
    year: number;
  };
};

export default function BookmarkPage() {
  const [items, setItems] = useState<Bookmark[]>([]);

  useEffect(() => {
    getBookmarks();
  }, []);

  async function getBookmarks() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    const { data } = await supabase
      .from("bookmarks")
      .select("id, items(*)")
      .eq("user_id", user.id); // 🔥 INI PENTING

    if (data) {
      const cleanData = data
        .map((b) => {
          let item = Array.isArray(b.items) ? b.items[0] : b.items;

          return {
            id: b.id,
            item,
          };
        })
        .filter((b) => b.item);

      setItems(cleanData);
    }
  }

  async function deleteBookmark(id: number) {
    const { error } = await supabase.from("bookmarks").delete().eq("id", id);

    if (error) {
      console.log(error);
      alert("Gagal hapus");
    } else {
      getBookmarks();
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">⭐ Favorit Saya</h1>

      {/* EMPTY STATE */}
      {items.length === 0 && (
        <p className="text-gray-500 text-center mt-10">Belum ada bookmark 😢</p>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((b) => (
          <div
            key={b.id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition flex overflow-hidden"
          >
            {/* IMAGE */}
            <Link href={`/item/${b.item.id}`}>
              <img
                src={b.item.image_url}
                alt={b.item.name}
                className="w-32 h-32 object-cover cursor-pointer"
              />
            </Link>

            {/* CONTENT */}
            <div className="p-4 flex flex-col justify-between flex-1">
              <div>
                <Link href={`/item/${b.item.id}`}>
                  <h2 className="font-bold text-lg hover:underline cursor-pointer">
                    {b.item.name}
                  </h2>
                </Link>

                <p className="text-sm text-gray-500 mt-1">
                  {b.item.origin} • {b.item.year}
                </p>
              </div>

              {/* ACTION */}
              <button
                onClick={() => deleteBookmark(b.id)}
                className="text-red-500 text-sm mt-2 hover:underline self-start"
              >
                ❌ Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
