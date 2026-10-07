"use client";

import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useGetMe } from "@/hooks";
import { adminRoutes, customerRoutes, technicianRoutes } from "@/routes";
import type { SidebarItems, UserRole } from "@/types";
import { UserAvatar } from "./user-avatar";

const sidebarRoutes: Partial<Record<UserRole, SidebarItems>> = {
  ADMIN: adminRoutes,
  TECHNICIAN: technicianRoutes,
  CUSTOMER: customerRoutes,
};

const roleLabel: Record<UserRole, string> = {
  ADMIN: "Admin",
  TECHNICIAN: "Technician",
  CUSTOMER: "Customer",
};

export function DashboardTopbar({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const { data } = useGetMe();
  const user = data?.data;

  const routes: SidebarItems = sidebarRoutes[role] || [];
  let groupTitle = "";
  let itemTitle = "Dashboard";
  for (const group of routes) {
    const match = group.items.find(
      (item) => pathname === item.url || pathname.startsWith(`${item.url}/`),
    );
    if (match) {
      groupTitle = group.title;
      itemTitle = match.title;
      break;
    }
  }

  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-4" />

      <div className="flex min-w-0 flex-col">
        {groupTitle && (
          <span className="text-xs text-muted-foreground">{groupTitle}</span>
        )}
        <h1 className="truncate text-sm font-semibold">{itemTitle}</h1>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <span className="hidden rounded-md bg-primary/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary sm:inline-flex">
          {roleLabel[role]}
        </span>

        {user && (
          <div className="flex items-center gap-2.5">
            <UserAvatar user={user} className="size-8" />
            <div className="hidden flex-col leading-tight md:flex">
              <span className="truncate text-sm font-medium">{user.name}</span>
              <span className="truncate text-xs text-muted-foreground">
                {user.email}
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
