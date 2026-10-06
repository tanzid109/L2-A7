"use client";

import {
  Ban,
  Banknote,
  CalendarCheck,
  CircleCheckBig,
  Clock,
  CreditCard,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { BookingStatusBadge } from "@/components/shared/booking-badges";
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
import { useGetCustomerAnalytics, useGetMyBookings } from "@/hooks";
import { formatDateKey, getErrorMessage, getSlotDateKey } from "@/utils";
import CustomerOverviewLoading from "./customer-overview-loading";

const formatMoney = (value: number) =>
  `${value.toLocaleString(undefined, { maximumFractionDigits: 0 })} BDT`;

const percent = (part: number, total: number) =>
  total > 0 ? Math.round((part / total) * 100) : 0;

function StatCard({
  title,
  value,
  hint,
  icon: Icon,
  accent,
}: {
  title: string;
  value: string | number;
  hint: string;
  icon: LucideIcon;
  accent: string;
}) {
  return (
    <Card className="relative overflow-hidden">
      <div className={`absolute inset-x-0 top-0 h-1 ${accent}`} />
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardDescription className="text-sm font-medium">
          {title}
        </CardDescription>
        <div className={`rounded-lg p-2 ${accent} bg-opacity-10`}>
          <Icon className="size-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold tracking-tight">{value}</div>
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}

function BreakdownRow({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  const pct = percent(value, total);
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">
          {value}{" "}
          <span className="text-xs text-muted-foreground">({pct}%)</span>
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function CustomerOverview() {
  const { data, isPending, isError, error, refetch, isFetching } =
    useGetCustomerAnalytics();
  const {
    data: recentData,
    isPending: recentPending,
    isError: recentError,
    refetch: refetchRecent,
  } = useGetMyBookings({ page: 1, limit: 5 });

  if (isPending) return <CustomerOverviewLoading />;

  if (isError) {
    return (
      <div className="flex flex-col items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/5 p-5 text-sm">
        <p className="font-semibold text-destructive">
          Could not load your dashboard
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

  const s = data.data;
  const recentBookings = recentData?.data.data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground">
          Your bookings, payments and spending at a glance.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Total Bookings"
          value={s.totalBookings}
          hint="All time bookings"
          icon={CalendarCheck}
          accent="bg-blue-500"
        />
        <StatCard
          title="Upcoming"
          value={s.upcomingBookings}
          hint="Pending & accepted"
          icon={Clock}
          accent="bg-amber-500"
        />
        <StatCard
          title="Completed"
          value={s.completedBookings}
          hint="Jobs finished"
          icon={CircleCheckBig}
          accent="bg-emerald-500"
        />
        <StatCard
          title="Cancelled"
          value={s.cancelledBookings}
          hint="Cancelled or rejected"
          icon={Ban}
          accent="bg-red-500"
        />
        <StatCard
          title="Total Spent"
          value={formatMoney(s.totalAmountSpent)}
          hint="Confirmed payments"
          icon={Banknote}
          accent="bg-emerald-500"
        />
        <StatCard
          title="Refunded"
          value={formatMoney(s.totalRefunded)}
          hint="Refunded payments"
          icon={CreditCard}
          accent="bg-sky-500"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Bookings</CardTitle>
            <CardDescription>Status breakdown</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <BreakdownRow
              label="Upcoming (pending & accepted)"
              value={s.upcomingBookings}
              total={s.totalBookings}
              color="bg-amber-500"
            />
            <BreakdownRow
              label="Completed"
              value={s.completedBookings}
              total={s.totalBookings}
              color="bg-emerald-500"
            />
            <BreakdownRow
              label="Cancelled / rejected"
              value={s.cancelledBookings}
              total={s.totalBookings}
              color="bg-red-500"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
            <CardDescription>Get things done faster</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button
              nativeButton={false}
              render={<Link href="/customer/book" />}
            >
              Book a service
            </Button>
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link href="/customer/bookings" />}
            >
              View my bookings
            </Button>
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link href="/customer/payments" />}
            >
              Payment history
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent bookings</CardTitle>
              <CardDescription>Your latest 5 requests</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              nativeButton={false}
              render={<Link href="/customer/bookings" />}
            >
              View all
            </Button>
          </CardHeader>
          <CardContent>
            {recentPending ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : recentError ? (
              <div className="flex items-center justify-between gap-3 text-sm">
                <p className="text-destructive">
                  Could not load recent bookings.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetchRecent()}
                >
                  Retry
                </Button>
              </div>
            ) : recentBookings.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No bookings yet. Browse the services and book your first one.
              </p>
            ) : (
              <div className="divide-y">
                {recentBookings.map((booking) => (
                  <Link
                    key={booking.id}
                    href={`/customer/bookings/${booking.id}`}
                    className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm transition-colors hover:bg-muted/50"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {booking.service.title}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {booking.technician.user.name} ·{" "}
                        {formatDateKey(
                          getSlotDateKey(booking.availability.date),
                        )}{" "}
                        · {booking.availability.startTime} –{" "}
                        {booking.availability.endTime}
                      </p>
                    </div>
                    <BookingStatusBadge status={booking.status} />
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
