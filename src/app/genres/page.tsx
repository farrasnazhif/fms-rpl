"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usePublicGenres } from "@/hooks/use-genres";
import Layout from "@/layouts/Layout";

export default function GenresPage() {
  const genres = usePublicGenres();

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
              Daftar seluruh kategori genre yang tersedia di FMS.
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
                {genres.data.length} genre tersedia
              </p>
              <div className="flex flex-wrap gap-2">
                {genres.data.map((genre) => (
                  <Badge key={genre.id} variant="outline">
                    {genre.name}
                  </Badge>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </Layout>
  );
}