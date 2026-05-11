"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteItem } from "@/lib/actions/items";
import ConfirmModal from "@/components/admin/ConfirmModal";
import Toast from "@/components/admin/Toast";
import Link from "next/link";
import QRCodeItem from "@/components/qr/QRCodeItem";

type Item = {
  id: number;
  name: string;
  description: string;
  image_url: string;

  category?: string;
  origin?: string;
  year?: number;
};

export default function ItemList({ items }: { items: Item[] }) {
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const router = useRouter();

  async function handleDelete(id: number) {
    try {
      await deleteItem(id);
      setToast("Berhasil dihapus ✅");
      router.refresh();
    } catch {
      setToast("Gagal menghapus ❌");
    } finally {
      setConfirmId(null);
      setTimeout(() => setToast(null), 2000);
    }
  }

  return (
    <>
      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Item Museum</h1>

          <p className="text-sm text-gray-500">Kelola koleksi museum digital</p>
        </div>
      </div>

      {/* EMPTY */}
      {items.length === 0 ? (
        <div className="bg-white border rounded-2xl py-16 text-center">
          <div className="text-5xl mb-3">📦</div>

          <p className="text-gray-500">Belum ada item museum</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="
              bg-white border border-gray-200
              rounded-2xl p-4
              hover:shadow-md transition
            "
            >
              <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
                {/* LEFT */}
                <div className="flex gap-4">
                  {/* IMAGE */}
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        🖼️
                      </div>
                    )}
                  </div>

                  {/* CONTENT */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h2 className="font-semibold text-lg text-gray-900">
                        {item.name}
                      </h2>

                      {item.category && (
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                          {item.category}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                      {item.description || "Tidak ada deskripsi"}
                    </p>

                    <div className="flex gap-3 flex-wrap text-xs text-gray-400">
                      {item.origin && <span>📍 {item.origin}</span>}

                      {item.year && <span>📅 {item.year}</span>}
                    </div>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  {/* QR */}
                  <div className="bg-gray-50 border rounded-xl p-2">
                    <QRCodeItem id={item.id} />
                  </div>

                  {/* ACTION */}
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/items/${item.id}/edit`}
                      className="
                      px-3 py-2 text-sm rounded-xl
                      bg-blue-600 text-white
                      hover:bg-blue-700 transition
                    "
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => setConfirmId(item.id)}
                      className="
                      px-3 py-2 text-sm rounded-xl
                      bg-red-500 text-white
                      hover:bg-red-600 transition
                    "
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      <ConfirmModal
        open={!!confirmId}
        onClose={() => setConfirmId(null)}
        onConfirm={() => confirmId && handleDelete(confirmId)}
      />

      {/* TOAST */}
      {toast && <Toast message={toast} />}
    </>
  );
}
