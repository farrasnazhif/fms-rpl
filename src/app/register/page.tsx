"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
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

  async function handleSubmit(event: { preventDefault: () => void }) {
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
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 py-16">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Daftar</CardTitle>
          <CardDescription>Buat akun FMS</CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* username */}
            <Input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            {/* email */}
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* password */}
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {/* confirm password */}
            <Input
              type="password"
              placeholder="Konfirmasi Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <Button
              className="w-full"
              type="submit"
              disabled={register.isPending}
            >
              {register.isPending ? "Loading..." : "Register"}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-emerald-600">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
