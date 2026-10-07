"use client";

import {
  ArrowLeft,
  CalendarDays,
  Clock,
  CreditCard,
  Mail,
  MapPin,
  Phone,
  Star,
  TriangleAlert,
  User,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  BookingStatusBadge,
  PaymentStatusBadge,
} from "@/components/shared/booking-badges";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { useGetBookingDetail, useUpdateBookingStatus } from "@/hooks";
import type { UpdatableBookingStatus } from "@/types";
import { formatDateKey, getErrorMessage, getSlotDateKey } from "@/utils";

interface StatusAction {
  status: UpdatableBookingStatus;
  label: string;
  variant: "default" | "outline" | "destructive";
  needsConfirm: boolean;
}

const STATUS_ACTIONS: Record<string, StatusAction[]> = {
  PENDING: [
    {
      status: "ACCEPTED",
      label: "Accept booking",
      variant: "default",
      needsConfirm: false,
    },
    {
      status: "REJECTED",
      label: "Reject booking",
      variant: "destructive",
      needsConfirm: true,
    },
    {
      status: "CANCELLED",
      label: "Cancel booking",
      variant: "outline",
      needsConfirm: true,
    },
  ],
  ACCEPTED: [
    {
      status: "IN_PROGRESS",
      label: "Start job",
      variant: "default",
      needsConfirm: false,
    },
    {
      status: "CANCELLED",
      label: "Cancel booking",
      variant: "outline",
      needsConfirm: true,
    },
  ],
  IN_PROGRESS: [
    {
      status: "COMPLETED",
      label: "Mark as completed",
      variant: "default",
      needsConfirm: false,
    },
    {
      status: "CANCELLED",
      label: "Cancel booking",
      variant: "outline",
      needsConfirm: true,
    },
  ],
};

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

