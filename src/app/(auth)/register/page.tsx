"use client";

import { FormEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Dumbbell } from "lucide-react";

import type { RootState, AppDispatch } from "@/store/store";
import { register } from "@/store/slices/authSlice";

export default function RegisterPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Clear confirm password error while typing
    if (e.target.name === "confirmPassword") {
      setPasswordError("");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Check passwords
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setPasswordError("");

    // Don't send confirmPassword to backend
    const { confirmPassword, ...userData } = formData;

    const result = await dispatch(register(userData));

    if (register.fulfilled.match(result)) {
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-red-600">
              <Dumbbell size={28} />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-white">
            Join Iron<span className="text-red-500">Mind</span>
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            Create your account and start your fitness journey
          </p>
        </div>

        {/* Register Card */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name */}
            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-red-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-red-500"
              />
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 pr-12 text-white outline-none transition placeholder:text-zinc-600 focus:border-red-500"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Confirm Password
              </label>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                  className={`w-full rounded-lg border bg-zinc-900 px-4 py-3 pr-12 text-white outline-none transition placeholder:text-zinc-600 ${
                    passwordError
                      ? "border-red-500"
                      : "border-zinc-800 focus:border-red-500"
                  }`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>

              {passwordError && (
                <p className="mt-2 text-sm text-red-400">
                  {passwordError}
                </p>
              )}
            </div>

            {/* API Error */}
            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-red-600 py-3 font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          {/* Login */}
          <p className="mt-6 text-center text-sm text-zinc-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-red-500 hover:text-red-400"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}