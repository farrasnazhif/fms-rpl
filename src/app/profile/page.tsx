"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";

function getInitials(value?: string) {
  const source = value?.trim() ? value : "FMS";

  return source
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, isLoadingUser, logout, user, userError } = useAuth();
  const username = user?.username ?? "Memuat profil";
  const displayName = user?.display_name?.trim() || username;
  const bio = user?.bio?.trim() || "Belum ada bio untuk akun ini.";

  function handleLogout() {
    logout();
    router.push("/login");
  }

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 py-16">
        <Card className="w-full max-w-md rounded-xl border border-zinc-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Profil</CardTitle>
            <CardDescription>
              Login diperlukan untuk melihat profil.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              className="w-full"
              nativeButton={false}
              render={<Link href="/login" />}
            >
              Login
            </Button>
            <Button
              className="w-full"
              nativeButton={false}
              render={<Link href="/register" />}
              variant="outline"
            >
              Register
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-emerald-700">Akun Saya</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-zinc-950">
              Profil
            </h1>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button nativeButton={false} render={<Link href="/" />}>
              Home
            </Button>
            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
          </div>
        </header>

        <section className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
          <div className="bg-emerald-700 px-6 py-10 text-white">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex size-20 shrink-0 items-center justify-center rounded-lg border border-white/30 bg-white text-2xl font-semibold text-emerald-800">
                  {getInitials(displayName)}
                </div>
                <div>
                  <p className="text-sm font-medium text-emerald-50">
                    Username
                  </p>
                  <h2 className="mt-1 text-3xl font-semibold">{username}</h2>
                  {user?.email ? (
                    <p className="mt-2 text-sm text-emerald-50">
                      {user.email}
                    </p>
                  ) : null}
                </div>
              </div>
              {user?.role ? (
                <span className="w-fit rounded-lg bg-white px-3 py-1 text-sm font-medium text-emerald-800">
                  {user.role}
                </span>
              ) : null}
            </div>
          </div>

          <div className="grid lg:grid-cols-[1fr_280px]">
            <div className="space-y-6 p-6">
              {isLoadingUser ? (
                <p className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-600">
                  Memuat profil...
                </p>
              ) : null}
              {userError ? (
                <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  Token tidak valid atau sesi berakhir. Silakan login ulang.
                </p>
              ) : null}

              <div>
                <h3 className="text-lg font-semibold text-zinc-950">
                  {displayName}
                </h3>
                <p className="mt-1 text-sm text-zinc-600">
                  Informasi profil dari akun yang sedang login.
                </p>
              </div>

              <article className="rounded-lg border border-zinc-200 bg-zinc-50 p-5">
                <p className="text-xs font-medium uppercase text-zinc-500">
                  Bio
                </p>
                <p className="mt-3 whitespace-pre-line text-base leading-7 text-zinc-800">
                  {bio}
                </p>
              </article>
            </div>

            <aside className="border-t border-zinc-200 bg-zinc-50 p-6 lg:border-t-0 lg:border-l">
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-950">
                    Status Sesi
                  </h3>
                  <p className="mt-2 text-sm text-zinc-600">
                    Profil ini diambil dari endpoint{" "}
                    <code>/api/v1/auth/me</code>.
                  </p>
                </div>

                <Separator />

                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-sm font-medium text-emerald-900">
                    {user ? "Terhubung" : "Menunggu data"}
                  </p>
                  <p className="mt-1 text-xs text-emerald-700">
                    {user
                      ? "Token JWT aktif dan request profil berhasil diproses."
                      : "Request profil sedang berjalan."}
                  </p>
                </div>

                <Button
                  className="w-full"
                  onClick={handleLogout}
                  variant="outline"
                >
                  Logout
                </Button>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