export default function TechnicianBookingDetail({
  bookingId,
}: {
  bookingId: string;
}) {
  const { data, isPending, isError, error, refetch, isFetching } =
    useGetBookingDetail(bookingId);
  const { mutate: updateStatus, isPending: updating } =
    useUpdateBookingStatus();
  const [confirming, setConfirming] = useState<UpdatableBookingStatus | null>(
    null,
  );

  const handleStatus = (status: UpdatableBookingStatus) => {
    const current = data?.data;

    if (
      (status === "IN_PROGRESS" || status === "COMPLETED") &&
      current?.payment?.status !== "PAID"
    ) {
      toast.add({
        title: "Payment required",
        description:
          "Work cannot start until the customer completes the payment.",
        type: "error",
      });
      setConfirming(null);
      return;
    }

    updateStatus(
      { bookingId, payload: { status } },
      {
        onSuccess: (res) => {
          toast.add({
            title: "Status updated",
            description: res.message,
            type: "success",
          });
          setConfirming(null);
        },
        onError: (err) => {
          toast.add({
            title: "Could not update status",
            description: getErrorMessage(err),
            type: "error",
          });
          setConfirming(null);
        },
      },
    );
  };

  if (isPending) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 lg:grid-cols-3">
          <Skeleton className="h-64 lg:col-span-2" />
          <Skeleton className="h-64" />
          <Skeleton className="h-40 lg:col-span-3" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-4">
        <Button
          variant="outline"
          size="sm"
          nativeButton={false}
          render={<Link href="/technician/bookings" />}
        >
          <ArrowLeft className="size-4" /> Back to bookings
        </Button>
        <div className="flex flex-col items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/5 p-5 text-sm">
          <p className="font-semibold text-destructive">
            Could not load this booking
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
      </div>
    );
  }

  const booking = data.data;
  const isPaid = booking.payment?.status === "PAID";
  const allActions = STATUS_ACTIONS[booking.status] ?? [];
  const actions =
    booking.status === "ACCEPTED" && !isPaid
      ? allActions.filter((action) => action.status !== "IN_PROGRESS")
      : allActions;
  const duration = booking.service.duration;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<Link href="/technician/bookings" />}
          >
            <ArrowLeft className="size-4" /> Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {booking.service.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              Booked on {formatDateKey(booking.createdAt.slice(0, 10))}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <BookingStatusBadge status={booking.status} />
          {booking.payment && (
            <PaymentStatusBadge status={booking.payment.status} />
          )}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Booking details</CardTitle>
            <CardDescription>
              Reference {booking.id.slice(0, 8).toUpperCase()}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5 sm:grid-cols-2">
            <InfoItem icon={CalendarDays} label="Date">
              {formatDateKey(getSlotDateKey(booking.availability.date))}
            </InfoItem>
            <InfoItem icon={Clock} label="Time slot">
              {booking.availability.startTime} – {booking.availability.endTime}{" "}
              ({duration} min)
            </InfoItem>
            <InfoItem icon={CreditCard} label="Total amount">
              {Number(booking.totalAmount).toLocaleString()} BDT
            </InfoItem>
            <InfoItem icon={User} label="Scheduled for">
              {formatDateKey(getSlotDateKey(booking.scheduledAt))}
            </InfoItem>
            <div className="sm:col-span-2">
              <InfoItem icon={MapPin} label="Service address">
                {booking.address}
              </InfoItem>
            </div>
            <div className="sm:col-span-2">
              <span className="text-xs text-muted-foreground">
                Problem description
              </span>
              <p className="mt-1 whitespace-pre-wrap text-sm">
                {booking.problemDescription}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer</CardTitle>
            <CardDescription>Who requested this booking</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5">
            <InfoItem icon={User} label="Name">
              {booking.customer.name}
            </InfoItem>
            <InfoItem icon={Mail} label="Email">
              {booking.customer.email}
            </InfoItem>
            <InfoItem icon={Phone} label="Phone">
              {booking.customer.phone ?? "-"}
            </InfoItem>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Payment</CardTitle>
            <CardDescription>Payment status for this booking</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-4 text-sm">
            {booking.payment ? (
              <>
                <PaymentStatusBadge status={booking.payment.status} />
                <span className="text-muted-foreground">
                  {booking.payment.method} ·{" "}
                  {Number(booking.payment.amount).toLocaleString()} BDT
                </span>
                {booking.payment.paidAt && (
                  <span className="text-muted-foreground">
                    Paid on{" "}
                    {new Date(booking.payment.paidAt).toLocaleDateString()}
                  </span>
                )}
              </>
            ) : (
              <p className="text-muted-foreground">
                Payment has not been initiated by the customer yet.
              </p>
            )}
            {booking.status === "ACCEPTED" && !isPaid && (
              <div className="flex w-full items-start gap-2 rounded-lg border border-dashed bg-muted/40 p-3 text-sm text-muted-foreground">
                <TriangleAlert className="mt-0.5 size-4 shrink-0 text-amber-500" />
                The customer has not completed payment yet. The job can only
                start after payment is confirmed.
              </div>
            )}
          </CardContent>
        </Card>

        {booking.review && (
          <Card>
            <CardHeader>
              <CardTitle>Customer review</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }, (_, i) => i + 1).map((star) => (
                  <Star
                    key={star}
                    className={
                      star <= (booking.review?.rating ?? 0)
                        ? "size-4 fill-amber-400 text-amber-400"
                        : "size-4 text-muted-foreground"
                    }
                  />
                ))}
              </div>
              <p className="text-muted-foreground">
                {booking.review?.comment ?? "No comment provided."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Update status</CardTitle>
          <CardDescription>
            {booking.status === "ACCEPTED" && !isPaid
              ? "Waiting for the customer to complete payment before the job can start."
              : actions.length > 0
                ? "Move this booking forward or reject it."
                : "This booking is closed and can no longer be updated."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3">
          {actions.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No further actions are available for a{" "}
              {booking.status.toLowerCase()} booking.
            </p>
          ) : confirming ? (
            <>
              <span className="text-sm text-muted-foreground">
                {confirming === "REJECTED"
                  ? "Reject this booking? The customer will be notified."
                  : confirming === "CANCELLED"
                    ? "Cancel this booking? The time slot will be freed."
                    : `Confirm: ${confirming}?`}
              </span>
              <Button
                type="button"
                variant="destructive"
                disabled={updating}
                onClick={() => handleStatus(confirming)}
              >
                {updating ? <Spinner /> : "Yes, confirm"}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={updating}
                onClick={() => setConfirming(null)}
              >
                Go back
              </Button>
            </>
          ) : (
            actions.map((action) => (
              <Button
                key={action.status}
                type="button"
                variant={action.variant}
                disabled={updating}
                onClick={() =>
                  action.needsConfirm
                    ? setConfirming(action.status)
                    : handleStatus(action.status)
                }
              >
                {updating ? <Spinner /> : action.label}
              </Button>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
