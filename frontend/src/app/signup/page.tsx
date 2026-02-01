"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthCard } from "@/components/AuthCard";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[Debug] Submitting Signup...");
    setError("");

    try {
      console.log("[Debug] Attempting to connect to:", `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`);

      // Call the backend API for registration
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          name
        }),
      });

      console.log("[Debug] Registration response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.log("[Debug] Registration error response:", errorText);
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { detail: errorText || "Registration failed" };
        }
        throw new Error(errorData.detail || "Registration failed");
      }

      const data = await response.json();
      console.log("[Debug] Registration successful:", data);

      // Now log in the newly registered user
      const loginResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        }),
      });

      console.log("[Debug] Login response status:", loginResponse.status);

      if (!loginResponse.ok) {
        const errorText = await loginResponse.text();
        console.log("[Debug] Login error response:", errorText);
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { detail: errorText || "Login after registration failed" };
        }
        throw new Error(errorData.detail || "Login after registration failed");
      }

      const loginData = await loginResponse.json();
      const token = loginData.access_token;

      console.log("[Debug] Received token from backend after registration:", token);

      // Set cookie first for middleware
      document.cookie = `auth_token=${token}; path=/; max-age=86400; SameSite=Lax`;
      localStorage.setItem("auth_token", token);

      console.log("[Debug] Success, token set in both cookie and localStorage");
      console.log("[Debug] Navigating to /todos");

      // Force a full page reload to ensure middleware picks up the cookie
      window.location.href = "/todos";
    } catch (err) {
      console.error("[Debug] Signup error details:", err);
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError("Network error: Unable to connect to the server. Please check if the backend is running.");
      } else {
        setError(err instanceof Error ? err.message : "Failed to create account");
      }
    }
  };

  if (!mounted) {
    return null; // Avoid hydration mismatch
  }

  return (
    <AuthCard
      title="Create Account"
      subtitle="Join the evolution"
    >
      <form className="mt-8 space-y-6" onSubmit={handleSignup}>
        {error && (
          <div className="text-red-500 text-xs font-bold text-center bg-red-500/5 border border-red-500/10 p-4 rounded-2xl animate-shake uppercase tracking-widest">
            {error}
          </div>
        )}
        <div className="space-y-5">
           <div className="group">
            <label htmlFor="full-name" className="block text-[10px] font-bold text-muted-foreground mb-2 ml-1 uppercase tracking-widest transition-colors group-focus-within:text-foreground">
              Full Name
            </label>
            <input
              id="full-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              className="relative block w-full rounded-2xl border-0 py-4 text-foreground bg-white dark:bg-zinc-900/50 ring-1 ring-inset ring-slate-200 dark:ring-white/10 placeholder:text-muted-foreground/30 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-foreground/20 sm:text-sm sm:leading-6 px-5 transition-all outline-none"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
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
              autoComplete="new-password"
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
            Sign up
          </button>
        </div>
      </form>
      <div className="text-center text-[10px] text-muted-foreground font-bold uppercase tracking-widest pt-4">
        Already have an account?{" "}
        <Link href="/login" className="text-foreground hover:underline transition-colors">
          Sign In
        </Link>
      </div>
    </AuthCard>
  );
}
