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
import { useAuth } from "@/hooks/use-auth";

function formatValue(value: unknown) {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, isLoadingUser, logout, user, userError } = useAuth();

  function handleLogout() {
    logout();
    router.push("/login");
  }

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 py-16">
        <Card className="w-full max-w-md rounded-lg border border-zinc-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Profil</CardTitle>
            <CardDescription>
              Login dibutuhkan untuk membaca detail user.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full" nativeButton={false} render={<Link href="/login" />}>
              Login
            </Button>
            <Button
              className="w-full"
              variant="outline"
              nativeButton={false}
              render={<Link href="/register" />}
            >
              Register
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 py-16">
      <Card className="w-full max-w-2xl rounded-lg border border-zinc-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Profil</CardTitle>
          <CardDescription>
            Data ini dibaca dari endpoint <code>/api/v1/auth/me</code>.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {isLoadingUser ? (
            <p className="text-sm text-zinc-600">Memuat detail user...</p>
          ) : null}
          {userError ? (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              Token tidak valid atau sesi sudah berakhir. Silakan login ulang.
            </p>
          ) : null}
          {user ? (
            <dl className="grid gap-3 sm:grid-cols-2">
              {Object.entries(user).map(([key, value]) => (
                <div
                  className="rounded-lg border border-zinc-200 bg-white p-3"
                  key={key}
                >
                  <dt className="text-xs font-medium uppercase text-zinc-500">
                    {key}
                  </dt>
                  <dd className="mt-1 break-words text-sm text-zinc-900">
                    {formatValue(value)}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
            <Button nativeButton={false} render={<Link href="/" />}>
              Kembali ke Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
