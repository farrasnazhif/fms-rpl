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

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Password dan konfirmasi password tidak sama.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password minimal 6 karakter.");
      return;
    }

    try {
      await register.mutateAsync({
        username,
        email,
        password,
        display_name: username,
        bio: "",
      });

      toast.success("Akun berhasil dibuat. Silakan login.");
      router.push("/login");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registrasi gagal.");
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-zinc-50 px-6 py-16">
      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-emerald-200 blur-3xl opacity-40" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-emerald-300 blur-3xl opacity-30" />
      </div>

      <div className="relative w-full max-w-md">
        {/* HEADER */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
            Buat Akun Baru
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            Daftar untuk mulai mengelola film favoritmu
          </p>
        </div>

        <Card className="rounded-2xl border border-zinc-200 shadow-lg bg-white/90 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-xl">Register</CardTitle>
            <CardDescription>
              Isi data berikut untuk membuat akun
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* USERNAME */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-800">
                  Username
                </label>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="username kamu"
                  className="h-11"
                  required
                />
              </div>

              {/* EMAIL */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-800">
                  Email
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="minimal 6 karakter"
                  className="h-11"
                  required
                />
              </div>

              {/* CONFIRM PASSWORD */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-800">
                  Konfirmasi Password
                </label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="ulang password"
                  className="h-11"
                  required
                />
              </div>

              {/* BUTTON */}
              <Button
                className="w-full h-11 text-sm font-medium"
                type="submit"
                disabled={register.isPending}
              >
                {register.isPending ? "Memproses..." : "Register"}
              </Button>
            </form>

            {/* FOOTER */}
            <p className="mt-6 text-center text-sm text-zinc-600">
              Sudah punya akun?{" "}
              <Link
                href="/login"
                className="font-medium text-emerald-600 hover:underline"
              >
                Login
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
