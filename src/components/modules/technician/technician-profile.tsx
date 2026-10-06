"use client";

import {
  Banknote,
  Briefcase,
  Clock,
  Mail,
  Phone,
  Star,
  User,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import {
  useGetMyTechnicianProfile,
  useToggleTechnicianAvailability,
} from "@/hooks";
import { getErrorMessage } from "@/utils";
import TechnicianProfileEditSheet from "./technician-profile-edit-sheet";

function InfoItem({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Mail;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 text-sm">
      <div className="rounded-lg bg-muted p-2">
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <div className="flex min-w-0 flex-col">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="truncate font-medium">{children}</span>
      </div>
    </div>
  );
}

export default function TechnicianProfile() {
  const { data, isPending, isError, error, refetch, isFetching } =
    useGetMyTechnicianProfile();
  const { mutate: toggle, isPending: toggling } =
    useToggleTechnicianAvailability();
  const [editing, setEditing] = useState(false);

  if (isPending) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-40" />
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-80" />
          <Skeleton className="h-80 lg:col-span-2" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/5 p-5 text-sm">
        <p className="font-semibold text-destructive">
          Could not load your technician profile
        </p>
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

  const profile = data.data;
  const initials = profile.user.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleToggle = () => {
    toggle(undefined, {
      onSuccess: (res) => {
        toast.add({
          title: "Availability updated",
          description: res.data.isAvailable
            ? "You are now available for new bookings"
            : "You will not receive new bookings while paused",
          type: "success",
        });
      },
      onError: (err) => {
        toast.add({
          title: "Could not update availability",
          description: getErrorMessage(err),
          type: "error",
        });
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
          <p className="text-sm text-muted-foreground">
            Your public technician profile and availability.
          </p>
        </div>
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href="/technician/profile-update" />}
        >
          Update account details
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Signed-in user details</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <div className="flex items-center gap-4">
              {profile.user.avatar ? (
                // biome-ignore lint/performance/noImgElement: simple avatar
                <img
                  src={profile.user.avatar}
                  alt={profile.user.name}
                  className="size-16 rounded-full border-4 border-background object-cover"
                />
              ) : (
                <div className="flex size-16 items-center justify-center rounded-full border-4 border-background bg-primary text-lg font-bold text-primary-foreground">
                  {initials}
                </div>
              )}
              <div className="flex min-w-0 flex-col gap-1">
                <span className="truncate text-lg font-semibold">
                  {profile.user.name}
                </span>
                <div className="flex gap-2">
                  <Badge>TECHNICIAN</Badge>
                  <Badge
                    variant={profile.isAvailable ? "default" : "secondary"}
                  >
                    {profile.isAvailable ? "Available" : "Paused"}
                  </Badge>
                </div>
              </div>
            </div>

            <InfoItem icon={Mail} label="Email">
              {profile.user.email}
            </InfoItem>
            <InfoItem icon={Phone} label="Phone">
              {profile.user.phone ?? "-"}
            </InfoItem>
            <InfoItem icon={User} label="Member since">
              {new Date(profile.createdAt).toLocaleDateString()}
            </InfoItem>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div>
              <CardTitle>Professional profile</CardTitle>
              <CardDescription>
                Shown to customers when they browse technicians
              </CardDescription>
            </div>
            <Button size="sm" onClick={() => setEditing(true)}>
              Edit profile
            </Button>
          </CardHeader>
          <CardContent className="grid gap-5 sm:grid-cols-2">
            <InfoItem icon={Briefcase} label="Specialization">
              {profile.specialization}
            </InfoItem>
            <InfoItem icon={Clock} label="Experience">
              {profile.experience} year{profile.experience === 1 ? "" : "s"}
            </InfoItem>
            <InfoItem icon={Banknote} label="Hourly rate">
              {Number(profile.hourlyRate).toLocaleString()} BDT
            </InfoItem>
            <InfoItem icon={Star} label="Rating">
              <span className="flex items-center gap-2">
                {Number(profile.rating).toFixed(1)}
                <span className="text-xs font-normal text-muted-foreground">
                  ({profile.totalReviews} review
                  {profile.totalReviews === 1 ? "" : "s"})
                </span>
                <Link
                  href="/technician/reviews"
                  className="text-xs font-normal text-primary underline-offset-2 hover:underline"
                >
                  View
                </Link>
              </span>
            </InfoItem>

            <div className="sm:col-span-2">
              <span className="text-xs text-muted-foreground">Bio</span>
              <p className="mt-1 whitespace-pre-wrap text-sm">
                {profile.bio || "No bio added yet."}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 border-t pt-4 sm:col-span-2">
              <span
                className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                  profile.isAvailable
                    ? "bg-emerald-500/10 text-emerald-600"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {profile.isAvailable
                  ? "Accepting new bookings"
                  : "Not accepting bookings"}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={toggling}
                onClick={handleToggle}
              >
                {toggling ? (
                  <Spinner />
                ) : profile.isAvailable ? (
                  "Pause availability"
                ) : (
                  "Resume availability"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {editing && (
        <Sheet
          open
          onOpenChange={(open) => {
            if (!open) setEditing(false);
          }}
        >
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Edit professional profile</SheetTitle>
              <SheetDescription>
                Update your specialization, experience, rate and bio.
              </SheetDescription>
            </SheetHeader>
            <TechnicianProfileEditSheet
              profile={profile}
              onClose={() => setEditing(false)}
            />
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}
