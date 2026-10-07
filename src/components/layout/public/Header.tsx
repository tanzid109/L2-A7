"use client";

import { useQueryClient } from "@tanstack/react-query";
import { LayoutDashboard, LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Brand } from "@/components/shared/brand";
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
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types";

const navLinks = [
  { name: "Home", url: "/" },
  { name: "Services", url: "/services" },
  { name: "Technicians", url: "/technicians" },
  { name: "About", url: "/about-us" },
  { name: "Contact", url: "/contact" },
];

const dashboardRoute: Record<UserRole, string> = {
  ADMIN: "/admin",
  TECHNICIAN: "/technician",
  CUSTOMER: "/customer",
};

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const { data, isLoading } = useGetMe();
  const { mutate: logout } = useLogout();
  const queryClient = useQueryClient();
  const pathname = usePathname();

  const role = data?.data?.role;
  const bookUrl = role === "CUSTOMER" ? "/customer/book" : "/services";

  const navItems =
    role === "CUSTOMER"
      ? [...navLinks, { name: "Apply as Technician", url: "/apply" }]
      : navLinks;

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
          className="w-full text-red-500 sm:w-auto"
        >
          <LogOut />
          Logout
        </Button>
      </>
    ) : null;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Brand />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {navItems.map((link) => (
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
              {navItems.map((link) => (
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
