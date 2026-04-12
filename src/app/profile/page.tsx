"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth, UserFilmList } from "@/hooks/use-auth";
import { useUserDetail } from "@/hooks/use-user-detail";
import Layout from "@/layouts/Layout";
import { useUserInteractions } from "@/hooks/use-user-interactions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe, Lock } from "lucide-react";

function getInitials(value?: string) {
  const source = value?.trim() ? value : "FMS";

  return source
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, isLoadingUser, logout, user, userError } = useAuth();
  const userDetail = useUserDetail(user?.id);

  const [activeTab, setActiveTab] = useState<"bio" | "films" | "reviews">(
    "bio",
  );

  const { updateFilmListVisibility } = useUserInteractions();

  const username = user?.username ?? "Memuat profil";
  const displayName = user?.display_name?.trim() || username;
  const bio = user?.bio?.trim() || "Belum ada bio untuk akun ini.";

  const filmLists = userDetail.data?.film_lists ?? [];
  const reviews = userDetail.data?.reviews ?? [];

  function handleLogout() {
    logout();
    toast.success("Berhasil logout.");
    router.push("/login");
  }

  async function handleToggleVisibility(film: UserFilmList) {
    if (!film.id) return;

    const newVisibility = film.visibility === "public" ? "private" : "public";

    updateFilmListVisibility.mutate({
      id: film.id,
      visibility: newVisibility,
      userId: user?.id, // penting untuk refetch
    });
  }

  if (isLoadingUser) {
    return (
      <Layout withNavbar>
        <main className="min-h-screen flex items-center justify-center">
          <p className="text-sm text-zinc-500">Memuat...</p>
        </main>
      </Layout>
    );
  }

  return (
    <Layout withNavbar>
      <main className="min-h-screen bg-zinc-50 px-6 py-24 flex justify-center items-center">
        {!isAuthenticated ? (
          <div className="relative flex items-center justify-center">
            <div className="relative w-full max-w-md">
              {/* HEADER */}
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-semibold text-zinc-900">
                  Akses Profil
                </h2>
                <p className="mt-2 text-sm text-zinc-600">
                  Login terlebih dahulu untuk melihat dan mengelola akun kamu
                </p>
              </div>

              <Card className="rounded-2xl shadow-sm bg-white/90 backdrop-blur ">
                <CardHeader>
                  <CardTitle className="text-lg">Belum Login</CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                  <Button
                    className="w-full h-11"
                    onClick={() => router.push("/login")}
                  >
                    Login
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full h-11"
                    onClick={() => router.push("/register")}
                  >
                    Register
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="mx-auto w-full max-w-5xl">
            <section className="overflow-hidden rounded-2xl border border-zinc-200 shadow-sm">
              {/* HEADER */}
              <div className="bg-gradient-to-r from-red-700 to-red-600 px-6 py-10 text-white">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="flex size-16 items-center justify-center rounded-xl bg-white text-xl font-bold text-emerald-700">
                      {getInitials(displayName)}
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold">{displayName}</h2>
                      <p className="text-sm text-emerald-100">@{username}</p>
                      {user?.email && (
                        <p className="text-xs text-emerald-200">{user.email}</p>
                      )}
                    </div>
                  </div>

                  {user?.role === "ADMIN" && (
                    <span className="rounded-lg bg-white px-3 py-1 text-sm font-medium text-emerald-700">
                      {user.role}
                    </span>
                  )}
                </div>
              </div>

              {/* CONTENT */}
              <div className="grid lg:grid-cols-[1fr_260px]">
                {/* MAIN */}
                <div className="p-6 space-y-6">
                  {userError && (
                    <p className="text-red-600 text-sm">
                      Token tidak valid. Silakan login ulang.
                    </p>
                  )}

                  {userDetail.error && (
                    <p className="text-red-600 text-sm">Gagal memuat data.</p>
                  )}

                  {/* TAB CONTENT */}

                  {activeTab === "bio" && (
                    <div className="rounded-xl border bg-zinc-50 p-5">
                      <p className="text-xs uppercase text-zinc-500">Bio</p>
                      <p className="mt-2 text-sm text-zinc-700">{bio}</p>
                    </div>
                  )}

                  {activeTab === "films" && (
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold">Film List</h3>

                      {filmLists.length === 0 && (
                        <p className="text-sm text-zinc-500">Belum ada film.</p>
                      )}

                      <div className="grid gap-3 sm:grid-cols-2">
                        {filmLists.map((film, i) => (
                          <div
                            key={film.id || i}
                            className="border rounded-xl p-4 space-y-2"
                          >
                            <p className="font-semibold">{film.film_title}</p>

                            <div className="flex justify-between items-center">
                              <span className="text-xs text-zinc-500">
                                {film.list_status}
                              </span>

                              <Select
                                value={film.visibility}
                                onValueChange={(value) =>
                                  handleToggleVisibility({
                                    ...film,
                                    visibility: value as string,
                                  })
                                }
                                disabled={updateFilmListVisibility.isPending}
                              >
                                <SelectTrigger className="w-[120px] h-8 text-xs">
                                  <SelectValue />
                                </SelectTrigger>

                                <SelectContent>
                                  <SelectItem value="public">
                                    <Globe /> Public
                                  </SelectItem>
                                  <SelectItem value="private">
                                    <Lock /> Private
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === "reviews" && (
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold">Reviews</h3>

                      {reviews.length === 0 && (
                        <p className="text-sm text-zinc-500">
                          Belum ada review.
                        </p>
                      )}

                      {reviews.map((review, i) => (
                        <div key={i} className="border rounded-xl p-4">
                          <div className="flex justify-between">
                            <p className="font-semibold">{review.film}</p>
                            <span className="text-sm text-emerald-600">
                              {review.rating}/10
                            </span>
                          </div>
                          <p className="text-sm text-zinc-600 mt-2">
                            {review.comment}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* SIDEBAR */}
                <aside className="border-t lg:border-t-0 lg:border-l bg-zinc-50 p-6">
                  <div className="space-y-6">
                    {/* NAVIGATION */}
                    <div className="bg-white border rounded-xl p-2 space-y-1">
                      {["bio", "films", "reviews"].map((tab) => (
                        <button
                          key={tab}
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          onClick={() => setActiveTab(tab as any)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                            activeTab === tab
                              ? "bg-red-600 text-white"
                              : "hover:bg-zinc-100"
                          }`}
                        >
                          {tab === "bio"
                            ? "Bio"
                            : tab === "films"
                              ? "Film List"
                              : "Reviews"}
                        </button>
                      ))}
                    </div>

                    {/* STATS */}
                    <div className="bg-white border rounded-xl p-4 text-sm space-y-2">
                      <div className="flex justify-between">
                        <span>Film</span>
                        <span>{filmLists.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Review</span>
                        <span>{reviews.length}</span>
                      </div>
                    </div>

                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      className="w-full"
                    >
                      Logout
                    </Button>
                  </div>
                </aside>
              </div>
            </section>
          </div>
        )}
      </main>
    </Layout>
  );
}
