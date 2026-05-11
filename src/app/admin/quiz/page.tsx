import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import AdminQuizEditForm from "@/components/admin/AdminQuizEditForm";

type Quiz = {
  id: number;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;

  items?: {
    name: string;
  };
};

export default async function AdminQuizPage() {
  const supabase = await createClient();

  const { data: quiz } = await supabase
    .from("quiz")
    .select("*, items(name)")
    .order("id", { ascending: false });

  async function deleteQuiz(id: number) {
    "use server";

    const supabase = await createClient();

    await supabase.from("quiz").delete().eq("id", id);
  }

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🧠 Quiz Museum</h1>

          <p className="text-sm text-gray-500 mt-1">
            Kelola soal quiz untuk item museum
          </p>
        </div>

        <Link
          href="/admin/quiz/create"
          className="
            bg-blue-600 hover:bg-blue-700
            text-white px-5 py-3 rounded-2xl
            text-sm font-medium transition
            shadow-sm text-center
          "
        >
          + Tambah Quiz
        </Link>
      </div>

      {/* LIST */}
      <div className="space-y-4">
        {quiz?.length === 0 ? (
          <div className="bg-white border rounded-2xl py-16 text-center">
            <div className="text-5xl mb-3">🧠</div>

            <p className="text-gray-500">Belum ada quiz</p>
          </div>
        ) : (
          quiz?.map((q: Quiz) => (
            <div
              key={q.id}
              className="
                bg-white border border-gray-200
                rounded-2xl p-5
                hover:shadow-md transition
              "
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                {/* CONTENT */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                      {q.items?.name || "Museum"}
                    </span>
                  </div>

                  <h2 className="font-semibold text-lg text-gray-900">
                    {q.question}
                  </h2>

                  {/* OPTIONS */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4 text-sm">
                    <div className="bg-gray-50 border rounded-xl px-3 py-2">
                      A. {q.option_a}
                    </div>

                    <div className="bg-gray-50 border rounded-xl px-3 py-2">
                      B. {q.option_b}
                    </div>

                    <div className="bg-gray-50 border rounded-xl px-3 py-2">
                      C. {q.option_c}
                    </div>

                    <div className="bg-gray-50 border rounded-xl px-3 py-2">
                      D. {q.option_d}
                    </div>
                  </div>

                  {/* ANSWER */}
                  <div className="mt-4">
                    <span className="bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full">
                      ✅ Jawaban: {q.correct_answer}
                    </span>
                  </div>
                </div>

                {/* ACTION */}
                <div className="flex gap-2">
                  <Link
                    href={`/admin/quiz/${q.id}/edit`}
                    className=" px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition text-sm"
                  >
                    Edit
                  </Link>

                  <form action={deleteQuiz.bind(null, q.id)}>
                    <button
                      className="
                        px-4 py-2 rounded-xl
                        bg-red-500 text-white
                        hover:bg-red-600 transition
                        text-sm
                      "
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
