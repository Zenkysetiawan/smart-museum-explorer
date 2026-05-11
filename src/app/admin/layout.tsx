import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50 min-h-screen">
      <AdminSidebar />

      {/* CONTENT */}
      <div className="md:ml-64 p-4 md:p-6 max-w-6xl mx-auto">{children}</div>
    </div>
  );
}
