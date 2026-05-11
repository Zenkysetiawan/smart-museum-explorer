"use client";

import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";

type Item = {
  id: number;
  name: string;
  description: string;
  image_url: string;
  category: string;
  year: number;
  origin: string;
};

export default function CardItem({ item }: { item: Item }) {
  const [user, setUser] = useState<any>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);

    if (user) {
      checkBookmark(user.id);
    }
  }

  async function checkBookmark(userId: string) {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .eq("item_id", item.id)
      .single();

    setIsBookmarked(!!data);
  }

  async function toggleBookmark() {
    if (!user) {
      window.location.href = "/login";
      return;
    }

    setLoading(true);

    if (isBookmarked) {
      await supabase
        .from("bookmarks")
        .delete()
        .eq("user_id", user.id)
        .eq("item_id", item.id);

      setIsBookmarked(false);
    } else {
      await supabase.from("bookmarks").insert({
        user_id: user.id,
        item_id: item.id,
      });

      setIsBookmarked(true);
    }

    setLoading(false);
  }

  return (
    <div className="group border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 bg-white">
      {/* IMAGE */}
      <div className="relative overflow-hidden">
        <Link href={`/item/${item.id}`}>
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-40 object-cover transform group-hover:scale-110 transition duration-500 cursor-pointer"
          />
        </Link>

        {/* BADGE CATEGORY */}
        <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full shadow">
          {item.category}
        </span>

        {/* BOOKMARK FLOAT BUTTON */}
        <button
          onClick={toggleBookmark}
          disabled={loading}
          className={`absolute top-2 right-2 w-9 h-9 flex items-center justify-center rounded-full shadow transition 
            ${isBookmarked ? "bg-yellow-400" : "bg-white hover:bg-yellow-100"}
          `}
        >
          {isBookmarked ? "⭐" : "☆"}
        </button>
      </div>

      {/* CONTENT */}
      <div className="p-4">
        <Link href={`/item/${item.id}`}>
          <h2 className="font-bold text-lg cursor-pointer group-hover:text-blue-600 transition">
            {item.name}
          </h2>
        </Link>

        <p className="text-sm text-gray-600 line-clamp-2 mt-1">
          {item.description}
        </p>

        {/* INFO */}
        <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
          <span>{item.origin}</span>
          <span>{item.year}</span>
        </div>
      </div>
    </div>
  );
}
