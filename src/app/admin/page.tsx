import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

import AdminCreateForm from "@/components/admin/AdminCreateForm";
import ItemList from "@/components/admin/ItemList";

export default async function AdminPage() {
  const supabase = await createClient();

  // 🔐 CHECK LOGIN
  const { data: userData } = await supabase.auth.getUser();

  if (!userData?.user) {
    redirect("/login");
  }

  // 🔐 CHECK ROLE
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userData.user.id)
    .single();

  // 🚫 BUKAN ADMIN
  if (profile?.role !== "admin") {
    redirect("/");
  }

  // 📦 GET ITEMS
  const { data: items } = await supabase
    .from("items")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <>
      <h1 className="text-2xl md:text-3xl font-bold mb-6">
        Dashboard Admin 👑
      </h1>

      {/* FORM */}
      <div className="bg-white p-4 md:p-6 rounded-2xl shadow mb-8">
        <h2 className="text-lg font-semibold mb-4">Tambah Item</h2>

        <AdminCreateForm />
      </div>

      {/* ITEM LIST */}
      <ItemList items={items || []} />
    </>
  );
}
