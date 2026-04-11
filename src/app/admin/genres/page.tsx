"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
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
import { useAuth } from "@/hooks/use-auth";
import {
  useAdminGenres,
  useGenreMutations,
} from "@/hooks/use-genres";
import Layout from "@/layouts/Layout";

const TAKE = 10;

export default function AdminGenresPage() {
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

  const [page, setPage] = useState(1);
  const [createName, setCreateName] = useState("");
  const [createMessage, setCreateMessage] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editMessage, setEditMessage] = useState("");

  const genres = useAdminGenres(page, TAKE);
  const { createGenre, updateGenre } = useGenreMutations();

  const meta = genres.data?.meta?.[0];

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreateMessage("");

    try {
      await createGenre.mutateAsync({ name: createName });
      setCreateName("");
      setCreateMessage("Genre berhasil dibuat.");
    } catch (error) {
      setCreateMessage(
        error instanceof Error ? error.message : "Genre gagal dibuat.",
      );
    }
  }

  function startEdit(id: string, currentName: string) {
    setEditingId(id);
    setEditName(currentName);
    setEditMessage("");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditName("");
    setEditMessage("");
  }

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingId) return;
    setEditMessage("");

    try {
      await updateGenre.mutateAsync({ id: editingId, name: editName });
      setEditingId(null);
      setEditName("");
      setEditMessage("Genre berhasil diubah.");
    } catch (error) {
      setEditMessage(
        error instanceof Error ? error.message : "Genre gagal diubah.",
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
        <div className="mx-auto w-full max-w-5xl space-y-6">
          <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-medium text-emerald-700">Admin</p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight text-zinc-950">
                Manajemen Genre
              </h1>
            </div>
            <Button
              nativeButton={false}
              render={<Link href="/admin/films/new" />}
              variant="outline"
              size="sm"
            >
              Tambah Film Baru
            </Button>
          </header>

          <Card className="rounded-lg border border-zinc-200 shadow-sm">
            <CardHeader>
              <CardTitle>Tambah Genre</CardTitle>
              <CardDescription>Buat kategori genre baru.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="flex gap-3" onSubmit={handleCreate}>
                <Input
                  className="max-w-xs"
                  onChange={(event) => setCreateName(event.target.value)}
                  placeholder="Nama genre..."
                  required
                  value={createName}
                />
                <Button disabled={createGenre.isPending} type="submit">
                  {createGenre.isPending ? "Menyimpan..." : "Tambah"}
                </Button>
              </form>
              {createMessage ? (
                <p className="mt-3 text-sm text-zinc-700">{createMessage}</p>
              ) : null}
            </CardContent>
          </Card>

          <Card className="rounded-lg border border-zinc-200 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Daftar Genre</CardTitle>
                  {meta ? (
                    <CardDescription>
                      {meta.total_data} genre, halaman {meta.page} dari{" "}
                      {meta.total_page}
                    </CardDescription>
                  ) : null}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {genres.isLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((item) => (
                    <div
                      className="h-12 animate-pulse rounded-lg bg-zinc-100"
                      key={item}
                    />
                  ))}
                </div>
              ) : null}

              {genres.error ? (
                <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  Genre gagal dimuat. Pastikan Anda login sebagai admin.
                </p>
              ) : null}

              {!genres.isLoading &&
              !genres.error &&
              genres.data?.data?.length === 0 ? (
                <p className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-600">
                  Belum ada genre.
                </p>
              ) : null}

              {editMessage ? (
                <p className="rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-700">
                  {editMessage}
                </p>
              ) : null}

              {genres.data?.data?.map((genre) => (
                <div
                  className="rounded-lg border border-zinc-200 bg-zinc-50 p-4"
                  key={genre.id}
                >
                  {editingId === genre.id ? (
                    <form
                      className="flex flex-col gap-3 sm:flex-row sm:items-center"
                      onSubmit={handleUpdate}
                    >
                      <Input
                        className="max-w-xs"
                        onChange={(event) => setEditName(event.target.value)}
                        required
                        value={editName}
                      />
                      <div className="flex gap-2">
                        <Button
                          disabled={updateGenre.isPending}
                          size="sm"
                          type="submit"
                        >
                          {updateGenre.isPending ? "Menyimpan..." : "Simpan"}
                        </Button>
                        <Button
                          onClick={cancelEdit}
                          size="sm"
                          type="button"
                          variant="outline"
                        >
                          Batal
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium text-zinc-900">
                        {genre.name}
                      </p>
                      <Button
                        onClick={() => startEdit(genre.id, genre.name)}
                        size="sm"
                        variant="outline"
                      >
                        Edit
                      </Button>
                    </div>
                  )}
                </div>
              ))}

              {meta && meta.total_page > 1 ? (
                <>
                  <Separator />
                  <div className="flex items-center justify-center gap-3 pt-1">
                    <Button
                      disabled={page <= 1 || genres.isFetching}
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
                      disabled={page >= meta.total_page || genres.isFetching}
                      onClick={() => setPage((p) => p + 1)}
                      size="sm"
                      variant="outline"
                    >
                      Selanjutnya
                    </Button>
                  </div>
                </>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </main>
    </Layout>
  );
}