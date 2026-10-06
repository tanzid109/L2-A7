import type { BookingStatus, PaymentStatus } from "@/types";

const BOOKING_STATUS_STYLES: Record<BookingStatus, string> = {
  PENDING: "bg-amber-500/10 text-amber-600",
  ACCEPTED: "bg-blue-500/10 text-blue-600",
  IN_PROGRESS: "bg-violet-500/10 text-violet-600",
  COMPLETED: "bg-emerald-500/10 text-emerald-600",
  REJECTED: "bg-destructive/10 text-destructive",
  CANCELLED: "bg-muted text-muted-foreground",
};

const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  PENDING: "Pending",
  ACCEPTED: "Accepted",
  IN_PROGRESS: "In progress",
  COMPLETED: "Completed",
  REJECTED: "Rejected",
  CANCELLED: "Cancelled",
};

const PAYMENT_STATUS_STYLES: Record<PaymentStatus, string> = {
  PENDING: "bg-amber-500/10 text-amber-600",
  PAID: "bg-emerald-500/10 text-emerald-600",
  FAILED: "bg-destructive/10 text-destructive",
  CANCELLED: "bg-muted text-muted-foreground",
  REFUNDED: "bg-blue-500/10 text-blue-600",
};

const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  PENDING: "Awaiting payment",
  PAID: "Paid",
  FAILED: "Failed",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
};

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span
      className={`inline-flex w-fit shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-semibold ${BOOKING_STATUS_STYLES[status]}`}
    >
      {BOOKING_STATUS_LABELS[status]}
    </span>
  );
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <span
      className={`inline-flex w-fit shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-semibold ${PAYMENT_STATUS_STYLES[status]}`}
    >
      {PAYMENT_STATUS_LABELS[status]}
    </span>
  );
}
