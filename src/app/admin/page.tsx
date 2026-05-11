import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminCreateForm from "@/components/admin/AdminCreateForm";
import ItemList from "@/components/admin/ItemList";

type Item = {
  id: number;
  name: string;
  description: string;
  image_url: string;
};

export default async function AdminPage() {
  const supabase = await createClient();

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

  // 📦 Items
  const { data: items } = await supabase
    .from("items")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <>
      <h1 className="text-2xl md:text-3xl font-bold mb-6">
        Dashboard Admin 👑
      </h1>

      <div className="bg-white p-4 md:p-6 rounded-2xl shadow mb-8">
        <h2 className="text-lg font-semibold mb-4">Tambah Item</h2>
        <AdminCreateForm />
      </div>

      <ItemList items={items || []} />
    </>
  );
}
