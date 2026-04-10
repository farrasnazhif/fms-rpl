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
    <header className="fixed inset-x-0 top-0 z-50 backdrop-blur-md">
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        {/* logo */}
        <Link
          href="/"
          className="text-xl font-semibold tracking-tight text-white"
        >
          FMS
        </Link>

        {/* nav */}
        <div className="flex items-center gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium text-zinc-200 transition-colors hover:bg-white/10 hover:text-white",
                pathname === link.href && "bg-white/10 text-white",
              )}
            >
              {link.label}
            </Link>
          ))}

          {/* logout */}
          {isAuthenticated && (
            <Button
              onClick={handleLogout}
              size="sm"
              className="ml-2 bg-white/10 text-white hover:bg-white/20 border border-white/20"
            >
              Logout
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
}
