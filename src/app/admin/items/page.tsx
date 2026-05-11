import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { deleteItem } from "@/lib/actions/items";

export default async function AdminItemsPage() {
  const supabase = await createClient();

  const { data: items } = await supabase
    .from("items")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1>Items</h1>

      <Link href="/admin/items/create">+ Tambah Item</Link>

      {items?.map((item) => (
        <div key={item.id}>
          <h2>{item.title}</h2>

          <Link href={`/admin/items/${item.id}/edit`}>Edit</Link>

          <form
            action={async () => {
              "use server";
              await deleteItem(item.id);
            }}
          >
            <button type="submit">Delete</button>
          </form>
        </div>
      ))}
    </div>
  );
}
