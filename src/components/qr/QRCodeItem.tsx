"use client";

import { QRCodeCanvas } from "qrcode.react";
import { toPng } from "html-to-image";
import { useRef } from "react";

export default function QRCodeItem({ id }: { id: number }) {
  const qrRef = useRef<HTMLDivElement>(null);

  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/item/${id}`;

  const downloadQR = async () => {
    if (!qrRef.current) return;

    const dataUrl = await toPng(qrRef.current);

    const link = document.createElement("a");
    link.download = `qr-item-${id}.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow w-fit">
      <div ref={qrRef} className="p-2 bg-white">
        <QRCodeCanvas value={url} size={200} />
      </div>

      <button
        onClick={downloadQR}
        className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
      >
        ⬇️ Download QR
      </button>
    </div>
  );
}
