"use client";

import { useQueryClient } from "@tanstack/react-query";
import { cn } from "cn";
import { LayoutDashboard, LogOut, Menu, Wrench } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from "@/components/ui/toast";
import { useGetMe, useLogout } from "@/hooks";
import type { UserRole } from "@/types";

const navLinks = [
  { name: "Services", url: "/services" },
  { name: "How It Works", url: "/#how-it-works" },
  { name: "Technicians", url: "/technicians" },
  { name: "About", url: "/about-us" },
  { name: "Contact", url: "/contact" },
];

const dashboardRoute: Record<UserRole, string> = {
  ADMIN: "/admin",
  TECHNICIAN: "/technician",
  CUSTOMER: "/customer",
};

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Wrench className="size-4" />
      </span>
      <span className="font-heading text-lg font-bold tracking-tight">
        FieldOps
      </span>
    </Link>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const { data, isLoading } = useGetMe();
  const { mutate: logout } = useLogout();
  const queryClient = useQueryClient();
  const pathname = usePathname();

  const role = data?.data?.role;
  const bookUrl = role === "CUSTOMER" ? "/customer/book" : "/services";

  const handleLogout = () => {
    setMenuOpen(false);
    logout(undefined, {
      onSuccess: () => {
        toast.add({
          title: "Good Bye",
          description: "Logged out successfully",
          type: "success",
        });
        queryClient.removeQueries({ queryKey: ["user"] });
      },
      onError: () => {
        toast.add({
          title: "Logout failed",
          description: "Something Went Wrong",
          type: "error",
        });
      },
    });
  };

  const actions =
    !isLoading && !data ? (
      <>
        <Button
          variant="outline"
          render={<Link href="/login" />}
          nativeButton={false}
          className="w-full sm:w-auto"
        >
          Login
        </Button>
        <Button
          render={<Link href="/register" />}
          nativeButton={false}
          className="w-full sm:w-auto"
        >
          Get Started
        </Button>
      </>
    ) : !isLoading && data && role ? (
      <>
        <Button
          variant="outline"
          render={<Link href={bookUrl} />}
          nativeButton={false}
          className="w-full sm:w-auto"
        >
          Book now
        </Button>
        <Button
          render={<Link href={dashboardRoute[role]} />}
          nativeButton={false}
          className="w-full sm:w-auto"
        >
          <LayoutDashboard />
          Dashboard
        </Button>
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full text-muted-foreground sm:w-auto"
        >
          <LogOut />
          Logout
        </Button>
      </>
    ) : null;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Brand />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {navLinks.map((link) => (
            <Link
              key={link.url}
              href={link.url}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                pathname === link.url &&
                  "bg-muted text-foreground font-semibold",
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">{actions}</div>

        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon" className="lg:hidden" />
            }
          >
            <Menu className="size-5" />
            <span className="sr-only">Open navigation menu</span>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader className="border-b">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <SheetDescription className="sr-only">
                Site navigation and account actions
              </SheetDescription>
              <Brand />
            </SheetHeader>

            <nav className="flex flex-col gap-1 px-4 py-2" aria-label="Mobile">
              {navLinks.map((link) => (
                <SheetClose
                  key={link.url}
                  render={
                    <Link
                      href={link.url}
                      className={cn(
                        "rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                        pathname === link.url &&
                          "bg-muted text-foreground font-semibold",
                      )}
                    />
                  }
                >
                  {link.name}
                </SheetClose>
              ))}
            </nav>

            <div className="mt-auto flex flex-col gap-2 border-t p-4">
              {actions}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
