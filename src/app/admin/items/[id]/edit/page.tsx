import { createClient } from "@/lib/supabase/server";
import { updateItem } from "@/lib/actions/items";
import { redirect } from "next/navigation";

type Props = {
  params: {
    id: string;
  };
};

type Item = {
  id: number;
  name: string;
  description: string;
  category: string;
  origin: string;
  year: number;
  image_url: string;
};

export default async function EditItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const { id } = await params;
  const itemId = Number(id);

  if (isNaN(itemId)) {
    return <div className="p-6">ID tidak valid</div>;
  }

  // 🔐 Auth
  const { data: userData } = await supabase.auth.getUser();

  if (!userData?.user) {
    redirect("/login");
  }

  // 🔐 Role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userData.user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/");
  }

  // 📦 Ambil item
  const { data: item, error } = await supabase
    .from("items")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !item) {
    return <div className="p-6">Item tidak ditemukan</div>;
  }

  const typedItem = item as Item;

  return (
    <div className="p-6 flex justify-center">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-bold mb-6">✏️ Edit Item</h1>

        <form action={updateItem.bind(null, itemId)} className="space-y-6">
          {/* 🔥 GRID FORM */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Nama Item
              </label>
              <input
                id="name"
                name="name"
                defaultValue={typedItem.name}
                placeholder="Contoh: Patung Buddha"
                className="border p-2 w-full rounded-lg focus:ring-2 focus:ring-black outline-none"
                required
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium mb-1"
              >
                Kategori
              </label>
              <input
                id="category"
                name="category"
                defaultValue={typedItem.category}
                placeholder="Sejarah, Seni, dll"
                className="border p-2 w-full rounded-lg focus:ring-2 focus:ring-black outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="origin"
                className="block text-sm font-medium mb-1"
              >
                Asal
              </label>
              <input
                id="origin"
                name="origin"
                defaultValue={typedItem.origin}
                placeholder="Indonesia"
                className="border p-2 w-full rounded-lg focus:ring-2 focus:ring-black outline-none"
              />
            </div>

            <div>
              <label htmlFor="year" className="block text-sm font-medium mb-1">
                Tahun
              </label>
              <input
                id="year"
                name="year"
                type="number"
                defaultValue={typedItem.year}
                placeholder="1800"
                className="border p-2 w-full rounded-lg focus:ring-2 focus:ring-black outline-none"
              />
            </div>
          </div>

          {/* 🔥 DESCRIPTION */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-1"
            >
              Deskripsi
            </label>
            <textarea
              id="description"
              name="description"
              defaultValue={typedItem.description}
              placeholder="Deskripsi item..."
              className="border p-2 w-full rounded-lg focus:ring-2 focus:ring-black outline-none mih-h-30"
            />
          </div>

          {/* 🔥 IMAGE SECTION */}
          <div className="grid md:grid-cols-2 gap-6 items-start">
            {/* Upload */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium mb-2">
                Upload Gambar Baru
              </label>
              <input
                id="image"
                type="file"
                name="image"
                className="border p-2 w-full rounded-lg"
              />

              <p className="text-xs text-gray-500 mt-1">
                Kosongkan jika tidak ingin mengganti gambar
              </p>
            </div>

            {/* Preview */}
            <div>
              <p className="text-sm font-medium mb-2">Preview Gambar</p>

              {typedItem.image_url ? (
                <img
                  src={typedItem.image_url}
                  alt={typedItem.name || "Preview gambar item"}
                  className="w-full max-h-48 object-cover rounded-lg border"
                />
              ) : (
                <div className="w-full h-40 flex items-center justify-center border rounded-lg text-gray-400">
                  Tidak ada gambar
                </div>
              )}
            </div>
          </div>

          {/* 🔥 SIMPAN GAMBAR LAMA */}
          <input
            type="hidden"
            name="existing_image_url"
            value={typedItem.image_url || ""}
          />

          {/* 🔥 BUTTON */}
          <div className="flex justify-end gap-3">
            <a
              href="/admin"
              className="px-4 py-2 border rounded-lg hover:bg-gray-100"
            >
              Batal
            </a>

            <button className="px-5 py-2 bg-black text-white rounded-lg hover:opacity-90 transition">
              Update Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
