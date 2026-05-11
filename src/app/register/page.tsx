"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

import {
  User,
  Mail,
  Lock,
  UserPlus,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [loading, setLoading] = useState(false);

  // 🔥 ALERT
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  async function handleRegister() {
    if (loading) return;

    // 🔥 VALIDASI
    if (!email || !password || !name) {
      setAlert({
        type: "error",
        message: "Semua field wajib diisi",
      });

      setTimeout(() => {
        setAlert(null);
      }, 2500);

      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) {
        throw error;
      }

      const user = data.user;

      // 🔥 UPDATE PROFILE
      if (user) {
        await supabase.from("profiles").update({ name }).eq("id", user.id);
      }

      // 🔥 SUCCESS ALERT
      setAlert({
        type: "success",
        message: "Register berhasil 🎉",
      });

      // 🔥 AUTO LOGIN
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (err: any) {
      setAlert({
        type: "error",
        message: err.message || "Terjadi kesalahan",
      });

      setTimeout(() => {
        setAlert(null);
      }, 2500);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-linier-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center px-4 py-10">
      {/* 🔥 ALERT */}
      {alert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
          <div
            className={`
              w-full max-w-sm rounded-3xl p-6 shadow-2xl text-center
              ${
                alert.type === "success"
                  ? "bg-green-500 text-white"
                  : "bg-red-500 text-white"
              }
            `}
          >
            <div className="flex justify-center mb-3">
              {alert.type === "success" ? (
                <CheckCircle2 className="w-14 h-14" />
              ) : (
                <AlertCircle className="w-14 h-14" />
              )}
            </div>

            <h2 className="text-xl font-bold mb-2">
              {alert.type === "success" ? "Berhasil" : "Oops!"}
            </h2>

            <p className="text-sm opacity-95">{alert.message}</p>
          </div>
        </div>
      )}

      {/* 🔥 CARD */}
      <div className="w-full max-w-md">
        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-blue-600 text-white text-4xl shadow-xl mb-5">
            🏛️
          </div>

          <h1 className="text-4xl font-extrabold text-gray-900">Buat Akun</h1>

          <p className="text-gray-500 mt-2">
            Daftar untuk menikmati fitur Smart Museum
          </p>
        </div>

        {/* FORM */}
        <div className="bg-white/90 backdrop-blur rounded-3xl shadow-2xl border border-gray-100 p-8">
          {/* NAME */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nama
            </label>

            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

              <input
                type="text"
                placeholder="Masukkan nama"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="
                  w-full pl-12 pr-4 py-3 rounded-2xl
                  border border-gray-200 bg-gray-50
                  focus:outline-none focus:ring-2
                  focus:ring-blue-500 transition
                "
              />
            </div>
          </div>

          {/* EMAIL */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

              <input
                type="email"
                placeholder="Masukkan email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="
                  w-full pl-12 pr-4 py-3 rounded-2xl
                  border border-gray-200 bg-gray-50
                  focus:outline-none focus:ring-2
                  focus:ring-blue-500 transition
                "
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

              <input
                type="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="
                  w-full pl-12 pr-4 py-3 rounded-2xl
                  border border-gray-200 bg-gray-50
                  focus:outline-none focus:ring-2
                  focus:ring-blue-500 transition
                "
              />
            </div>
          </div>

          {/* BUTTON */}
          <button
            onClick={handleRegister}
            disabled={loading}
            className="
              w-full bg-blue-600 hover:bg-blue-700
              disabled:bg-blue-400
              text-white py-3 rounded-2xl
              font-semibold transition shadow-lg
              flex items-center justify-center gap-2
            "
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                Register
              </>
            )}
          </button>

          {/* LOGIN */}
          <p className="text-sm text-center text-gray-500 mt-6">
            Sudah punya akun?{" "}
            <span
              onClick={() => router.push("/login")}
              className="text-blue-600 font-semibold cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </main>
  );
}
