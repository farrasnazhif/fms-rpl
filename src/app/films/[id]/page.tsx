"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { baseURL } from "@/lib/api";
import { useFilmDetail } from "@/hooks/use-films";

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

function resolveImageUrl(image: string) {
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  const apiRoot = baseURL?.replace(/\/api\/v\d+\/?$/, "") ?? "";
  return `${apiRoot}/storage/${image}`;
}

export default function FilmDetailPage() {
  const params = useParams<{ id: string }>();
  const film = useFilmDetail(params.id);

  if (film.isLoading) {
    return (
      <main className="min-h-screen bg-zinc-50 px-6 py-10">
        <div className="mx-auto w-full max-w-6xl space-y-4">
          <div className="h-72 animate-pulse rounded-lg bg-zinc-200" />
          <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
            <div className="h-80 animate-pulse rounded-lg bg-white" />
            <div className="h-80 animate-pulse rounded-lg bg-white" />
          </div>
        </div>
      </main>
    );
  }

  if (film.error || !film.data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 py-16">
        <Card className="w-full max-w-md rounded-lg border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-900">Film gagal dimuat</CardTitle>
            <CardDescription className="text-red-700">
              Detail film tidak ditemukan atau API sedang tidak merespons.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button nativeButton={false} render={<Link href="/" />}>
              Kembali ke daftar film
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  const detail = film.data;
  const heroImage = detail.images.at(0);

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <Button
          className="w-fit"
          nativeButton={false}
          render={<Link href="/" />}
          variant="outline"
        >
          Kembali ke daftar film
        </Button>

        <section className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
            <div className="relative min-h-80 bg-zinc-900">
              {heroImage ? (
                <div
                  aria-label={detail.title}
                  className="absolute inset-0 bg-cover bg-center"
                  role="img"
                  style={{
                    backgroundImage: `url(${resolveImageUrl(heroImage)})`,
                  }}
                />
              ) : null}
              <div className="absolute inset-0 bg-black/45" />
              <div className="relative flex min-h-80 flex-col justify-end p-6 text-white">
                <Badge className="mb-4 w-fit" variant="secondary">
                  {formatStatus(detail.airing_status)}
                </Badge>
                <h1 className="max-w-3xl text-4xl leading-tight font-semibold tracking-tight text-balance">
                  {detail.title}
                </h1>
              </div>
            </div>

            <div className="space-y-5 p-6">
              <div>
                <p className="text-sm font-medium text-emerald-700">
                  Detail Film
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-zinc-950">
                  Informasi
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                  <p className="text-xs font-medium uppercase text-zinc-500">
                    Episode
                  </p>
                  <p className="mt-1 text-xl font-semibold text-zinc-950">
                    {detail.total_episodes}
                  </p>
                </div>
                <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                  <p className="text-xs font-medium uppercase text-zinc-500">
                    Rating
                  </p>
                  <p className="mt-1 text-xl font-semibold text-zinc-950">
                    {detail.average_rating}/10
                  </p>
                </div>
              </div>
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-xs font-medium uppercase text-zinc-500">
                  Tanggal rilis
                </p>
                <p className="mt-1 text-sm font-medium text-zinc-950">
                  {formatDate(detail.release_date)}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {detail.genres.map((genre) => (
                  <Badge key={genre.id} variant="outline">
                    {genre.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <Card className="rounded-lg border border-zinc-200 shadow-sm">
            <CardHeader>
              <CardTitle>Synopsis</CardTitle>
              <CardDescription>Cerita singkat dari film ini.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line text-base leading-7 text-zinc-700">
                {detail.synopsis || "Belum ada synopsis."}
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-lg border border-zinc-200 shadow-sm">
            <CardHeader>
              <CardTitle>Images</CardTitle>
              <CardDescription>Asset gambar dari detail film.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {detail.images.length === 0 ? (
                <p className="text-sm text-zinc-600">Belum ada gambar.</p>
              ) : null}
              {detail.images.map((image) => (
                <div
                  aria-label={detail.title}
                  className="aspect-video overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 bg-cover bg-center"
                  key={image}
                  role="img"
                  style={{ backgroundImage: `url(${resolveImageUrl(image)})` }}
                />
              ))}
            </CardContent>
          </Card>
        </section>

        <Card className="rounded-lg border border-zinc-200 shadow-sm">
          <CardHeader>
            <CardTitle>Reviews</CardTitle>
            <CardDescription>Ulasan dari user untuk film ini.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {detail.reviews.length === 0 ? (
              <p className="text-sm text-zinc-600">Belum ada review.</p>
            ) : null}
            {detail.reviews.map((review) => (
              <article
                className="rounded-lg border border-zinc-200 bg-zinc-50 p-4"
                key={review.id}
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm font-medium text-zinc-950">
                    Rating {review.rating}/10
                  </p>
                  <p className="text-xs text-zinc-500">
                    {review.likes} likes, {review.dislikes} dislikes
                  </p>
                </div>
                <p className="mt-3 text-sm leading-6 text-zinc-700">
                  {review.comment}
                </p>
              </article>
            ))}
          </CardContent>
        </Card>

        <Separator />
      </div>
    </main>
  );
}
