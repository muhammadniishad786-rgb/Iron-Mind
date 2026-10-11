
"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRouteContent({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [pathname, router]);

  return <>{children}</>;
}

export default function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <ProtectedRouteContent>{children}</ProtectedRouteContent>
    </Suspense>
  );
}
