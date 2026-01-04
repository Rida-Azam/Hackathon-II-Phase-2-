"use client";

import Link from "next/link";

export default function NotesPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center p-12 bg-white/5 rounded-3xl border border-white/10 max-w-md">
        <h1 className="text-3xl font-bold text-foreground font-poppins mb-4">
          Notes
        </h1>
        <p className="text-muted-foreground mb-8">
          This feature is coming soon. Stay tuned for updates!
        </p>
        <Link
          href="/todos"
          className="inline-block px-6 py-3 bg-foreground text-background rounded-2xl font-bold hover:opacity-90 transition-all"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
