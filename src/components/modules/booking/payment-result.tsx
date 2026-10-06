"use client";

import { CircleAlertIcon, CircleCheckIcon, InfoIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useGetMyPayments } from "@/hooks";
import type { PaymentWithBooking } from "@/types";

interface Props {
  mode: "success" | "cancel";
  sessionId?: string;
  bookingId?: string;
}

function findPaymentBySessionId(
  payments: PaymentWithBooking[],
  sessionId: string,
) {
  return payments.find((payment) => {
    const gateway = payment.gatewayResponse;

    return (
      payment.transactionId === sessionId ||
      (gateway && gateway.checkoutSessionId === sessionId) ||
      (gateway && gateway.id === sessionId)
    );
  });
}

function PaymentActions() {
  return (
    <CardFooter className="flex flex-col gap-2 sm:flex-row">
      <Button render={<Link href="/customer/bookings" />}>
        View my bookings
      </Button>
      <Button variant="outline" render={<Link href="/" />}>
        Back to home
      </Button>
    </CardFooter>
  );
}

function PaymentSuccess({ sessionId }: { sessionId?: string }) {
  const { data, isPending, isError } = useGetMyPayments({ limit: 100 });

  if (isPending) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Confirming your payment</CardTitle>
          <CardDescription>
            We are checking the latest status with our payment provider.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-3 text-sm text-muted-foreground">
          <Spinner />
          This only takes a moment.
        </CardContent>
      </Card>
    );
  }

  const payment = sessionId
    ? findPaymentBySessionId(data?.data.data ?? [], sessionId)
    : undefined;

  if (!payment && (isError || !data)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment submitted</CardTitle>
          <CardDescription>
            We could not verify the status right now. Your payment status will
            be updated shortly.
          </CardDescription>
        </CardHeader>
        <PaymentActions />
      </Card>
    );
  }

  if (!payment) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment submitted</CardTitle>
          <CardDescription>
            We are confirming your payment with Stripe. It can take a few
            seconds for the status to update.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-3 text-sm text-muted-foreground">
          <Spinner />
          Check My Bookings for the final status.
        </CardContent>
        <PaymentActions />
      </Card>
    );
  }

  if (payment.status === "PAID") {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
              <CircleCheckIcon className="size-5" />
            </span>
            <div>
              <CardTitle>Payment confirmed</CardTitle>
              <CardDescription>
                Your payment for this booking has been received.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Amount: {payment.amount} USD · Reference:{" "}
          {payment.transactionId ?? payment.id}
        </CardContent>
        <PaymentActions />
      </Card>
    );
  }

  if (payment.status === "FAILED") {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center bg-destructive/10 text-destructive">
              <CircleAlertIcon className="size-5" />
            </span>
            <div>
              <CardTitle>Payment failed</CardTitle>
              <CardDescription>
                Your payment could not be completed. You can try again from My
                Bookings.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <PaymentActions />
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center bg-blue-500/10 text-blue-600">
            <InfoIcon className="size-5" />
          </span>
          <div>
            <CardTitle>Payment received</CardTitle>
            <CardDescription>
              Your payment is being confirmed by our payment provider. The
              status will update in My Bookings shortly.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Amount: {payment.amount} USD
      </CardContent>
      <PaymentActions />
    </Card>
  );
}

function PaymentCancelled({ bookingId }: { bookingId?: string }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center bg-muted text-muted-foreground">
            <CircleAlertIcon className="size-5" />
          </span>
          <div>
            <CardTitle>Payment cancelled</CardTitle>
            <CardDescription>
              You were not charged. Your booking status has not changed.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      {bookingId && (
        <CardContent className="text-sm text-muted-foreground">
          Booking reference: {bookingId.slice(0, 8)}
        </CardContent>
      )}
      <PaymentActions />
    </Card>
  );
}

export default function PaymentResult({ mode, sessionId, bookingId }: Props) {
  if (mode === "cancel") {
    return <PaymentCancelled bookingId={bookingId} />;
  }

  return <PaymentSuccess sessionId={sessionId} />;
}
