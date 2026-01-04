"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthCard } from "@/components/AuthCard";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("auth_token");
    if (token) {
      router.replace("/todos");
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[Debug] Submitting Login...");
    setError("");

    try {
      // Generate a real JWT token with user information
      const { generateJWT } = await import("@/lib/jwt");
      const token = await generateJWT({
        sub: email, // Use email as user ID for now
        email: email,
        name: email.split('@')[0], // Extract name from email
        avatar: null
      });

      console.log("[Debug] Generated JWT token");

      // Set cookie first for middleware
      document.cookie = `auth_token=${token}; path=/; max-age=86400; SameSite=Lax`;
      localStorage.setItem("auth_token", token);

      console.log("[Debug] Success, token set in both cookie and localStorage");
      console.log("[Debug] Navigating to /todos");

      // Force a full page reload to ensure middleware picks up the cookie
      window.location.href = "/todos";
    } catch (err) {
      console.error("[Debug] Login error:", err);
      setError("Failed to login");
    }
  };

  if (!mounted) {
    return null; // Avoid hydration mismatch
  }

  return (
    <AuthCard
      title="Sign in to Todo"
      subtitle="Access your workstation"
    >
      <form className="mt-8 space-y-6" onSubmit={handleLogin}>
        {error && (
          <div className="text-red-500 text-xs font-bold text-center bg-red-500/5 border border-red-500/10 p-4 rounded-2xl animate-shake uppercase tracking-widest">
            {error}
          </div>
        )}
        <div className="space-y-5">
          <div className="group">
            <label htmlFor="email" className="block text-[10px] font-bold text-muted-foreground mb-2 ml-1 uppercase tracking-widest transition-colors group-focus-within:text-foreground">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="relative block w-full rounded-2xl border-0 py-4 text-foreground bg-white dark:bg-zinc-900/50 ring-1 ring-inset ring-slate-200 dark:ring-white/10 placeholder:text-muted-foreground/30 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-foreground/20 sm:text-sm sm:leading-6 px-5 transition-all outline-none"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="group">
            <label htmlFor="password" className="block text-[10px] font-bold text-muted-foreground mb-2 ml-1 uppercase tracking-widest transition-colors group-focus-within:text-foreground">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="relative block w-full rounded-2xl border-0 py-4 text-foreground bg-white dark:bg-zinc-900/50 ring-1 ring-inset ring-slate-200 dark:ring-white/10 placeholder:text-muted-foreground/30 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-foreground/20 sm:text-sm sm:leading-6 px-5 transition-all outline-none"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="group relative flex w-full justify-center rounded-2xl bg-foreground text-background px-3 py-4 text-sm font-bold hover:opacity-90 active:scale-[0.98] transition-all font-poppins shadow-xl shadow-foreground/10 uppercase tracking-widest"
          >
            Sign in
          </button>
        </div>
      </form>
      <div className="text-center text-[10px] text-muted-foreground font-bold uppercase tracking-widest pt-4">
        Need an account?{" "}
        <Link href="/signup" className="text-foreground hover:underline transition-colors">
          Create Account
        </Link>
      </div>
    </AuthCard>
  );
}
