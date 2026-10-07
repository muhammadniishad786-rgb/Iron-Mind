import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <Sidebar />

      <main className="min-h-[calc(100vh-64px)] md:ml-64">{children}</main>
    </div>
  );
}
