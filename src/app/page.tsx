"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import CardItem from "../components/ui/CardItem";
import Link from "next/link";
import { Search } from "lucide-react";

type Item = {
  id: number;
  name: string;
  description: string;
  image_url: string;
  category: string;
  year: number;
  origin: string;
};

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔥 FETCH DATA SEKALI AJA
  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    setLoading(true);

    const { data, error } = await supabase
      .from("items")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.log("ERROR FETCH ITEMS:", error);
    }

    if (data) {
      setItems(data);
    }

    setLoading(false);
  }

  // 🔍 FILTER
  const filteredItems = items.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());

    const matchCategory = category
      ? item.category?.toLowerCase() === category.toLowerCase()
      : true;

    return matchSearch && matchCategory;
  });

  return (
    <main className="min-h-screen bg-linier-to-b from-gray-50 to-white text-gray-900">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 md:py-6">
        {/* 🔥 HERO */}
        <section className="relative overflow-hidden rounded-3xl p-8 md:p-14 shadow-2xl mb-10 bg-linear-to-r from-blue-700 via-blue-600 to-indigo-600 text-white">
          {/* BACKGROUND GLOW */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,white,transparent)]"></div>

          {/* BLUR CIRCLE */}
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/20 blur-3xl rounded-full"></div>
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-indigo-400/20 blur-3xl rounded-full"></div>

          {/* CONTENT */}
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="mb-4 inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm backdrop-blur">
              ✨ Museum Digital Interaktif
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
              Jelajahi Sejarah Dengan
              <span className="block text-blue-100">Smart Museum Explorer</span>
            </h1>

            <p className="mt-5 text-sm sm:text-base md:text-lg lg:text-xl text-blue-100 max-w-2xl leading-relaxed">
              Scan QR, pelajari benda bersejarah, ikuti quiz interaktif, dan
              nikmati pengalaman museum modern langsung dari smartphone.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8 w-full sm:w-auto">
              <Link href="/scan">
                <button className="w-full sm:w-auto bg-white text-blue-700 font-semibold px-8 py-3 rounded-2xl shadow-lg hover:scale-105 hover:shadow-2xl transition duration-300">
                  🚀 Mulai Scan
                </button>
              </Link>

              <Link href="/">
                <button className="border border-white/50 bg-white/10 backdrop-blur px-8 py-3 rounded-2xl hover:bg-white/20 transition duration-300">
                  🔍 Jelajahi Museum
                </button>
              </Link>
            </div>

            {/* STATS */}
            <div className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10 w-full max-w-4xl">
              <div className="bg-white/10 backdrop-blur border border-white/10 rounded-2xl p-4">
                <h2 className="text-2xl font-bold">{filteredItems.length}+</h2>
                <p className="text-sm text-blue-100">Koleksi Museum</p>
              </div>

              <div className="bg-white/10 backdrop-blur border border-white/10 rounded-2xl p-4">
                <h2 className="text-2xl font-bold">QR</h2>
                <p className="text-sm text-blue-100">Scan Interaktif</p>
              </div>

              <div className="bg-white/10 backdrop-blur border border-white/10 rounded-2xl p-4">
                <h2 className="text-2xl font-bold">Quiz</h2>
                <p className="text-sm text-blue-100">Edukasi Digital</p>
              </div>

              <div className="bg-white/10 backdrop-blur border border-white/10 rounded-2xl p-4">
                <h2 className="text-2xl font-bold">Smart</h2>
                <p className="text-sm text-blue-100">Museum Modern</p>
              </div>
            </div>
          </div>
        </section>

        {/* 🔍 SEARCH */}
        <section className="bg-white/80 backdrop-blur border border-gray-200 shadow-sm rounded-3xl p-5 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* SEARCH */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

              <input
                type="text"
                placeholder="Cari benda museum..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            {/* FILTER */}
            <select
              title="Filter kategori"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-gray-50 border border-gray-200 px-5 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="">Semua Kategori</option>
              <option value="sejarah">Sejarah</option>
              <option value="budaya">Budaya</option>
            </select>
          </div>
        </section>

        {/* INFO */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Koleksi Museum</h2>

            <p className="text-gray-500 text-sm mt-1">
              Menampilkan {filteredItems.length} item
            </p>
          </div>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-72 rounded-3xl bg-gray-200 animate-pulse"
              />
            ))}
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group hover:-translate-y-2 transition duration-300"
              >
                <CardItem item={item} />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-gray-200 py-20 text-center">
            <div className="text-6xl mb-4">🏛️</div>

            <h2 className="text-2xl font-bold mb-2">Item Tidak Ditemukan</h2>

            <p className="text-gray-500">Coba gunakan kata kunci lain.</p>
          </div>
        )}
      </div>
    </main>
  );
}
