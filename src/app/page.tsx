"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useFilms } from "@/hooks/use-films";

const heroImage =
  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1800&q=80";

function formatStatus(status: string) {
  return status.replaceAll("_", " ");
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export default function Home() {
  const films = useFilms();
  const filmItems = films.data?.data ?? [];
  const meta = films.data?.meta?.[0];

  return (
    <main className="min-h-screen bg-zinc-50">
      <section
        className="relative flex min-h-[70vh] items-end bg-zinc-950 bg-cover bg-center px-6 py-12 text-white"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black/65" />
        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8">
          <div className="max-w-3xl space-y-5">
            <Badge className="bg-emerald-500 text-white" variant="secondary">
              Film Management System
            </Badge>
            <h1 className="text-4xl leading-tight font-semibold tracking-tight text-balance sm:text-6xl">
              Temukan film yang sedang dikelola.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-zinc-100 sm:text-lg">
              Lihat daftar film, status penayangan, jumlah episode, tanggal
              rilis, dan rating rata-rata dari API FMS.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              size="lg"
              nativeButton={false}
              render={<Link href="/login" />}
            >
              Login
            </Button>
            <Button
              className="bg-white text-zinc-950 hover:bg-zinc-100"
              size="lg"
              nativeButton={false}
              render={<Link href="/register" />}
              variant="secondary"
            >
              Register
            </Button>
            <Button
              className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
              size="lg"
              nativeButton={false}
              render={<Link href="/profile" />}
              variant="outline"
            >
              Profile
            </Button>
          </div>
        </div>
      </section>

      <section className="px-6 py-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-medium text-emerald-700">
                Katalog Film
              </p>
              <h2 className="mt-1 text-3xl font-semibold tracking-tight text-zinc-950">
                Daftar Film
              </h2>
            </div>
            {meta ? (
              <p className="text-sm text-zinc-600">
                {meta.total_data} film, halaman {meta.page} dari{" "}
                {meta.total_page}
              </p>
            ) : null}
          </div>

          {films.isLoading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {[1, 2, 3, 4].map((item) => (
                <div
                  className="h-40 animate-pulse rounded-lg border border-zinc-200 bg-white"
                  key={item}
                />
              ))}
            </div>
          ) : null}

          {films.error ? (
            <Card className="rounded-lg border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-900">
                  Film gagal dimuat
                </CardTitle>
                <CardDescription className="text-red-700">
                  Periksa koneksi API dan coba muat ulang halaman.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : null}

          {!films.isLoading && !films.error && filmItems.length === 0 ? (
            <Card className="rounded-lg">
              <CardHeader>
                <CardTitle>Belum ada film</CardTitle>
                <CardDescription>
                  Data film akan tampil ketika endpoint mengirim daftar film.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : null}

          {filmItems.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {filmItems.map((film) => (
                <Card
                  className="rounded-lg border border-zinc-200 shadow-sm"
                  key={film.id}
                >
                  <CardHeader>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <CardTitle className="text-xl">{film.title}</CardTitle>
                        <CardDescription>
                          Rilis {formatDate(film.release_date)}
                        </CardDescription>
                      </div>
                      <Badge variant="outline">
                        {formatStatus(film.airing_status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3">
                        <p className="text-xs font-medium uppercase text-zinc-500">
                          Episode
                        </p>
                        <p className="mt-1 text-lg font-semibold text-zinc-950">
                          {film.total_episodes}
                        </p>
                      </div>
                      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3">
                        <p className="text-xs font-medium uppercase text-zinc-500">
                          Rating
                        </p>
                        <p className="mt-1 text-lg font-semibold text-zinc-950">
                          {film.average_rating}/10
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
