"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await login.mutateAsync({ email, password });
      toast.success("Login berhasil. Selamat datang!");
      router.push("/profile");
    } catch (caughtError) {
      toast.error(
        caughtError instanceof Error
          ? caughtError.message
          : "Login gagal. Periksa email dan password.",
      );
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-zinc-50 px-6 py-16">
      {/* BACKGROUND DECOR */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-emerald-200 blur-3xl opacity-40" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-emerald-300 blur-3xl opacity-30" />
      </div>

      <div className="relative w-full max-w-md">
        {/* HEADER TEXT */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
            Hi There!
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            Masuk ke akun kamu untuk melanjutkan
          </p>
        </div>

        <Card className="rounded-2xl border border-zinc-200 shadow-lg backdrop-blur bg-white/90">
          <CardHeader>
            <CardTitle className="text-xl">Login</CardTitle>
            <CardDescription>Gunakan email dan password kamu</CardDescription>
          </CardHeader>

          <CardContent>
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* EMAIL */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-800">
                  Email
                </label>
                <Input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="contoh@email.com"
                  className="h-11"
                  required
                />
              </div>

              {/* PASSWORD */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-800">
                  Password
                </label>
                <Input
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  className="h-11"
                  required
                />
              </div>

              {/* BUTTON */}
              <Button
                className="w-full h-11 text-sm font-medium"
                type="submit"
                disabled={login.isPending}
              >
                {login.isPending ? "Memproses..." : "Login"}
              </Button>
            </form>

            {/* FOOTER */}
            <p className="mt-6 text-center text-sm text-zinc-600">
              Belum punya akun?{" "}
              <Link
                href="/register"
                className="font-medium text-emerald-600 hover:underline"
              >
                Daftar sekarang
              </Link>
            </p>
          </CardContent>
        </Card>

        {/* BRAND */}
        <p className="mt-6 text-center text-xs text-zinc-400">FMS</p>
      </div>
    </main>
  );
}
