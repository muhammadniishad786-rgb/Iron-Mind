
"use client";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-zinc-50 text-zinc-900 transition-colors dark:bg-black dark:text-white">
        <Navbar />
        <Sidebar />

        <main className="min-h-[calc(100vh-64px)] md:ml-64">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
