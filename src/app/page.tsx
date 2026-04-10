"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { useFilms } from "@/hooks/use-films";
import Layout from "@/layouts/Layout";

const heroImage =
  "https://images.unsplash.com/photo-1520088258008-0f0a636a00a9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

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
  const filmItems = useMemo(() => films.data?.data ?? [], [films.data?.data]);
  const meta = films.data?.meta?.[0];
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const debouncedSearch = useDebounce(search);
  const statusOptions = useMemo(
    () => Array.from(new Set(filmItems.map((film) => film.airing_status))),
    [filmItems],
  );
  const filteredFilms = useMemo(() => {
    const normalizedSearch = debouncedSearch.trim().toLowerCase();

    return filmItems.filter((film) => {
      const matchesTitle = normalizedSearch
        ? film.title.toLowerCase().includes(normalizedSearch)
        : true;
      const matchesStatus =
        status === "all" ? true : film.airing_status === status;

      return matchesTitle && matchesStatus;
    });
  }, [debouncedSearch, filmItems, status]);

  return (
    <Layout withNavbar>
      <main className="min-h-screen bg-zinc-50">
        <section
          className="relative flex min-h-[75vh] items-end overflow-hidden px-6 py-16 text-white"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8">
            <div className="max-w-3xl space-y-6">
              {/* badge */}
              <div className="inline-flex items-center gap-2">
                <span className="rounded-full bg-emerald-500/90 px-3 py-2 text-xs font-medium tracking-wide text-white backdrop-blur">
                  FMS - Film Management System
                </span>
              </div>

              {/* title */}
              <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
                Kelola Film Lebih
                <span className="block text-emerald-400">Mudah dan Cepat</span>
              </h1>

              {/* description */}
              <p className="max-w-2xl text-base leading-7 text-zinc-200 sm:text-lg">
                Pantau seluruh data film dalam satu tempat — mulai dari status
                tayang, jumlah episode, tanggal rilis, hingga rating pengguna
              </p>

              {/* CTA buttons */}
              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <button className="rounded-lg bg-emerald-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-400">
                  Lihat Daftar Film
                </button>

                <button className="rounded-lg border border-white/20 bg-white/10 px-5 py-3 text-sm font-medium text-white backdrop-blur transition hover:bg-white/20">
                  Tentang Kami
                </button>
              </div>
            </div>

            {/* bottom fade for smooth transition */}
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

            <div className="grid gap-3 rounded-lg border border-zinc-200 bg-white p-4 md:grid-cols-[1fr_220px]">
              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-zinc-800"
                  htmlFor="film-search"
                >
                  Cari film
                </label>
                <Input
                  id="film-search"
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Cari berdasarkan judul..."
                  value={search}
                />
              </div>
              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-zinc-800"
                  htmlFor="film-status"
                >
                  Status
                </label>
                <select
                  className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  id="film-status"
                  onChange={(event) => setStatus(event.target.value)}
                  value={status}
                >
                  <option value="all">Semua status</option>
                  {statusOptions.map((item) => (
                    <option key={item} value={item}>
                      {formatStatus(item)}
                    </option>
                  ))}
                </select>
              </div>
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

            {!films.isLoading &&
            !films.error &&
            filmItems.length > 0 &&
            filteredFilms.length === 0 ? (
              <Card className="rounded-lg">
                <CardHeader>
                  <CardTitle>Film tidak ditemukan</CardTitle>
                  <CardDescription>
                    Coba ubah kata kunci atau pilih status lain.
                  </CardDescription>
                </CardHeader>
              </Card>
            ) : null}

            {filteredFilms.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredFilms.map((film) => (
                  <Card
                    className="rounded-lg border border-zinc-200 shadow-sm"
                    key={film.id}
                  >
                    <CardHeader>
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <CardTitle className="text-xl">
                            <Link
                              className="transition-colors hover:text-emerald-700"
                              href={`/films/${film.id}`}
                            >
                              {film.title}
                            </Link>
                          </CardTitle>
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
                      <Link
                        className="mt-4 inline-flex text-sm font-medium text-emerald-700 hover:text-emerald-800"
                        href={`/films/${film.id}`}
                      >
                        Lihat detail
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : null}
          </div>
        </section>
      </main>
    </Layout>
  );
}
