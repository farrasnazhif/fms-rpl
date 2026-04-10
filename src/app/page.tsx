import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 py-24">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
        <div className="space-y-6">
          <h1 className="max-w-5xl text-4xl leading-tight font-semibold tracking-tight text-balance sm:text-6xl">
            Film Management System
          </h1>
          <p className="max-w-2xl text-base text-slate-700 sm:text-lg">
            Masuk sebagai User atau Admin untuk mengelola data melalui API FMS.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              size="lg"
              nativeButton={false}
              render={<Link href="/login" />}
            >
              Login
            </Button>
            <Button
              variant="outline"
              size="lg"
              nativeButton={false}
              render={<Link href="/register" />}
            >
              Register
            </Button>
            <Button
              variant="outline"
              size="lg"
              nativeButton={false}
              render={<Link href="/profile" />}
            >
              Profile
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
