"use client";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function ConfirmModal({ open, onClose, onConfirm }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow w-75 text-center">
        <h2 className="font-semibold mb-4">Yakin mau hapus?</h2>

        <div className="flex justify-center gap-3">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Batal
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
