"use client";

import { useParams } from "next/navigation";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUserDetail } from "@/hooks/use-user-detail";
import Layout from "@/layouts/Layout";

function getInitials(value?: string) {
  const source = value?.trim() ? value : "FMS";

  return source
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function PublicUserProfilePage() {
  const params = useParams<{ id: string }>();
  const userDetail = useUserDetail(params.id);

  if (userDetail.isLoading) {
    return (
      <Layout withNavbar>
        <main className="min-h-screen bg-zinc-50 px-6 py-24">
          <div className="mx-auto w-full max-w-4xl space-y-4">
            <div className="h-48 animate-pulse rounded-lg bg-zinc-200" />
            <div className="h-64 animate-pulse rounded-lg bg-white" />
          </div>
        </main>
      </Layout>
    );
  }

  if (userDetail.error || !userDetail.data) {
    return (
      <Layout withNavbar>
        <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 py-16">
          <Card className="w-full max-w-md rounded-lg border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-900">
                Profil tidak ditemukan
              </CardTitle>
              <CardDescription className="text-red-700">
                Pengguna tidak ditemukan atau API sedang tidak merespons.
              </CardDescription>
            </CardHeader>
          </Card>
        </main>
      </Layout>
    );
  }

  const user = userDetail.data;
  const displayName = user.display_name?.trim() || user.username;
  const bio = user.bio?.trim() || "Belum ada bio untuk akun ini.";
  const publicFilmLists = user.film_lists ?? [];
  const reviews = user.reviews ?? [];

  return (
    <Layout withNavbar>
      <main className="min-h-screen bg-zinc-50 px-6 py-24">
        <div className="mx-auto w-full max-w-4xl space-y-6">
          <section className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
            <div className="bg-gradient-to-r from-red-700 to-red-600 px-6 py-10 text-white">
              <div className="flex items-center gap-4">
                <div className="flex size-20 shrink-0 items-center justify-center rounded-lg border border-white/30 bg-white text-2xl font-semibold text-emerald-800">
                  {getInitials(displayName)}
                </div>
                <div>
                  <p className="text-sm font-medium text-emerald-50">
                    Username
                  </p>
                  <h1 className="mt-1 text-3xl font-semibold">
                    {user.username}
                  </h1>
                  {displayName !== user.username ? (
                    <p className="mt-1 text-sm text-emerald-100">
                      {displayName}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="space-y-6 p-6">
              <article className="rounded-lg border border-zinc-200 bg-zinc-50 p-5">
                <p className="text-xs font-medium uppercase text-zinc-500">
                  Bio
                </p>
                <p className="mt-3 whitespace-pre-line text-base leading-7 text-zinc-800">
                  {bio}
                </p>
              </article>
            </div>
          </section>

          <section className="space-y-3">
            <div>
              <h2 className="text-lg font-semibold text-zinc-950">Film List</h2>
              <p className="mt-1 text-sm text-zinc-600">
                Daftar tontonan publik dari pengguna ini.
              </p>
            </div>
            {publicFilmLists.length === 0 ? (
              <p className="rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-600">
                Belum ada film di list publik.
              </p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {publicFilmLists.map((film) => (
                  <article
                    className="rounded-lg border border-zinc-200 bg-white p-4"
                    key={`${film.film_title}-${film.list_status}`}
                  >
                    <p className="text-base font-semibold text-zinc-950">
                      {film.film_title}
                    </p>
                    <p className="mt-2 w-fit rounded-lg bg-zinc-100 px-2 py-1 text-xs font-medium uppercase text-zinc-600">
                      {film.list_status.replaceAll("_", " ")}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="space-y-3">
            <div>
              <h2 className="text-lg font-semibold text-zinc-950">Reviews</h2>
              <p className="mt-1 text-sm text-zinc-600">
                Ulasan yang ditulis oleh pengguna ini.
              </p>
            </div>
            {reviews.length === 0 ? (
              <p className="rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-600">
                Belum ada review.
              </p>
            ) : (
              <div className="space-y-3">
                {reviews.map((review) => (
                  <article
                    className="rounded-lg border border-zinc-200 bg-white p-4"
                    key={`${review.film}-${review.rating}-${review.comment}`}
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-base font-semibold text-zinc-950">
                        {review.film}
                      </p>
                      <p className="w-fit rounded-lg bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                        Rating {review.rating}/10
                      </p>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-zinc-700">
                      {review.comment}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </Layout>
  );
}
