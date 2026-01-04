"use client";

import { useState, useEffect } from "react";
import { getUserFromSession } from "@/lib/auth";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { UserProfile } from "@/types/auth";

export default function SettingsPage() {
  const [user, setUser] = useState<UserProfile>({
    name: 'User',
    email: 'user@example.com',
    avatar: null
  });

  useEffect(() => {
    const userData = getUserFromSession();
    if (userData) {
      setUser(userData);
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 p-8">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-foreground font-poppins mb-8">
              Settings
            </h1>

            <div className="bg-white/5 rounded-3xl p-8 border border-white/10">
              <h2 className="text-xl font-bold text-foreground font-poppins mb-6">
                Profile Information
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-muted-foreground uppercase tracking-widest mb-2">
                    Name
                  </label>
                  <p className="text-lg font-semibold text-foreground">
                    {user.name}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-muted-foreground uppercase tracking-widest mb-2">
                    Email
                  </label>
                  <p className="text-lg font-semibold text-foreground">
                    {user.email}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-muted-foreground uppercase tracking-widest mb-2">
                    Status
                  </label>
                  <p className="text-lg font-semibold text-foreground">
                    Active Now
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-muted-foreground uppercase tracking-widest mb-2">
                    Membership
                  </label>
                  <p className="text-lg font-semibold text-foreground">
                    Pro Member
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
