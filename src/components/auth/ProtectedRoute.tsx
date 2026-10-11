
"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsAuthenticated(false);

      const returnTo = encodeURIComponent(pathname || "/dashboard");
      router.replace(`/login?returnTo=${returnTo}`);
      return;
    }

    setIsAuthenticated(true);
    setIsChecking(false);
  }, [pathname, router]);

  if (isChecking || !isAuthenticated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-zinc-50 text-zinc-900 dark:bg-black dark:text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-red-500" size={32} />
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
