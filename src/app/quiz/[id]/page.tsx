"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useParams } from "next/navigation";
import Link from "next/link";

type QuizType = {
  id: number;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
};

export default function QuizPage() {
  const { id } = useParams();

  const [questions, setQuestions] = useState<QuizType[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getQuiz();
    }
  }, [id]);

  async function getQuiz() {
    setLoading(true);

    const { data, error } = await supabase
      .from("quiz")
      .select("*")
      .eq("item_id", Number(id));

    if (!error && data) {
      setQuestions(data);
    }

    setLoading(false);
  }

  function handleSelect(qId: number, option: string) {
    if (score !== null) return;

    setAnswers((prev) => ({
      ...prev,
      [qId]: option,
    }));
  }

  async function handleSubmit() {
    let correct = 0;

    questions.forEach((q) => {
      if (answers[q.id] === q.correct_answer) {
        correct++;
      }
    });

    const finalScore = Math.round((correct / questions.length) * 100);

    setScore(finalScore);

    // 🔥 SAVE ACTIVITY
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await supabase.from("activities").insert({
        user_id: user.id,
        item_id: Number(id),
        type: "quiz",
        score: finalScore,
      });
    }
  }

  // 🔥 LOADING
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-medium animate-pulse">Loading quiz...</p>
      </div>
    );
  }

  // 🔥 EMPTY STATE
  if (!loading && questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <h1 className="text-3xl font-bold mb-3">Quiz Belum Tersedia 😢</h1>

        <p className="text-gray-500 mb-6">
          Admin belum menambahkan quiz untuk item ini.
        </p>

        <Link
          href={`/item/${id}`}
          className="bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 transition"
        >
          Kembali ke Detail Item
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold mb-2">🧠 Museum Quiz</h1>

        <p className="text-gray-500">Jawab semua pertanyaan dengan benar.</p>

        <div className="mt-4 text-sm bg-blue-100 text-blue-700 inline-block px-4 py-2 rounded-full">
          Total Soal: {questions.length}
        </div>
      </div>

      {/* RESULT */}
      {score !== null && (
        <div className="mb-8 bg-green-100 border border-green-300 text-green-700 p-5 rounded-2xl text-center">
          <h2 className="text-2xl font-bold mb-2">🎉 Quiz Selesai</h2>

          <p className="text-lg">
            Skor kamu:
            <span className="font-bold text-2xl ml-2">{score}</span>
          </p>
        </div>
      )}

      {/* QUESTIONS */}
      <div className="space-y-8">
        {questions.map((q, index) => (
          <div
            key={q.id}
            className="border border-gray-200 rounded-2xl p-6 shadow-sm"
          >
            {/* QUESTION */}
            <h2 className="text-lg font-semibold mb-5">
              {index + 1}. {q.question}
            </h2>

            {/* OPTIONS */}
            <div className="space-y-3">
              {["A", "B", "C", "D"].map((opt) => {
                const selected = answers[q.id] === opt;

                const isCorrect = q.correct_answer === opt;

                const showResult = score !== null;

                return (
                  <label
                    key={opt}
                    className={`
                      flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition

                      ${
                        selected
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:bg-gray-50"
                      }

                      ${
                        showResult && isCorrect
                          ? "bg-green-100! border-green-500!"
                          : ""
                      }

                      ${
                        showResult && selected && !isCorrect
                          ? "bg-red-100! border-red-500!"
                          : ""
                      }
                    `}
                  >
                    <input
                      type="radio"
                      disabled={score !== null}
                      name={`q-${q.id}`}
                      checked={selected}
                      onChange={() => handleSelect(q.id, opt)}
                    />

                    <span>
                      {q[`option_${opt.toLowerCase()}` as keyof QuizType]}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* BUTTON */}
      <div className="mt-10">
        {score === null ? (
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-semibold transition"
          >
            Submit Jawaban
          </button>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href={`/item/${id}`}
              className="flex-1 text-center bg-gray-200 hover:bg-gray-300 py-4 rounded-2xl font-semibold transition"
            >
              Kembali ke Item
            </Link>

            <button
              onClick={() => {
                setAnswers({});
                setScore(null);
              }}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-semibold transition"
            >
              Ulangi Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
