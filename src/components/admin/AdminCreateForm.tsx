"use client";

import { useState } from "react";
import { createItem } from "@/lib/actions/items";
import { useRouter } from "next/navigation";

export default function AdminCreateForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);

    try {
      await createItem(formData);

      router.push("/activity");
      router.refresh();
    } catch (err: any) {
      console.error(err);
      alert(err.message); // 🔥 tampilkan error asli
    } finally {
      setLoading(false);
    }
  }

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  }

  return (
    <>
      <div className="max-w-3xl mx-auto">
        {/* 🔥 HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Tambah Item Museum
          </h1>

          <p className="text-gray-500 mt-2">
            Tambahkan koleksi museum baru ke sistem Smart Museum.
          </p>
        </div>

        {/* 🔥 FORM CARD */}
        <div className="bg-white border border-gray-200 shadow-xl rounded-3xl p-6 md:p-8">
          <form action={handleSubmit} className="space-y-6">
            {/* NAME */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold mb-2"
              >
                Nama Item
              </label>

              <input
                id="name"
                name="name"
                placeholder="Masukkan nama item"
                className="w-full border border-gray-200 bg-gray-50 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
              />
            </div>

            {/* GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* CATEGORY */}
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-semibold mb-2"
                >
                  Category
                </label>

                <input
                  id="category"
                  name="category"
                  placeholder="Masukkan kategori"
                  className="w-full border border-gray-200 bg-gray-50 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              {/* YEAR */}
              <div>
                <label
                  htmlFor="year"
                  className="block text-sm font-semibold mb-2"
                >
                  Year
                </label>

                <input
                  id="year"
                  name="year"
                  type="number"
                  placeholder="Contoh: 1945"
                  className="w-full border border-gray-200 bg-gray-50 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
            </div>

            {/* ORIGIN */}
            <div>
              <label
                htmlFor="origin"
                className="block text-sm font-semibold mb-2"
              >
                Origin
              </label>

              <input
                id="origin"
                name="origin"
                placeholder="Asal item"
                className="w-full border border-gray-200 bg-gray-50 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-semibold mb-2"
              >
                Description
              </label>

              <textarea
                id="description"
                name="description"
                rows={5}
                placeholder="Deskripsi item museum..."
                className="w-full border border-gray-200 bg-gray-50 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
              />
            </div>

            {/* 🔥 UPLOAD */}
            <div>
              <label className="block text-sm font-semibold mb-3">
                Upload Gambar
              </label>

              <div className="border-2 border-dashed border-blue-200 bg-blue-50/40 rounded-3xl p-8 text-center hover:border-blue-400 transition">
                <div className="text-5xl mb-3">🖼️</div>

                <p className="font-medium text-gray-700 mb-2">
                  Upload gambar item museum
                </p>

                <p className="text-sm text-gray-500 mb-4">
                  Drag & drop atau pilih file dari perangkat
                </p>

                <input
                  placeholder="gambar"
                  id="image"
                  type="file"
                  name="image"
                  onChange={handleImage}
                  className="w-full text-sm"
                />
              </div>
            </div>

            {/* 🔥 PREVIEW */}
            {preview && (
              <div>
                <p className="text-sm font-semibold mb-3">Preview Gambar</p>

                <div className="relative w-full max-w-xs overflow-hidden rounded-2xl border border-gray-200 shadow">
                  <img
                    src={preview}
                    alt="Preview gambar"
                    className="w-full h-64 object-cover"
                  />
                </div>
              </div>
            )}

            {/* 🔥 BUTTON */}
            <button
              disabled={loading}
              className={`
              w-full py-4 rounded-2xl font-semibold text-white transition shadow-lg

              ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 hover:scale-[1.01]"
              }
            `}
            >
              {loading ? "Uploading..." : "🚀 Tambah Item"}
            </button>
          </form>
        </div>
      </div>

      {/* 🔥 SUCCESS MODAL */}
      {success && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md text-center animate-in fade-in zoom-in">
            <div className="text-6xl mb-4">✅</div>

            <h2 className="text-2xl font-bold mb-2">Berhasil!</h2>

            <p className="text-gray-500 mb-6">
              Item museum berhasil ditambahkan ke sistem.
            </p>

            <button
              onClick={() => setSuccess(false)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-semibold transition"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </>
  );
}
