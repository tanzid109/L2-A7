"use client";

import { Clock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  BookingStatusBadge,
  PaymentStatusBadge,
} from "@/components/shared/booking-badges";
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
import TablePagination from "@/components/ui/table-pagination";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetMyTechnicianBookings } from "@/hooks";
import type { BookingStatus } from "@/types";
import { formatDateKey, getErrorMessage, getSlotDateKey } from "@/utils";

type StatusFilter = "ALL" | BookingStatus;

const STATUS_TABS: { value: StatusFilter; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "ACCEPTED", label: "Accepted" },
  { value: "IN_PROGRESS", label: "In progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "REJECTED", label: "Rejected" },
  { value: "CANCELLED", label: "Cancelled" },
];

const PAGE_LIMIT = 10;

export default function TechnicianBookings() {
  const [status, setStatus] = useState<StatusFilter>("ALL");
  const [page, setPage] = useState(1);

  const { data, isPending, isError, error, refetch, isFetching } =
    useGetMyTechnicianBookings({
      page,
      limit: PAGE_LIMIT,
      ...(status === "ALL" ? {} : { status }),
    });

  const bookings = data?.data.data ?? [];
  const meta = data?.data.meta;

  const handleStatusChange = (value: string) => {
    setStatus(value as StatusFilter);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Bookings</h1>
        <p className="text-sm text-muted-foreground">
          Booking requests assigned to you by customers.
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
            Could not load bookings
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
      ) : bookings.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed p-10 text-center">
          <p className="text-sm font-medium">No bookings found</p>
          <p className="text-sm text-muted-foreground">
            {status === "ALL"
              ? "You have not received any bookings yet."
              : "No bookings with this status."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="min-w-40">
                    <p className="truncate font-medium">
                      {booking.service.title}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {booking.service.category}
                    </p>
                  </TableCell>
                  <TableCell className="min-w-44">
                    <p className="truncate font-medium">
                      {booking.customer.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {booking.customer.phone ?? booking.customer.email}
                    </p>
                  </TableCell>
                  <TableCell className="min-w-44">
                    <p className="whitespace-nowrap text-sm">
                      {formatDateKey(getSlotDateKey(booking.availability.date))}
                    </p>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="size-3" />
                      {booking.availability.startTime} –{" "}
                      {booking.availability.endTime}
                    </p>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {Number(booking.totalAmount).toLocaleString()} BDT
                  </TableCell>
                  <TableCell>
                    {booking.payment ? (
                      <PaymentStatusBadge status={booking.payment.status} />
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        Not initiated
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <BookingStatusBadge status={booking.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      nativeButton={false}
                      render={
                        <Link href={`/technician/bookings/${booking.id}`} />
                      }
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <TablePagination
        page={page}
        totalPages={meta?.totalPages ?? 1}
        handlePageChange={setPage}
      />
    </div>
  );
}
