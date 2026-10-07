"use client";

import Link from "next/link";
import { Dumbbell, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 py-8 text-white">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2"
          >
            <Dumbbell
              size={28}
              className="text-red-500"
            />

            <span className="text-2xl font-bold">
              Iron<span className="text-red-500">Mind</span>
            </span>
          </Link>

          <p className="mt-3 text-sm text-zinc-500">
            Welcome back. Continue your fitness journey.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">
              Welcome <span className="text-red-500">Back</span>
            </h1>

            <p className="mt-2 text-sm text-zinc-500">
              Login to your IronMind account.
            </p>
          </div>

          <form className="space-y-5">
            {/* Email */}
            <div>
              <label className="text-sm font-medium text-zinc-300">
                Email Address
              </label>

              <div className="relative mt-2">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600"
                />

                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-zinc-600 transition focus:border-red-500"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-zinc-300">
                  Password
                </label>

                <button
                  type="button"
                  className="text-xs text-red-500 transition hover:text-red-400"
                >
                  Forgot password?
                </button>
              </div>

              <div className="relative mt-2">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 py-3 pl-10 pr-11 text-sm text-white outline-none placeholder:text-zinc-600 transition focus:border-red-500"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 transition hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Login */}
            <button
              type="submit"
              className="w-full rounded-lg bg-red-600 py-3 text-sm font-semibold transition hover:bg-red-500"
            >
              Login
            </button>
          </form>

          {/* Register */}
          <p className="mt-6 text-center text-sm text-zinc-500">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-red-500 transition hover:text-red-400"
            >
              Create one
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-zinc-600">
          Train harder. Track smarter. Become stronger.
        </p>
      </div>
    </main>
  );
}