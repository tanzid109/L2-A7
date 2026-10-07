"use client";

import { useQueryClient } from "@tanstack/react-query";
import { cn } from "cn";
import { Globe, LogOut, Wrench } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { toast } from "@/components/ui/toast";
import { useGetMe, useLogout } from "@/hooks";
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

export function DashboardSidebar({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const router = useRouter();
  const routes: SidebarItems = sidebarRoutes[role] || [];

  const { data } = useGetMe();
  const { mutate: logout } = useLogout();
  const queryClient = useQueryClient();
  const user = data?.data;

  const activeUrl = routes
    .flatMap((group) => group.items)
    .map((item) => item.url)
    .filter((url) => pathname === url || pathname.startsWith(`${url}/`))
    .sort((a, b) => b.length - a.length)[0];

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        toast.add({
          title: "Good Bye",
          description: "Logged out successfully",
          type: "success",
        });
        queryClient.removeQueries({ queryKey: ["user"] });
        router.push("/");
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

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link href="/" className="flex h-10 items-center gap-2 px-2">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Wrench className="size-4" />
          </span>
          <span className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="font-heading text-base font-bold tracking-tight">
              FieldOps
            </span>
            <span className="text-[10px] font-medium uppercase tracking-widest text-sidebar-foreground/60">
              Service Portal
            </span>
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {routes.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        render={<Link href={item.url} />}
                        tooltip={item.title}
                        isActive={item.url === activeUrl}
                        className={cn(
                          "data-active:bg-sidebar-primary data-active:text-sidebar-primary-foreground data-active:hover:bg-sidebar-primary/90",
                        )}
                      >
                        {Icon && <Icon />}
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={<Link href="/" />}
              tooltip="Back to website"
              className="group-data-[collapsible=icon]:hidden"
            >
              <Globe />
              <span>Back to website</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarSeparator />

        <div className="flex w-full items-center gap-2 px-2 py-1 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          {user ? (
            <>
              <UserAvatar user={user} className="size-8" />
              <div className="flex min-w-0 flex-col leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate text-sm font-medium">
                  {user.name}
                </span>
                <span className="truncate text-xs text-sidebar-foreground/60">
                  {roleLabel[user.role]}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={handleLogout}
                className="ml-auto size-8 text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground group-data-[collapsible=icon]:hidden"
                title="Logout"
              >
                <LogOut />
                <span className="sr-only">Logout</span>
              </Button>
            </>
          ) : (
            <span className="text-xs text-sidebar-foreground/60 group-data-[collapsible=icon]:hidden">
              Account
            </span>
          )}
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
