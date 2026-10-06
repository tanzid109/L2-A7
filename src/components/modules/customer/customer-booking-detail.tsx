"use client";

import { useForm } from "@tanstack/react-form";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  CreditCard,
  Mail,
  MapPin,
  Phone,
  Star,
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
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import {
  useCancelBooking,
  useCreateCheckoutSession,
  useCreateReview,
  useGetBookingDetail,
} from "@/hooks";
import { formatDateKey, getErrorMessage, getSlotDateKey } from "@/utils";
import {
  MAX_REVIEW_COMMENT_LENGTH,
  type ReviewFormValues,
  reviewFormSchema,
} from "@/validation";

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

function StarPicker({
  value,
  onChange,
  onBlur,
}: {
  value: number;
  onChange: (rating: number) => void;
  onBlur: () => void;
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          aria-label={`Rate ${star} star${star === 1 ? "" : "s"}`}
          onClick={() => onChange(star)}
          onBlur={onBlur}
          className="transition-transform hover:scale-110"
        >
          <Star
            className={
              star <= value
                ? "size-6 fill-amber-400 text-amber-400"
                : "size-6 text-muted-foreground"
            }
          />
        </button>
      ))}
    </div>
  );
}

export default function CustomerBookingDetail({
  bookingId,
}: {
  bookingId: string;
}) {
  const { data, isPending, isError, error, refetch, isFetching } =
    useGetBookingDetail(bookingId);
  const { mutate: cancel, isPending: cancelling } = useCancelBooking();
  const { mutate: checkout, isPending: checkingOut } =
    useCreateCheckoutSession();
  const { mutate: submitReview, isPending: submittingReview } =
    useCreateReview();
  const [confirmingCancel, setConfirmingCancel] = useState(false);

  const defaultValues: ReviewFormValues = { rating: 0, comment: "" };

  const reviewForm = useForm({
    defaultValues,
    validators: { onSubmit: reviewFormSchema },
    onSubmit: ({ value }) => {
      submitReview(
        {
          bookingId,
          rating: value.rating,
          ...(value.comment.trim() ? { comment: value.comment.trim() } : {}),
        },
        {
          onSuccess: (res) => {
            toast.add({
              title: "Review submitted",
              description: res.message,
              type: "success",
            });
            reviewForm.reset();
          },
          onError: (err) => {
            toast.add({
              title: "Could not submit review",
              description: getErrorMessage(err),
              type: "error",
            });
          },
        },
      );
    },
  });

  const handleCancel = () => {
    cancel(bookingId, {
      onSuccess: (res) => {
        toast.add({
          title: "Booking cancelled",
          description: res.message,
          type: "success",
        });
        setConfirmingCancel(false);
      },
      onError: (err) => {
        toast.add({
          title: "Cancel failed",
          description: getErrorMessage(err),
          type: "error",
        });
        setConfirmingCancel(false);
      },
    });
  };

  const handleCheckout = () => {
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
          description: getErrorMessage(err),
          type: "error",
        });
      },
    });
  };

  if (isPending) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 lg:grid-cols-3">
          <Skeleton className="h-64 lg:col-span-2" />
          <Skeleton className="h-64" />
          <Skeleton className="h-40 lg:col-span-3" />
          <Skeleton className="h-64 lg:col-span-3" />
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
          render={<Link href="/customer/bookings" />}
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
  const duration = booking.service.duration;
  const canCancel =
    booking.status === "PENDING" || booking.status === "ACCEPTED";
  const canPay =
    booking.status === "ACCEPTED" && booking.payment?.status !== "PAID";
  const canReview =
    booking.status === "COMPLETED" &&
    booking.payment?.status === "PAID" &&
    !booking.review;
  const isWorking = cancelling || checkingOut;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<Link href="/customer/bookings" />}
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
            <InfoItem icon={User} label="Problem type">
              {booking.service.category}
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
            <CardTitle>Technician</CardTitle>
            <CardDescription>Who will perform this service</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5">
            <InfoItem icon={User} label="Name">
              {booking.technician.user.name}
            </InfoItem>
            <InfoItem icon={Mail} label="Specialization">
              {booking.technician.specialization}
            </InfoItem>
            <InfoItem icon={Phone} label="Contact">
              {booking.technician.user.phone ?? booking.technician.user.email}
            </InfoItem>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
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
                <span className="font-mono text-xs text-muted-foreground">
                  {booking.payment.transactionId ?? "No transaction id"}
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
                {canPay
                  ? "Complete the payment to confirm your booking."
                  : "Payment has not been initiated yet."}
              </p>
            )}
          </CardContent>
        </Card>

        {booking.review && (
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Your review</CardTitle>
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
                {booking.review.comment ?? "No comment provided."}
              </p>
            </CardContent>
          </Card>
        )}

        {canReview && (
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Leave a review</CardTitle>
              <CardDescription>
                Share how this service went. Your rating also helps other
                customers.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                className="max-w-lg space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  reviewForm.handleSubmit();
                }}
              >
                <reviewForm.Field name="rating">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel>Rating</FieldLabel>
                        <StarPicker
                          value={field.state.value}
                          onChange={field.handleChange}
                          onBlur={field.handleBlur}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </reviewForm.Field>

                <reviewForm.Field name="comment">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          Comment (optional)
                        </FieldLabel>
                        <Textarea
                          id={field.name}
                          name={field.name}
                          placeholder="What went well? Anything the technician should know?"
                          maxLength={MAX_REVIEW_COMMENT_LENGTH}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </reviewForm.Field>

                <Button type="submit" disabled={submittingReview}>
                  {submittingReview ? <Spinner /> : "Submit review"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {booking.status === "COMPLETED" && !booking.review && !canReview && (
          <Card className="lg:col-span-3">
            <CardContent className="pt-6 text-sm text-muted-foreground">
              You can leave a review once the payment for this booking is
              confirmed.
            </CardContent>
          </Card>
        )}
      </div>

      {(canCancel || canPay) && (
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
            <CardDescription>
              Manage this booking while it is still active.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-3">
            {confirmingCancel ? (
              <>
                <span className="text-sm text-muted-foreground">
                  Cancel this booking? The time slot will be freed.
                </span>
                <Button
                  type="button"
                  variant="destructive"
                  disabled={isWorking}
                  onClick={handleCancel}
                >
                  {cancelling ? <Spinner /> : "Yes, cancel"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isWorking}
                  onClick={() => setConfirmingCancel(false)}
                >
                  Keep it
                </Button>
              </>
            ) : (
              <>
                {canPay && (
                  <Button
                    type="button"
                    disabled={isWorking}
                    onClick={handleCheckout}
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
                    onClick={() => setConfirmingCancel(true)}
                  >
                    Cancel booking
                  </Button>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
