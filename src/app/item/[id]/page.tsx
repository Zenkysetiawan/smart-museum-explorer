"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useParams } from "next/navigation";

export default function DetailPage() {
  const { id } = useParams();
  const itemId = Number(id); // 🔥 FIX TYPE

  const [item, setItem] = useState<any>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [hasQuiz, setHasQuiz] = useState(false);

  useEffect(() => {
    if (!itemId) return;

    getItem();
    checkUser();
    checkQuiz();
  }, [itemId]);

  useEffect(() => {
    if (user && itemId) {
      trackView();
    }
  }, [user, itemId]);

  // 📦 GET ITEM
  async function getItem() {
    const { data, error } = await supabase
      .from("items")
      .select("*")
      .eq("id", itemId)
      .single();

    if (error) console.log(error);
    if (data) setItem(data);
  }

  // 👤 GET USER
  async function checkUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUser(user);

    if (user) {
      checkBookmark(user.id);
    }
  }

  // ⭐ CHECK BOOKMARK
  async function checkBookmark(userId: string) {
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .eq("item_id", itemId)
      .maybeSingle(); // 🔥 FIX 406

    if (error) {
      console.log("Bookmark check error:", error);
    }

    setIsBookmarked(!!data);
  }

  // 🔁 TOGGLE BOOKMARK
  async function toggleBookmark() {
    if (!user) {
      window.location.href = "/login";
      return;
    }

    if (isBookmarked) {
      await supabase
        .from("bookmarks")
        .delete()
        .eq("user_id", user.id)
        .eq("item_id", itemId);

      setIsBookmarked(false);
    } else {
      await supabase.from("bookmarks").insert({
        user_id: user.id,
        item_id: itemId,
      });

      setIsBookmarked(true);
    }
  }

  // 👁️ TRACK VIEW
  async function trackView() {
    if (!user) return;

    await supabase.from("activities").insert({
      user_id: user.id,
      item_id: itemId,
      type: "view",
    });
  }

  // 🧠 CEK QUIZ
  async function checkQuiz() {
    const { data } = await supabase
      .from("quiz")
      .select("id")
      .eq("item_id", itemId);

    setHasQuiz(!!data && data.length > 0);
  }

  // 🚀 HANDLE QUIZ
  function handleQuiz() {
    if (!user) {
      window.location.href = "/login";
      return;
    }

    window.location.href = `/quiz/${itemId}`;
  }

  // ⏳ LOADING
  if (!item) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      {/* 🖼️ IMAGE */}
      <div className="rounded-2xl overflow-hidden shadow mb-6">
        <img
          src={item.image_url}
          alt={item.name}
          className="w-full h-64 md:h-96 object-cover"
        />
      </div>

      {/* 📝 TITLE */}
      <h1 className="text-3xl md:text-4xl font-bold mb-2">{item.name}</h1>

      {/* 🏷️ CATEGORY */}
      <span className="inline-block bg-blue-100 text-blue-600 text-sm px-3 py-1 rounded-full mb-4">
        {item.category}
      </span>

      {/* 📄 DESCRIPTION */}
      <p className="text-gray-600 leading-relaxed mb-6">{item.description}</p>

      {/* 📊 INFO GRID */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white border rounded-xl p-4">
          <p className="text-sm text-gray-400">Tahun</p>
          <p className="font-semibold">{item.year}</p>
        </div>

        <div className="bg-white border rounded-xl p-4">
          <p className="text-sm text-gray-400">Asal</p>
          <p className="font-semibold">{item.origin}</p>
        </div>
      </div>

      {/* 🚀 ACTION BUTTON */}
      <div className="flex gap-4">
        <button
          onClick={toggleBookmark}
          className={`flex-1 py-3 rounded-xl shadow text-white transition ${
            isBookmarked
              ? "bg-yellow-500 scale-105"
              : "bg-gray-400 hover:bg-yellow-400"
          }`}
        >
          {isBookmarked ? "⭐ Tersimpan" : "☆ Bookmark"}
        </button>

        <button
          onClick={handleQuiz}
          disabled={!hasQuiz}
          className={`flex-1 py-3 rounded-xl shadow text-white transition ${
            hasQuiz
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          🧠 Mulai Quiz
        </button>
      </div>
    </main>
  );
}
