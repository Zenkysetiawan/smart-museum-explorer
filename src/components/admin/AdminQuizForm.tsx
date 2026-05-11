"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AdminQuizForm({ items }: any) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  // 🔥 TOAST
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  async function handleSubmit(formData: FormData) {
    setLoading(true);

    const data = {
      item_id: Number(formData.get("item_id")),
      question: formData.get("question"),
      option_a: formData.get("option_a"),
      option_b: formData.get("option_b"),
      option_c: formData.get("option_c"),
      option_d: formData.get("option_d"),
      correct_answer: formData.get("correct_answer"),
    };

    const { error } = await supabase.from("quiz").insert(data);

    if (error) {
      setToast({
        type: "error",
        message: "Gagal menambahkan quiz ❌",
      });
    } else {
      setToast({
        type: "success",
        message: "Quiz berhasil ditambahkan 🎉",
      });

      setTimeout(() => {
        router.push("/admin/quiz");
        router.refresh();
      }, 500);
    }

    setLoading(false);

    setTimeout(() => {
      setToast(null);
    }, 3000);
  }

  return (
    <>
      {/* 🔥 HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">🧠 Tambah Quiz</h1>

        <p className="text-sm text-gray-500 mt-1">
          Tambahkan soal quiz untuk item museum.
        </p>
      </div>

      {/* 🔥 FORM */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <form action={handleSubmit} className="space-y-5">
          {/* ITEM */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Pilih Item Museum
            </label>

            <select
              name="item_id"
              aria-label="Pilih Item"
              className="
                w-full border border-gray-200
                rounded-xl px-4 py-3
                bg-gray-50
                focus:outline-none
                focus:ring-2 focus:ring-blue-500
              "
            >
              {items.map((i: any) => (
                <option key={i.id} value={i.id}>
                  {i.name}
                </option>
              ))}
            </select>
          </div>

          {/* QUESTION */}
          <div>
            <label className="block text-sm font-medium mb-2">Pertanyaan</label>

            <textarea
              name="question"
              placeholder="Masukkan soal quiz..."
              rows={4}
              className="
                w-full border border-gray-200
                rounded-xl px-4 py-3
                bg-gray-50 resize-none
                focus:outline-none
                focus:ring-2 focus:ring-blue-500
              "
            />
          </div>

          {/* OPTIONS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="option_a"
              placeholder="Pilihan A"
              className="
                border border-gray-200
                rounded-xl px-4 py-3
                bg-gray-50
                focus:outline-none
                focus:ring-2 focus:ring-blue-500
              "
            />

            <input
              name="option_b"
              placeholder="Pilihan B"
              className="
                border border-gray-200
                rounded-xl px-4 py-3
                bg-gray-50
                focus:outline-none
                focus:ring-2 focus:ring-blue-500
              "
            />

            <input
              name="option_c"
              placeholder="Pilihan C"
              className="
                border border-gray-200
                rounded-xl px-4 py-3
                bg-gray-50
                focus:outline-none
                focus:ring-2 focus:ring-blue-500
              "
            />

            <input
              name="option_d"
              placeholder="Pilihan D"
              className="
                border border-gray-200
                rounded-xl px-4 py-3
                bg-gray-50
                focus:outline-none
                focus:ring-2 focus:ring-blue-500
              "
            />
          </div>

          {/* ANSWER */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Jawaban Benar
            </label>

            <select
              name="correct_answer"
              aria-label="Jawaban Benar"
              className="
                w-full border border-gray-200
                rounded-xl px-4 py-3
                bg-gray-50
                focus:outline-none
                focus:ring-2 focus:ring-blue-500
              "
            >
              <option value="A">Jawaban A</option>

              <option value="B">Jawaban B</option>

              <option value="C">Jawaban C</option>

              <option value="D">Jawaban D</option>
            </select>
          </div>

          {/* BUTTON */}
          <button
            disabled={loading}
            className={`
              w-full py-3 rounded-xl font-medium transition

              ${
                loading
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }
            `}
          >
            {loading ? "Loading..." : "🚀 Tambah Quiz"}
          </button>
        </form>
      </div>

      {/* 🔥 TOAST */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50">
          <div
            className={`
              px-5 py-4 rounded-2xl shadow-xl text-white font-medium

              ${toast.type === "success" ? "bg-green-500" : "bg-red-500"}
            `}
          >
            {toast.message}
          </div>
        </div>
      )}
    </>
  );
}
