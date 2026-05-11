"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// ✅ CREATE
export async function createItem(formData: FormData) {
  const supabase = await createClient();

  const file = formData.get("image") as File;

  let image_url = "";

  // 🔥 upload ke storage
  if (file && file.size > 0) {
    const fileName = `${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("items")
      .upload(fileName, file);

    if (uploadError) throw new Error(uploadError.message);

    const { data } = supabase.storage.from("items").getPublicUrl(fileName);

    image_url = data.publicUrl;
  }

  const data = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    category: formData.get("category") as string,
    origin: formData.get("origin") as string,
    year: Number(formData.get("year")),
    image_url,
  };

  const { error } = await supabase.from("items").insert([data]);

  if (error) throw new Error(error.message);

  revalidatePath("/admin");
}

// ✅ DELETE
export async function deleteItem(id: number) {
  const supabase = await createClient();

  const { error } = await supabase.from("items").delete().eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin");
}

// ✅ UPDATE
export async function updateItem(id: number, formData: FormData) {
  const supabase = await createClient();

  const file = formData.get("image") as File;

  let image_url = formData.get("existing_image_url") as string;

  // 🔥 kalau upload gambar baru
  if (file && file.size > 0) {
    const fileName = `${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("items")
      .upload(fileName, file);

    if (uploadError) throw new Error(uploadError.message);

    const { data } = supabase.storage.from("items").getPublicUrl(fileName);

    image_url = data.publicUrl;
  }

  const data = {
    name: formData.get("name"),
    description: formData.get("description"),
    category: formData.get("category"),
    origin: formData.get("origin"),
    year: Number(formData.get("year")),
    image_url,
  };

  const { error } = await supabase.from("items").update(data).eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  redirect("/admin");
}
