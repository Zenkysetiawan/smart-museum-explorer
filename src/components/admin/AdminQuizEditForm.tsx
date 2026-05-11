"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AdminQuizEditForm({ quiz, items }: any) {
  const router = useRouter();

  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState(quiz);

  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit() {
    setLoading(true);

    const { error } = await supabase
      .from("quiz")
      .update(form)
      .eq("id", quiz.id);

    if (error) {
      setToast({
        type: "error",
        message: "Gagal update quiz ❌",
      });
    } else {
      setToast({
        type: "success",
        message: "Quiz berhasil diupdate 🎉",
      });

      setTimeout(() => {
        router.push("/admin/quiz");
      }, 1500);
    }

    setLoading(false);

    setTimeout(() => {
      setToast(null);
    }, 3000);
  }
  return (
    <>
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">✏️ Edit Quiz</h1>

        <p className="text-sm text-gray-500 mt-1">Perbarui soal quiz museum</p>
      </div>

      {/* FORM */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="space-y-5">
          {/* ITEM */}
          <div>
            <label className="block text-sm font-medium mb-2">Pilih Item</label>

            <select
              title="item"
              name="item_id"
              value={form.item_id}
              onChange={handleChange}
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
              value={form.question}
              onChange={handleChange}
              rows={4}
              placeholder="Masukkan soal"
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
              value={form.option_a}
              onChange={handleChange}
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
              value={form.option_b}
              onChange={handleChange}
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
              value={form.option_c}
              onChange={handleChange}
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
              value={form.option_d}
              onChange={handleChange}
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
              title="correct"
              name="correct_answer"
              value={form.correct_answer}
              onChange={handleChange}
              className="
              w-full border border-gray-200
              rounded-xl px-4 py-3
              bg-gray-50
              focus:outline-none
              focus:ring-2 focus:ring-blue-500
            "
            >
              <option value="">-- Pilih Jawaban --</option>

              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
          </div>

          {/* BUTTON */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`
            w-full py-3 rounded-xl font-medium transition

            ${
              loading
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }
          `}
          >
            {loading ? "Updating..." : "🚀 Update Quiz"}
          </button>
        </div>
      </div>

      {/* 🔥 TOAST */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50">
          <div
            className={`
        px-5 py-4 rounded-2xl shadow-xl
        text-white font-medium

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
