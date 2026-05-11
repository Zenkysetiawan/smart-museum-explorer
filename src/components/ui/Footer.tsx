"use client";

import Link from "next/link";
import { Mail, MapPin, Phone, Globe, Camera } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-white mt-20">
      {/* TOP */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* 🔥 BRAND */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🏛️</span>

              <h2 className="text-2xl font-bold">Smart Museum</h2>
            </div>

            <p className="text-gray-400 leading-relaxed text-sm">
              Platform museum digital berbasis QR Code yang membantu pengunjung
              menjelajahi sejarah dengan pengalaman interaktif dan modern.
            </p>
          </div>

          {/* 🔗 MENU */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Navigasi</h3>

            <div className="flex flex-col gap-3 text-gray-400 text-sm">
              <Link href="/" className="hover:text-white transition">
                Home
              </Link>

              <Link href="/scan" className="hover:text-white transition">
                Scan QR
              </Link>

              <Link href="/bookmark" className="hover:text-white transition">
                Bookmark
              </Link>

              <Link href="/activity" className="hover:text-white transition">
                Activity
              </Link>
            </div>
          </div>

          {/* 📌 FEATURES */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Fitur</h3>

            <div className="flex flex-col gap-3 text-gray-400 text-sm">
              <p>📷 QR Code Scanner</p>
              <p>🧠 Interactive Quiz</p>
              <p>⭐ Bookmark Item</p>
              <p>📊 Activity Tracking</p>
            </div>
          </div>

          {/* 📞 CONTACT */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Kontak</h3>

            <div className="space-y-4 text-gray-400 text-sm">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4" />
                <span>smartmuseum@gmail.com</span>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4" />
                <span>+62 838-3940-2782</span>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>Bengkulu, Indonesia</span>
              </div>
            </div>

            {/* 🔥 SOCIAL */}
            <div className="flex gap-4 mt-6">
              <a
                href="#"
                aria-label="instagram"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 transition flex items-center justify-center"
              >
                <Camera className="w-5 h-5" />
              </a>

              <a
                href="#"
                aria-label="Github"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 transition flex items-center justify-center"
              >
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-gray-500">
          <p>© 2026 Smart Museum. All rights reserved.</p>

          <p>Built with ❤️ using Next.js & Supabase</p>
        </div>
      </div>
    </footer>
  );
}
