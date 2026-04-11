"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { useFilms } from "@/hooks/use-films";
import Layout from "@/layouts/Layout";
import { resolveImageUrl } from "@/lib/utils";
import Image from "next/image";

const heroImage =
  "https://images.unsplash.com/photo-1520088258008-0f0a636a00a9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const TAKE = 12;

function formatStatus(status: string) {
  return status.replaceAll("_", " ");
}

export default function Home() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const debouncedSearch = useDebounce(search);

  const films = useFilms({
    take: TAKE,
    page,
    filter: debouncedSearch || undefined,
    filter_by: debouncedSearch ? "title" : undefined,
  });

  const filmItems = useMemo(() => films.data?.data ?? [], [films.data?.data]);
  const meta = films.data?.meta?.[0];

  const statusOptions = useMemo(
    () => Array.from(new Set(filmItems.map((film) => film.airing_status))),
    [filmItems],
  );

  const filteredFilms = useMemo(() => {
    if (status === "all") return filmItems;
    return filmItems.filter((film) => film.airing_status === status);
  }, [filmItems, status]);

  return (
    <Layout withNavbar>
      <main className="min-h-screen bg-zinc-50">
        <section
          className="relative flex min-h-[75vh] items-end overflow-hidden px-6 py-16 text-white"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8">
            <div className="max-w-3xl space-y-6">
              <div className="inline-flex items-center gap-2">
                <span className="rounded-full bg-red-500/90 px-3 py-2 text-xs font-medium tracking-wide text-white backdrop-blur">
                  FMS - Film Management System
                </span>
              </div>

              <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
                Kelola Film Lebih
                <span className="block text-red-400">Mudah dan Cepat</span>
              </h1>

              <p className="max-w-2xl text-base leading-7 text-zinc-200 sm:text-lg">
                Pantau seluruh data film dalam satu tempat — mulai dari status
                tayang, jumlah episode, tanggal rilis, hingga rating pengguna
              </p>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <a
                  className="rounded-lg bg-red-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-red-400"
                  href="#katalog"
                >
                  Lihat Daftar Film
                </a>
                <Link
                  className="rounded-lg border border-white/20 bg-white/10 px-5 py-3 text-sm font-medium text-white backdrop-blur transition hover:bg-white/20"
                  href="/genres"
                >
                  Lihat Genre
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-10" id="katalog">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="text-sm font-medium text-red-700">Katalog Film</p>
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
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
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
                  onChange={(event) => {
                    setStatus(event.target.value);
                    setPage(1);
                  }}
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
              <div className="grid gap-6 md:grid-cols-4 lg:grid-cols-5">
                {filteredFilms.map((film) => {
                  const imageUrl = resolveImageUrl(film.images?.[0]);

                  return (
                    <Link
                      key={film.id}
                      href={`/films/${film.id}`}
                      className="group block"
                    >
                      <div className="relative overflow-hidden rounded-xl bg-zinc-900 shadow-md transition duration-300 hover:scale-105 hover:shadow-2xl">
                        {/* IMAGE */}
                        {imageUrl ? (
                          <div className="relative w-full aspect-[2/3]">
                            <Image
                              src={imageUrl}
                              alt={film.title}
                              fill
                              className="object-cover transition duration-500 group-hover:scale-110"
                            />

                            {/* overlay gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition" />
                          </div>
                        ) : (
                          <div className="flex aspect-[2/3] items-center justify-center bg-zinc-800">
                            <span className="text-white/30 text-4xl">
                              {film.title[0]}
                            </span>
                          </div>
                        )}

                        {/* INFO */}
                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-100 translate-y-0 md:translate-y-6 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition duration-300">
                          <p className="text-sm font-semibold text-white line-clamp-2">
                            {film.title}
                          </p>

                          <div className="mt-1 flex items-center justify-between text-xs text-zinc-300">
                            <span>⭐ {film.average_rating}</span>
                            <span>{film.total_episodes} eps</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : null}

            {meta && meta.total_page > 1 ? (
              <div className="flex items-center justify-center gap-3">
                <Button
                  disabled={page <= 1 || films.isFetching}
                  onClick={() => setPage((p) => p - 1)}
                  size="sm"
                  variant="outline"
                >
                  Sebelumnya
                </Button>
                <span className="text-sm text-zinc-600">
                  {page} / {meta.total_page}
                </span>
                <Button
                  disabled={page >= meta.total_page || films.isFetching}
                  onClick={() => setPage((p) => p + 1)}
                  size="sm"
                  variant="outline"
                >
                  Selanjutnya
                </Button>
              </div>
            ) : null}
          </div>
        </section>
      </main>
    </Layout>
  );
}
