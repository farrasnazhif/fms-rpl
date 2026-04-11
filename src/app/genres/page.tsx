"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usePublicGenres, type Genre } from "@/hooks/use-genres";
import { useFilms, fetchFilmDetail, filmKeys } from "@/hooks/use-films";
import Layout from "@/layouts/Layout";
import { resolveImageUrl } from "@/lib/utils";
import Image from "next/image";

const TAKE = 50;
const PAGE_SIZE = 12;

export default function GenresPage() {
  const genres = usePublicGenres();
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [page, setPage] = useState(1);

  // step 1: fetch the film list (no genre filter, since API doesn't support it)
  const allFilms = useFilms(
    { take: TAKE, page: 1 },
    { enabled: Boolean(selectedGenre) },
  );

  // step 2: fetch detail for every film in parallel to get their genres
  const filmDetails = useQueries({
    queries: (allFilms.data?.data ?? []).map((film) => ({
      queryKey: filmKeys.detail(film.id),
      queryFn: () => fetchFilmDetail(film.id),
      staleTime: 5 * 60 * 1000,
    })),
  });

  // step 3: filter client-side by the selected genre id
  const filteredFilms = useMemo(() => {
    if (!selectedGenre) return [];
    return filmDetails
      .filter((q) => q.data != null)
      .map((q) => q.data!)
      .filter((film) => film.genres.some((g) => g.id === selectedGenre.id));
  }, [filmDetails, selectedGenre]);

  const paginatedFilms = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredFilms.slice(start, start + PAGE_SIZE);
  }, [filteredFilms, page]);

  const totalPages = Math.ceil(filteredFilms.length / PAGE_SIZE);

  const isLoadingFilms = allFilms.isLoading;
  const isLoadingDetails =
    !isLoadingFilms && filmDetails.some((q) => q.isLoading);
  const isLoading = isLoadingFilms || isLoadingDetails;

  function handleSelectGenre(genre: Genre) {
    if (selectedGenre?.id === genre.id) {
      setSelectedGenre(null);
    } else {
      setSelectedGenre(genre);
      setPage(1);
    }
  }

  return (
    <Layout withNavbar>
      <main className="min-h-screen bg-zinc-50 px-6 py-24">
        <div className="mx-auto w-full max-w-6xl space-y-6">
          <div>
            <p className="text-sm font-medium text-emerald-700">Referensi</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-zinc-950">
              Genre Film
            </h1>
            <p className="mt-2 text-sm text-zinc-600">
              Pilih genre untuk melihat daftar film yang tersedia.
            </p>
          </div>

          {genres.isLoading ? (
            <div className="flex flex-wrap gap-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  className="h-7 w-20 animate-pulse rounded-full bg-zinc-200"
                  key={item}
                />
              ))}
            </div>
          ) : null}

          {genres.error ? (
            <Card className="rounded-lg border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-900">
                  Genre gagal dimuat
                </CardTitle>
                <CardDescription className="text-red-700">
                  Periksa koneksi API dan coba muat ulang halaman.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : null}

          {!genres.isLoading && !genres.error && genres.data?.length === 0 ? (
            <Card className="rounded-lg">
              <CardHeader>
                <CardTitle>Belum ada genre</CardTitle>
                <CardDescription>
                  Genre akan tampil ketika data tersedia.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : null}

          {genres.data && genres.data.length > 0 ? (
            <div className="rounded-lg border border-zinc-200 bg-white p-6">
              <p className="mb-4 text-sm font-medium text-zinc-500">
                {genres.data.length} genre tersedia — klik untuk memfilter film
              </p>
              <div className="flex flex-wrap gap-2">
                {genres.data.map((genre) => (
                  <button
                    key={genre.id}
                    onClick={() => handleSelectGenre(genre)}
                    type="button"
                  >
                    <Badge
                      className="cursor-pointer transition-colors"
                      variant={
                        selectedGenre?.id === genre.id ? "default" : "outline"
                      }
                    >
                      {genre.name}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {!selectedGenre ? (
            <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-10 text-center">
              <p className="text-sm text-zinc-500">
                Pilih salah satu genre di atas untuk melihat film terkait.
              </p>
            </div>
          ) : (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-700">
                    Hasil Filter
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-950 capitalize">
                    Film Genre &ldquo;{selectedGenre.name}&rdquo;
                  </h2>
                </div>
                {!isLoading && (
                  <p className="text-sm text-zinc-600">
                    {filteredFilms.length} film ditemukan
                    {totalPages > 1
                      ? `, halaman ${page} dari ${totalPages}`
                      : ""}
                  </p>
                )}
              </div>

              {isLoading ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-zinc-500">
                    <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-zinc-300 border-t-emerald-600" />
                    {isLoadingFilms
                      ? "Memuat daftar film..."
                      : `Memuat detail film (${filmDetails.filter((q) => !q.isLoading).length}/${filmDetails.length})...`}
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                      <div
                        className="h-64 animate-pulse rounded-lg border border-zinc-200 bg-white"
                        key={item}
                      />
                    ))}
                  </div>
                </div>
              ) : null}

              {!isLoading && filteredFilms.length === 0 ? (
                <Card className="rounded-lg">
                  <CardHeader>
                    <CardTitle>Film tidak ditemukan</CardTitle>
                    <CardDescription>
                      Tidak ada film untuk genre &ldquo;{selectedGenre.name}
                      &rdquo;.
                    </CardDescription>
                  </CardHeader>
                </Card>
              ) : null}

              {!isLoading && paginatedFilms.length > 0 ? (
                <div className="grid gap-5 md:grid-cols-3 lg:grid-cols-5">
                  {paginatedFilms.map((film) => {
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

                              {/* gradient */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                            </div>
                          ) : (
                            <div className="flex aspect-[2/3] items-center justify-center bg-zinc-800">
                              <span className="text-white/30 text-4xl">
                                {film.title[0]}
                              </span>
                            </div>
                          )}

                          {/* GENRE CHIP */}
                          <div className="absolute top-2 left-2">
                            <span className="rounded bg-black/70 px-2 py-1 text-xs text-white backdrop-blur">
                              {selectedGenre.name}
                            </span>
                          </div>

                          {/* INFO */}
                          <div
                            className="
              absolute bottom-0 left-0 right-0 p-3
              bg-gradient-to-t from-black/90 via-black/40 to-transparent

              opacity-100 translate-y-0

              md:translate-y-6 md:opacity-0
              md:group-hover:translate-y-0 md:group-hover:opacity-100

              transition duration-300
            "
                          >
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

              {!isLoading && totalPages > 1 ? (
                <div className="flex items-center justify-center gap-3">
                  <Button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                    size="sm"
                    variant="outline"
                  >
                    Sebelumnya
                  </Button>
                  <span className="text-sm text-zinc-600">
                    {page} / {totalPages}
                  </span>
                  <Button
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    size="sm"
                    variant="outline"
                  >
                    Selanjutnya
                  </Button>
                </div>
              ) : null}
            </section>
          )}
        </div>
      </main>
    </Layout>
  );
}
