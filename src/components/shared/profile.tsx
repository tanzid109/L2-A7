"use client";

import { BadgeCheck, Calendar, Mail, Phone, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useGetMe } from "@/hooks";
import type { UserStatus } from "@/types";
import ProfileLoading from "./profile-loading";

const statusVariant: Record<
  UserStatus,
  "default" | "secondary" | "destructive"
> = {
  ACTIVE: "default",
  INACTIVE: "secondary",
  BLOCKED: "destructive",
};

function getErrorMessage(error: unknown) {
  return (
    (error as Error & { data?: { message?: string } })?.data?.message ||
    (error as Error)?.message ||
    "Something went wrong. Please try again"
  );
}

function InfoRow({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Mail;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <div className="rounded-lg bg-muted p-2">
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="font-medium">{children}</span>
      </div>
    </div>
  );
}

export default function Profile() {
  const { data, isPending, isError, error, refetch, isFetching } = useGetMe();

  if (isPending) return <ProfileLoading />;

  if (isError) {
    return (
      <div className="flex flex-col items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/5 p-5 text-sm">
        <p className="font-semibold text-destructive">Could not load profile</p>
        <p className="text-muted-foreground">{getErrorMessage(error)}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          {isFetching ? <Spinner /> : "Retry"}
        </Button>
      </div>
    );
  }

  const user = data.data;
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="mx-auto flex flex-col gap-6">
      <h1 className="text-2xl font-bold tracking-tight">Profile</h1>

      <Card className="">
        <CardContent className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-4">
            {user.avatar ? (
              // biome-ignore lint/performance/noImgElement: simple avatar
              <img
                src={user.avatar}
                alt={user.name}
                className="size-24 rounded-full border-4 border-background object-cover"
              />
            ) : (
              <div className="flex size-24 items-center justify-center rounded-full border-4 border-background bg-primary text-2xl font-bold text-primary-foreground">
                {initials}
              </div>
            )}
            <div className="flex flex-col gap-2 pb-1">
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <div className="flex gap-2">
                <Badge>{user.role}</Badge>
                <Badge variant={statusVariant[user.status]}>
                  {user.status}
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <InfoRow icon={Mail} label="Email">
              {user.email}
            </InfoRow>
            <InfoRow icon={Phone} label="Phone">
              {user.phone ?? "-"}
            </InfoRow>
            <InfoRow icon={BadgeCheck} label="Email verified">
              {user.emailVerified ? "Verified" : "Not verified"}
            </InfoRow>
            <InfoRow icon={Shield} label="Sign-in method">
              {user.authProvider === "GOOGLE" ? "Google" : "Email & password"}
            </InfoRow>
            <InfoRow icon={Calendar} label="Member since">
              {new Date(user.createdAt).toLocaleDateString()}
            </InfoRow>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
