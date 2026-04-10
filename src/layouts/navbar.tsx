"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  function handleLogout() {
    logout();
    router.push("/login");
  }

  if (!mounted) {
    return (
      <header className="fixed inset-x-0 top-0 z-50 bg-white">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="h-5 w-16 bg-zinc-200 rounded" />
          <div className="flex gap-2">
            <div className="h-8 w-16 bg-zinc-200 rounded" />
            <div className="h-8 w-16 bg-zinc-200 rounded" />
          </div>
        </nav>
      </header>
    );
  }

  const links = isAuthenticated ? authenticatedLinks : publicLinks;

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white">
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-xl font-semibold tracking-tight text-black"
        >
          FMS
        </Link>

        <div className="flex items-center gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium text-zinc-500 transition-colors hover:bg-neutral-800/10 hover:text-black",
                pathname === link.href && "bg-neutral-800/10 text-black",
              )}
            >
              {link.label}
            </Link>
          ))}

          {isAuthenticated && (
            <Button
              onClick={handleLogout}
              size="sm"
              variant="outline"
              className="ml-2"
            >
              Logout
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
}
