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
    <main className="min-h-screen bg-linier-to-b from-gray-50 to-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* 🔥 CARD */}
        <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
          {/* 🖼️ IMAGE */}
          <div className="relative">
            <img
              src={item.image_url}
              alt={item.name}
              className="
              w-full
              h-64 sm:h-80 md:h-[450px]
              object-cover
            "
            />

            {/* OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

            {/* TITLE OVER IMAGE */}
            <div className="absolute bottom-6 left-6 text-white">
              <span className="bg-blue-500/90 backdrop-blur px-3 py-1 rounded-full text-sm">
                {item.category || "Museum"}
              </span>

              <h1 className="text-3xl md:text-5xl font-extrabold mt-3">
                {item.name}
              </h1>
            </div>
          </div>

          {/* 🔥 CONTENT */}
          <div className="p-6 md:p-8">
            {/* DESCRIPTION */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-3 text-gray-900">
                📖 Deskripsi
              </h2>

              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                {item.description}
              </p>
            </div>

            {/* INFO */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
                <p className="text-sm text-gray-400 mb-1">📅 Tahun</p>

                <p className="font-semibold text-lg">{item.year || "-"}</p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
                <p className="text-sm text-gray-400 mb-1">📍 Asal</p>

                <p className="font-semibold text-lg">{item.origin || "-"}</p>
              </div>
            </div>

            {/* ACTION */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* BOOKMARK */}
              <button
                onClick={toggleBookmark}
                className={`
                flex-1 py-4 rounded-2xl font-semibold text-white
                transition duration-300 shadow-lg

                ${
                  isBookmarked
                    ? "bg-yellow-500 hover:bg-yellow-600"
                    : "bg-gray-800 hover:bg-black"
                }
              `}
              >
                {isBookmarked ? "⭐ Tersimpan" : "☆ Bookmark"}
              </button>

              {/* QUIZ */}
              <button
                onClick={handleQuiz}
                disabled={!hasQuiz}
                className={`
                flex-1 py-4 rounded-2xl font-semibold text-white
                transition duration-300 shadow-lg

                ${
                  hasQuiz
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-300 cursor-not-allowed"
                }
              `}
              >
                🧠 Mulai Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
