"use client";

import { useState } from "react";
import { PaymentStatusBadge } from "@/components/shared/booking-badges";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetMyPayments } from "@/hooks";
import type { PaymentStatus } from "@/types";
import { getErrorMessage } from "@/utils";

type StatusFilter = "ALL" | PaymentStatus;

const STATUS_TABS: { value: StatusFilter; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "PAID", label: "Paid" },
  { value: "FAILED", label: "Failed" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "REFUNDED", label: "Refunded" },
];

const PAGE_LIMIT = 10;

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export default function CustomerPayments() {
  const [status, setStatus] = useState<StatusFilter>("ALL");
  const [page, setPage] = useState(1);

  const { data, isPending, isError, error, refetch, isFetching } =
    useGetMyPayments({
      page,
      limit: PAGE_LIMIT,
      ...(status === "ALL" ? {} : { status }),
    });

  const payments = data?.data.data ?? [];
  const meta = data?.data.meta;

  const handleStatusChange = (value: string) => {
    setStatus(value as StatusFilter);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Payment History</h1>
        <p className="text-sm text-muted-foreground">
          Every payment you have made for your bookings.
        </p>
      </div>

      <Tabs value={status} onValueChange={handleStatusChange}>
        <TabsList className="max-w-full overflow-x-auto">
          {STATUS_TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {isPending ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/5 p-5 text-sm">
          <p className="font-semibold text-destructive">
            Could not load payments
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
      ) : payments.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed p-10 text-center">
          <p className="text-sm font-medium">No payments found</p>
          <p className="text-sm text-muted-foreground">
            {status === "ALL"
              ? "You have not made any payments yet."
              : "No payments with this status."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Technician</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Transaction</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="min-w-44">
                    <p className="truncate font-medium">
                      {payment.booking.service.title}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {payment.booking.service.category}
                    </p>
                  </TableCell>
                  <TableCell className="min-w-40">
                    <p className="truncate font-medium">
                      {payment.booking.technician?.user.name ?? "—"}
                    </p>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {Number(payment.amount).toLocaleString()} BDT
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {payment.method}
                  </TableCell>
                  <TableCell className="min-w-48">
                    <span className="block max-w-56 truncate font-mono text-xs">
                      {payment.transactionId ?? "—"}
                    </span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                    {formatDate(payment.paidAt ?? payment.createdAt)}
                  </TableCell>
                  <TableCell>
                    <PaymentStatusBadge status={payment.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

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
