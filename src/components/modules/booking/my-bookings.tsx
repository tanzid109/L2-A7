"use client";

import { CalendarDays, Clock, CreditCard, MapPin, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import {
  useCancelBooking,
  useCreateCheckoutSession,
  useGetMyBookings,
} from "@/hooks";
import type { BookingStatus, PaymentStatus } from "@/types";
import { formatDateKey, getSlotDateKey } from "@/utils";

const BOOKING_STATUS_STYLES: Record<BookingStatus, string> = {
  PENDING: "bg-amber-500/10 text-amber-600",
  ACCEPTED: "bg-blue-500/10 text-blue-600",
  IN_PROGRESS: "bg-violet-500/10 text-violet-600",
  COMPLETED: "bg-emerald-500/10 text-emerald-600",
  REJECTED: "bg-destructive/10 text-destructive",
  CANCELLED: "bg-muted text-muted-foreground",
};

const PAYMENT_STATUS_STYLES: Record<PaymentStatus, string> = {
  PENDING: "bg-amber-500/10 text-amber-600",
  PAID: "bg-emerald-500/10 text-emerald-600",
  FAILED: "bg-destructive/10 text-destructive",
  CANCELLED: "bg-muted text-muted-foreground",
  REFUNDED: "bg-blue-500/10 text-blue-600",
};

const STATUS_LABELS: Record<BookingStatus, string> = {
  PENDING: "Pending",
  ACCEPTED: "Accepted",
  IN_PROGRESS: "In progress",
  COMPLETED: "Completed",
  REJECTED: "Rejected",
  CANCELLED: "Cancelled",
};

const PAYMENT_LABELS: Record<PaymentStatus, string> = {
  PENDING: "Awaiting confirmation",
  PAID: "Paid",
  FAILED: "Failed",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
};

const PAGE_LIMIT = 10;

export default function MyBookings() {
  const [page, setPage] = useState(1);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const { data, isPending, isError } = useGetMyBookings({
    page,
    limit: PAGE_LIMIT,
  });
  const { mutate: cancel, isPending: cancelling } = useCancelBooking();
  const { mutate: checkout, isPending: checkingOut } =
    useCreateCheckoutSession();

  const bookings = data?.data.data ?? [];
  const meta = data?.data.meta;
  const isWorking = cancelling || checkingOut;

  const handleCancel = (bookingId: string) => {
    cancel(bookingId, {
      onSuccess: (res) => {
        toast.add({
          title: "Booking cancelled",
          description: res.message,
          type: "success",
        });
        setConfirmingId(null);
      },
      onError: (err) => {
        toast.add({
          title: "Cancel failed",
          description:
            (err as Error & { data?: { message?: string } }).data?.message ||
            err.message ||
            "Something went wrong. Please try again",
          type: "error",
        });
      },
    });
  };

  const handleCheckout = (bookingId: string) => {
    checkout(bookingId, {
      onSuccess: (res) => {
        const checkoutUrl = res.data?.checkoutUrl;

        if (!checkoutUrl) {
          toast.add({
            title: "Payment failed",
            description: "No checkout url was returned. Please try again",
            type: "error",
          });
          return;
        }

        window.location.href = checkoutUrl;
      },
      onError: (err) => {
        toast.add({
          title: "Payment failed",
          description:
            (err as Error & { data?: { message?: string } }).data?.message ||
            err.message ||
            "Something went wrong. Please try again",
          type: "error",
        });
      },
    });
  };

  if (isPending) {
    return (
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-48 w-full" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-sm text-destructive">
        Could not load your bookings. Please try again.
      </p>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed p-10 text-center">
        <p className="text-sm text-muted-foreground">
          You have not booked any service yet.
        </p>
        <Button render={<Link href="/customer/book" />}>Book a service</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {bookings.map((booking) => {
        const canCancel =
          booking.status === "PENDING" || booking.status === "ACCEPTED";
        const canPay =
          booking.status === "ACCEPTED" && booking.payment?.status !== "PAID";
        const isConfirmingCancel = confirmingId === booking.id;

        return (
          <Card key={booking.id}>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <CardTitle className="line-clamp-1">
                    {booking.service.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-1">
                    {booking.technician.user.name} ·{" "}
                    {booking.technician.specialization}
                  </CardDescription>
                </div>
                <span
                  className={`inline-flex w-fit shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-semibold ${BOOKING_STATUS_STYLES[booking.status]}`}
                >
                  {STATUS_LABELS[booking.status]}
                </span>
              </div>
            </CardHeader>

            <CardContent className="flex flex-col gap-3 text-sm">
              <div className="grid gap-3 sm:grid-cols-2">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <CalendarDays className="size-4 shrink-0" />
                  {formatDateKey(getSlotDateKey(booking.availability.date))}
                </span>
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="size-4 shrink-0" />
                  {booking.availability.startTime} –{" "}
                  {booking.availability.endTime}
                </span>
                <span className="flex items-center gap-2 text-muted-foreground">
                  <User className="size-4 shrink-0" />
                  {booking.totalAmount} BDT
                </span>
                <span className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="size-4 shrink-0 truncate" />
                  <span className="truncate">{booking.address}</span>
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted-foreground">Payment:</span>
                {booking.payment ? (
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${PAYMENT_STATUS_STYLES[booking.payment.status]}`}
                  >
                    {PAYMENT_LABELS[booking.payment.status]}
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                    Not initiated
                  </span>
                )}
                {booking.status === "PENDING" && (
                  <span className="text-xs text-muted-foreground">
                    Paying is possible once the technician accepts.
                  </span>
                )}
              </div>

              {booking.problemDescription && (
                <p className="line-clamp-2 text-xs text-muted-foreground">
                  {booking.problemDescription}
                </p>
              )}
            </CardContent>

            <CardFooter className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              {isConfirmingCancel ? (
                <div className="flex w-full items-center gap-2 sm:w-auto">
                  <span className="text-sm text-muted-foreground">
                    Cancel this booking?
                  </span>
                  <Button
                    type="button"
                    variant="destructive"
                    disabled={isWorking}
                    onClick={() => handleCancel(booking.id)}
                    className="flex-1 sm:flex-none"
                  >
                    {cancelling ? <Spinner /> : "Yes, cancel"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isWorking}
                    onClick={() => setConfirmingId(null)}
                    className="flex-1 sm:flex-none"
                  >
                    Keep it
                  </Button>
                </div>
              ) : (
                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                  <Button
                    variant="outline"
                    nativeButton={false}
                    render={<Link href={`/customer/bookings/${booking.id}`} />}
                  >
                    View details
                  </Button>
                  {canPay && (
                    <Button
                      type="button"
                      disabled={isWorking}
                      onClick={() => handleCheckout(booking.id)}
                    >
                      {checkingOut ? (
                        <>
                          <Spinner /> Redirecting
                        </>
                      ) : (
                        <>
                          <CreditCard className="size-4" />
                          Pay now
                        </>
                      )}
                    </Button>
                  )}
                  {canCancel && (
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isWorking}
                      onClick={() => setConfirmingId(booking.id)}
                    >
                      Cancel booking
                    </Button>
                  )}
                </div>
              )}
            </CardFooter>
          </Card>
        );
      })}

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={page <= 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {meta.page} of {meta.totalPages}
          </span>
          <Button
            type="button"
            variant="outline"
            disabled={page >= meta.totalPages}
            onClick={() =>
              setPage((current) => Math.min(meta.totalPages, current + 1))
            }
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
