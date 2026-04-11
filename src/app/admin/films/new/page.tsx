"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { useCreateFilm } from "@/hooks/use-films";
import { usePublicGenres } from "@/hooks/use-genres";
import Layout from "@/layouts/Layout";
import { ArrowLeft } from "lucide-react";

const airingStatuses = [
  { label: "Sedang Tayang", value: "airing" },
  { label: "Selesai Tayang", value: "finished_airing" },
  { label: "Belum Tayang", value: "not_yet_aired" },
];

function toApiDate(datetimeLocal: string) {
  return datetimeLocal.replace("T", " ") + ":00";
}

export default function AdminNewFilmPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoadingUser } = useAuth();

  useEffect(() => {
    if (isLoadingUser) return;
    if (!isAuthenticated) {
      router.replace("/login");
    } else if (user && user.role !== "ADMIN") {
      router.replace("/");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isLoadingUser, user?.role]);

  const genres = usePublicGenres();
  const createFilm = useCreateFilm();

  const [title, setTitle] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [airingStatus, setAiringStatus] = useState("airing");
  const [totalEpisodes, setTotalEpisodes] = useState("1");
  const [releaseDate, setReleaseDate] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  function handleGenreToggle(id: string) {
    setSelectedGenres((current) =>
      current.includes(id)
        ? current.filter((g) => g !== id)
        : [...current, id],
    );
  }

  function handleImagesChange(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (files) {
      setImages(Array.from(files));
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setSuccess(false);

    if (selectedGenres.length === 0) {
      setMessage("Pilih minimal satu genre.");
      return;
    }

    if (!releaseDate) {
      setMessage("Tanggal rilis wajib diisi.");
      return;
    }

    try {
      const result = await createFilm.mutateAsync({
        title,
        synopsis,
        airing_status: airingStatus,
        total_episodes: Number(totalEpisodes),
        release_date: toApiDate(releaseDate),
        genres: selectedGenres.join(","),
        images: images.length > 0 ? images : undefined,
      });

      setSuccess(true);
      setMessage(`Film berhasil ditambahkan. ID: ${result.data.id}`);
      setTitle("");
      setSynopsis("");
      setAiringStatus("airing");
      setTotalEpisodes("1");
      setReleaseDate("");
      setSelectedGenres([]);
      setImages([]);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Film gagal ditambahkan.",
      );
    }
  }

  if (isLoadingUser || !user || user.role !== "ADMIN") {
    return (
      <Layout withNavbar>
        <main className="flex min-h-screen items-center justify-center">
          <p className="text-sm text-zinc-500">Memuat...</p>
        </main>
      </Layout>
    );
  }

  return (
    <Layout withNavbar>
      <main className="min-h-screen bg-zinc-50 px-6 py-24">
        <div className="mx-auto w-full max-w-3xl space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-700">Admin</p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight text-zinc-950">
                Tambah Film Baru
              </h1>
            </div>
            <Button
              nativeButton={false}
              render={<Link href="/admin/genres" />}
              size="sm"
              variant="outline"
            >
              <ArrowLeft />
              Manajemen Genre
            </Button>
          </div>

          <Card className="rounded-lg border border-zinc-200 shadow-sm">
            <CardHeader>
              <CardTitle>Data Film</CardTitle>
              <CardDescription>
                Isi informasi film yang akan ditambahkan ke katalog.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-zinc-800"
                    htmlFor="title"
                  >
                    Judul Film
                  </label>
                  <Input
                    id="title"
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Masukkan judul film..."
                    required
                    value={title}
                  />
                </div>

                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-zinc-800"
                    htmlFor="synopsis"
                  >
                    Sinopsis
                  </label>
                  <Textarea
                    id="synopsis"
                    onChange={(event) => setSynopsis(event.target.value)}
                    placeholder="Tulis sinopsis film..."
                    required
                    value={synopsis}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label
                      className="text-sm font-medium text-zinc-800"
                      htmlFor="airing-status"
                    >
                      Status Tayang
                    </label>
                    <select
                      className="h-8 w-full rounded-lg border border-input bg-white px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                      id="airing-status"
                      onChange={(event) => setAiringStatus(event.target.value)}
                      value={airingStatus}
                    >
                      {airingStatuses.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label
                      className="text-sm font-medium text-zinc-800"
                      htmlFor="total-episodes"
                    >
                      Jumlah Episode
                    </label>
                    <Input
                      id="total-episodes"
                      min={1}
                      onChange={(event) => setTotalEpisodes(event.target.value)}
                      required
                      type="number"
                      value={totalEpisodes}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-zinc-800"
                    htmlFor="release-date"
                  >
                    Tanggal Rilis
                  </label>
                  <Input
                    id="release-date"
                    onChange={(event) => setReleaseDate(event.target.value)}
                    required
                    type="datetime-local"
                    value={releaseDate}
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-zinc-800">Genre</p>
                  {genres.isLoading ? (
                    <p className="text-sm text-zinc-500">Memuat genre...</p>
                  ) : null}
                  {genres.data && genres.data.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {genres.data.map((genre) => {
                        const checked = selectedGenres.includes(genre.id);
                        return (
                          <label
                            className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                              checked
                                ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                                : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
                            }`}
                            key={genre.id}
                          >
                            <input
                              checked={checked}
                              className="sr-only"
                              onChange={() => handleGenreToggle(genre.id)}
                              type="checkbox"
                            />
                            {genre.name}
                          </label>
                        );
                      })}
                    </div>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-zinc-800"
                    htmlFor="images"
                  >
                    Gambar{" "}
                    <span className="font-normal text-zinc-500">(opsional)</span>
                  </label>
                  <input
                    accept="image/*"
                    className="block w-full text-sm text-zinc-700 file:mr-3 file:rounded-lg file:border file:border-zinc-200 file:bg-zinc-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-zinc-700 hover:file:bg-zinc-100"
                    id="images"
                    multiple
                    onChange={handleImagesChange}
                    type="file"
                  />
                  {images.length > 0 ? (
                    <p className="text-xs text-zinc-500">
                      {images.length} file dipilih
                    </p>
                  ) : null}
                </div>

                {message ? (
                  <p
                    className={`rounded-md border px-3 py-2 text-sm ${
                      success
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-red-200 bg-red-50 text-red-700"
                    }`}
                  >
                    {message}
                  </p>
                ) : null}

                <Button
                  className="w-full"
                  disabled={createFilm.isPending}
                  type="submit"
                >
                  {createFilm.isPending ? "Menyimpan..." : "Tambah Film"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </Layout>
  );
}