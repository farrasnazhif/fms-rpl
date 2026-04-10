"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

const publicLinks = [
  { href: "/", label: "Films" },
  { href: "/login", label: "Login" },
  { href: "/register", label: "Register" },
];

const authenticatedLinks = [
  { href: "/", label: "Films" },
  { href: "/profile", label: "Profile" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();
  const links = isAuthenticated ? authenticatedLinks : publicLinks;

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 px-6 backdrop-blur">
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4">
        <Link className="text-lg font-semibold tracking-tight text-zinc-950" href="/">
          FMS
        </Link>

        <div className="flex items-center gap-1">
          {links.map((link) => (
            <Link
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-950",
                pathname === link.href && "bg-zinc-100 text-zinc-950"
              )}
              href={link.href}
              key={link.href}
            >
              {link.label}
            </Link>
          ))}
          {isAuthenticated ? (
            <Button onClick={handleLogout} size="sm" variant="outline">
              Logout
            </Button>
          ) : null}
        </div>
      </nav>
    </header>
  );
}
