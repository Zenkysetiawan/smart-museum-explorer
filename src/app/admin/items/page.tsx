import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { deleteItem } from "@/lib/actions/items";

export default async function AdminItemsPage() {
  const supabase = await createClient();

  // 🔥 GET ITEMS
  const { data: items, error } = await supabase
    .from("items")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-500 font-medium">Gagal mengambil data item</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* 🔥 HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              Dashboard Items 🏛️
            </h1>

            <p className="text-gray-500 mt-1">
              Kelola semua item museum di sini
            </p>
          </div>

          <Link
            href="/admin/items/create"
            className="
              bg-blue-600 hover:bg-blue-700
              text-white px-5 py-3 rounded-2xl
              font-semibold shadow-lg transition
              text-center
            "
          >
            + Tambah Item
          </Link>
        </div>

        {/* 🔥 EMPTY */}
        {items?.length === 0 && (
          <div className="bg-white rounded-3xl p-10 text-center shadow">
            <p className="text-gray-500 text-lg">Belum ada item museum 😢</p>
          </div>
        )}

        {/* 🔥 LIST */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items?.map((item) => (
            <div
              key={item.id}
              className="
                bg-white rounded-3xl overflow-hidden
                shadow-md hover:shadow-xl
                transition duration-300
                border border-gray-100
              "
            >
              {/* IMAGE */}
              <div className="relative">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-full h-52 object-cover"
                />

                <div className="absolute top-3 left-3">
                  <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
                    {item.category || "Museum"}
                  </span>
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-5">
                <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                  {item.name}
                </h2>

                <p className="text-gray-500 text-sm line-clamp-3 mb-5">
                  {item.description}
                </p>

                {/* ACTION */}
                <div className="flex gap-3">
                  {/* EDIT */}
                  <Link
                    href={`/admin/items/${item.id}/edit`}
                    className="
                      flex-1 text-center
                      bg-yellow-500 hover:bg-yellow-600
                      text-white py-2 rounded-xl
                      font-semibold transition
                    "
                  >
                    Edit
                  </Link>

                  {/* DELETE */}
                  <form
                    action={deleteItem.bind(null, item.id)}
                    className="flex-1"
                  >
                    <button
                      type="submit"
                      className="
                        w-full
                        bg-red-500 hover:bg-red-600
                        text-white py-2 rounded-xl
                        font-semibold transition
                      "
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
