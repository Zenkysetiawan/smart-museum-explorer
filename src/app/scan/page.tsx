"use client";

import { useRef, useState, useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useRouter } from "next/navigation";
import { Camera, CameraOff, QrCode } from "lucide-react";

export default function ScanPage() {
  const router = useRouter();

  const scannerRef = useRef<Html5Qrcode | null>(null);

  const [isRunning, setIsRunning] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // 🔥 DETECT DEVICE
  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkDevice();

    window.addEventListener("resize", checkDevice);

    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  // 🚀 START CAMERA
  const startCamera = async () => {
    if (scannerRef.current) return;

    const scanner = new Html5Qrcode("reader");
    scannerRef.current = scanner;

    try {
      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,

          // 🔥 RESPONSIVE QR BOX
          qrbox: isMobile
            ? { width: 220, height: 220 }
            : { width: 300, height: 300 },
        },

        async (decodedText: string) => {
          console.log("QR RESULT:", decodedText);

          await stopCamera();

          try {
            const url = new URL(decodedText);

            const id = url.pathname.split("/").pop();

            router.push(`/item/${id}`);
          } catch {
            router.push(`/item/${decodedText}`);
          }
        },

        () => {},
      );

      setIsRunning(true);
    } catch (err) {
      console.log("Start error:", err);
    }
  };

  // ⛔ STOP CAMERA
  const stopCamera = async () => {
    const scanner = scannerRef.current;

    if (!scanner) return;

    try {
      await scanner.stop();
      await scanner.clear();

      // 🔥 STOP STREAM
      const video = document.querySelector("video");

      if (video && video.srcObject) {
        const stream = video.srcObject as MediaStream;

        stream.getTracks().forEach((track) => track.stop());
      }

      scannerRef.current = null;

      setIsRunning(false);
    } catch (err) {
      console.log("Stop error:", err);
    }
  };

  return (
    <main className="min-h-screen bg-linier-to-b from-gray-50 to-white px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* 🔥 HEADER */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <QrCode className="w-4 h-4" />
            Smart Museum Scanner
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">
            Scan QR Museum
          </h1>

          <p className="text-gray-500 max-w-2xl mx-auto text-sm sm:text-base md:text-lg">
            Arahkan kamera ke QR Code untuk melihat informasi benda museum
            secara interaktif.
          </p>
        </div>

        {/* 🔥 DESKTOP & MOBILE LAYOUT */}
        <div
          className={`
            grid gap-8 items-center
            ${isMobile ? "grid-cols-1" : "lg:grid-cols-2"}
          `}
        >
          {/* 🔥 LEFT CONTENT */}
          <div className="space-y-6 order-2 lg:order-1">
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-3">📌 Cara Menggunakan</h2>

              <div className="space-y-4 text-gray-600">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                    1
                  </div>

                  <p>Buka kamera scanner</p>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                    2
                  </div>

                  <p>Arahkan ke QR Code museum</p>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                    3
                  </div>

                  <p>Sistem akan membuka detail item otomatis</p>
                </div>
              </div>
            </div>

            {/* 🔥 BUTTON */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={startCamera}
                disabled={isRunning}
                className={`
                  flex-1 flex items-center justify-center gap-2
                  py-4 rounded-2xl font-semibold transition shadow-lg
                  ${
                    isRunning
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 text-white hover:scale-[1.02]"
                  }
                `}
              >
                <Camera className="w-5 h-5" />
                Buka Kamera
              </button>

              <button
                onClick={stopCamera}
                disabled={!isRunning}
                className={`
                  flex-1 flex items-center justify-center gap-2
                  py-4 rounded-2xl font-semibold transition shadow-lg
                  ${
                    !isRunning
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700 text-white hover:scale-[1.02]"
                  }
                `}
              >
                <CameraOff className="w-5 h-5" />
                Tutup Kamera
              </button>
            </div>
          </div>

          {/* 🔥 SCANNER */}
          <div className="order-1 lg:order-2">
            <div className="bg-white border border-gray-200 rounded-3xl p-4 shadow-xl">
              <div
                id="reader"
                className={`
                  overflow-hidden rounded-2xl
                  mx-auto

                  ${isMobile ? "max-w-[320px]" : "max-w-125"}
                `}
              ></div>
            </div>

            {/* STATUS */}
            <div className="mt-4 text-center">
              <span
                className={`
                  inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium

                  ${
                    isRunning
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }
                `}
              >
                <span
                  className={`
                    w-2 h-2 rounded-full
                    ${isRunning ? "bg-green-500" : "bg-gray-400"}
                  `}
                />

                {isRunning ? "Scanner Aktif" : "Scanner Tidak Aktif"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
