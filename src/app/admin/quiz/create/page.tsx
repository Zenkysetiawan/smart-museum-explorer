import { createClient } from "@/lib/supabase/server";
import AdminQuizForm from "@/components/admin/AdminQuizForm";

export default async function Page() {
  const supabase = await createClient();

  const { data: items } = await supabase.from("items").select("id, name");

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Tambah Quiz</h1>

      <AdminQuizForm items={items || []} />
    </div>
  );
}
