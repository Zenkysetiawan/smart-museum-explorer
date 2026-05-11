import { createClient } from "@/lib/supabase/server";
import AdminQuizEditForm from "@/components/admin/AdminQuizEditForm";

export default async function EditQuizPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();

  const { data: quiz } = await supabase
    .from("quiz")
    .select("*")
    .eq("id", id)
    .single();

  const { data: items } = await supabase.from("items").select("*");

  return (
    <div className="p-6">
      <AdminQuizEditForm quiz={quiz} items={items} />
    </div>
  );
}
