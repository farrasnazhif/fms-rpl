"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { useFilmDetail } from "@/hooks/use-films";
import { resolveImageUrl } from "@/lib/utils";
import {
  ListStatus,
  ReactionStatus,
  useUserInteractions,
} from "@/hooks/use-user-interactions";
import Layout from "@/layouts/Layout";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";

const listStatuses: Array<{ label: string; value: ListStatus }> = [
  { label: "Watching", value: "watching" },
  { label: "Completed", value: "completed" },
  { label: "Plan to watch", value: "plan_to_watch" },
];

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

export default function FilmDetailPage() {
  const params = useParams<{ id: string }>();
  const film = useFilmDetail(params.id);
  const { isAuthenticated } = useAuth();
  const interactions = useUserInteractions(params.id);
  const [listStatus, setListStatus] = useState<ListStatus>("watching");
  const [rating, setRating] = useState("8");
  const [comment, setComment] = useState("");
  const [reactionIds, setReactionIds] = useState<Record<string, string>>({});
  const [reactionStatuses, setReactionStatuses] = useState<
    Record<string, ReactionStatus>
  >({});

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

  async function handleAddToList(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await interactions.addToFilmList.mutateAsync({
        film_id: detail.id,
        list_status: listStatus,
      });
      toast.success("Film berhasil ditambahkan ke daftar tontonan.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Film gagal ditambahkan ke daftar tontonan.",
      );
    }
  }

  async function handleCreateReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await interactions.createReview.mutateAsync({
        film_id: detail.id,
        rating: Number(rating),
        comment,
      });
      setComment("");
      setRating("8");
      toast.success("Review berhasil dikirim.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Review gagal dikirim.",
      );
    }
  }

  async function handleReaction(reviewId: string, status: ReactionStatus) {
    try {
      const existingReactionId = reactionIds[reviewId];

      if (existingReactionId) {
        await interactions.updateReaction.mutateAsync({
          id: existingReactionId,
          reviewId,
          status,
        });
      } else {
        const response = await interactions.createReaction.mutateAsync({
          review_id: reviewId,
          status,
        });

        if (response.data?.id) {
          setReactionIds((current) => ({
            ...current,
            [reviewId]: response.data?.id ?? "",
          }));
        }
      }

      setReactionStatuses((current) => ({ ...current, [reviewId]: status }));
      toast.success("Reaksi berhasil disimpan.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Reaksi gagal disimpan.",
      );
    }
  }

  return (
    <Layout withNavbar>
      <main className="min-h-screen bg-zinc-50 px-6 py-24">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
          <Button
            className="w-fit"
            nativeButton={false}
            render={<Link href="/" />}
            variant="outline"
          >
            <ArrowLeft />
            Kembali ke daftar film
          </Button>

          <section className="relative overflow-hidden rounded-2xl shadow-xl">
            {/* BACKGROUND IMAGE */}
            {heroImage && (
              <div className="absolute inset-0">
                <Image
                  src={resolveImageUrl(heroImage)}
                  alt={detail.title}
                  fill
                  className="object-cover blur-sm scale-110"
                />
                <div className="absolute inset-0 bg-black/70" />
              </div>
            )}

            {/* CONTENT */}
            <div className="relative grid lg:grid-cols-[300px_1fr] gap-8 p-6 text-white">
              {/* POSTER */}
              <div className="relative w-full aspect-[2/3] overflow-hidden rounded-xl shadow-2xl">
                {heroImage ? (
                  <Image
                    src={resolveImageUrl(heroImage)}
                    alt={detail.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-zinc-800">
                    <span className="text-4xl text-white/30">
                      {detail.title[0]}
                    </span>
                  </div>
                )}
              </div>

              {/* INFO */}
              <div className="flex flex-col justify-center space-y-4">
                <Badge className="w-fit bg-red-500 text-white">
                  {formatStatus(detail.airing_status)}
                </Badge>

                <h1 className="text-4xl font-bold leading-tight">
                  {detail.title}
                </h1>

                <div className="flex flex-wrap gap-2 text-sm text-zinc-300">
                  <span>⭐ {detail.average_rating}</span>
                  <span>•</span>
                  <span>{detail.total_episodes} eps</span>
                  <span>•</span>
                  <span>{formatDate(detail.release_date)}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {detail.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="rounded-full bg-white/10 px-3 py-1 text-xs backdrop-blur"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>

                {/* ACTION */}
                {isAuthenticated && (
                  <form
                    onSubmit={handleAddToList}
                    className="flex flex-wrap gap-3 pt-2"
                  >
                    <select
                      value={listStatus}
                      onChange={(e) =>
                        setListStatus(e.target.value as ListStatus)
                      }
                      className="rounded-lg bg-white/10 px-3 py-2 text-sm backdrop-blur"
                    >
                      {listStatuses.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>

                    <Button
                      type="submit"
                      disabled={interactions.addToFilmList.isPending}
                      className="bg-red-500 hover:bg-red-400"
                    >
                      + Add to List
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-1">
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
          </section>

          <Card className="rounded-lg border border-zinc-200 shadow-sm">
            <CardHeader>
              <CardTitle>Tulis Review</CardTitle>
              <CardDescription>
                Bagikan pendapat kamu tentang film ini.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isAuthenticated ? (
                <form className="space-y-4" onSubmit={handleCreateReview}>
                  <div className="grid gap-4 sm:grid-cols-[120px_1fr]">
                    <div className="space-y-2">
                      <label
                        className="text-sm font-medium text-zinc-800"
                        htmlFor="rating"
                      >
                        Rating
                      </label>
                      <Input
                        id="rating"
                        max={10}
                        min={1}
                        onChange={(event) => setRating(event.target.value)}
                        required
                        type="number"
                        value={rating}
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        className="text-sm font-medium text-zinc-800"
                        htmlFor="comment"
                      >
                        Komentar
                      </label>
                      <Textarea
                        id="comment"
                        onChange={(event) => setComment(event.target.value)}
                        placeholder="Tulis ulasan kamu..."
                        required
                        value={comment}
                      />
                    </div>
                  </div>
                  <Button
                    disabled={interactions.createReview.isPending}
                    type="submit"
                  >
                    {interactions.createReview.isPending
                      ? "Mengirim..."
                      : "Kirim review"}
                  </Button>
                </form>
              ) : (
                <p className="text-sm text-zinc-600">
                  Login untuk menulis review.
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-lg border border-zinc-200 shadow-sm">
            <CardHeader>
              <CardTitle>Reviews</CardTitle>
              <CardDescription>
                Ulasan dari user untuk film ini.
              </CardDescription>
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
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-zinc-950">
                        Rating {review.rating}/10
                      </p>
                      <span className="text-zinc-300">·</span>
                      <Link
                        className="text-xs text-zinc-500 hover:text-emerald-700"
                        href={`/users/${review.user_id}`}
                      >
                        Pengguna #{review.user_id.slice(0, 8)}
                      </Link>
                    </div>
                    <p className="text-xs text-zinc-500">
                      {review.likes} likes · {review.dislikes} dislikes
                    </p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-zinc-700">
                    {review.comment}
                  </p>
                  {isAuthenticated ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button
                        disabled={
                          interactions.createReaction.isPending ||
                          interactions.updateReaction.isPending
                        }
                        onClick={() => handleReaction(review.id, "like")}
                        size="sm"
                        variant={
                          reactionStatuses[review.id] === "like"
                            ? "default"
                            : "outline"
                        }
                      >
                        👍 Like ({review.likes})
                      </Button>
                      <Button
                        disabled={
                          interactions.createReaction.isPending ||
                          interactions.updateReaction.isPending
                        }
                        onClick={() => handleReaction(review.id, "dislike")}
                        size="sm"
                        variant={
                          reactionStatuses[review.id] === "dislike"
                            ? "default"
                            : "outline"
                        }
                      >
                        👎 Dislike ({review.dislikes})
                      </Button>
                    </div>
                  ) : null}
                </article>
              ))}
            </CardContent>
          </Card>

          <Separator />
        </div>
      </main>
    </Layout>
  );
}
