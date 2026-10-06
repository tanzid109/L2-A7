"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useSuspenseGetAdminAnalytics } from "@/hooks/admin.hook";
import {
    CalendarCheck,
    DollarSign,
    Users,
    Wrench,
    type LucideIcon,
} from "lucide-react";

const CURRENCY = "USD";

const formatMoney = (value: number) =>
    new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: CURRENCY,
        maximumFractionDigits: 0,
    }).format(value);

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
                    {value} <span className="text-xs text-muted-foreground">({pct}%)</span>
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

export default function AdminOverview() {
    const { data } = useSuspenseGetAdminAnalytics();
    const s = data.data;

    const netRevenue = s.totalRevenue - s.totalRefunded;
    const otherBookings =
        s.totalBookings -
        s.totalPendingBookings -
        s.totalCompletedBookings -
        s.totalCancelledBookings;
    const inactiveServices = s.totalServices - s.totalActiveServices;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
                <p className="text-sm text-muted-foreground">
                    Platform activity at a glance.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="Net Revenue"
                    value={formatMoney(netRevenue)}
                    hint={`${formatMoney(s.totalRevenue)} gross`}
                    icon={DollarSign}
                    accent="bg-emerald-500"
                />
                <StatCard
                    title="Total Bookings"
                    value={s.totalBookings}
                    hint={`${s.totalPendingBookings} pending`}
                    icon={CalendarCheck}
                    accent="bg-blue-500"
                />
                <StatCard
                    title="Technicians"
                    value={s.totalTechnicians}
                    hint="Registered on the platform"
                    icon={Wrench}
                    accent="bg-amber-500"
                />
                <StatCard
                    title="Customers"
                    value={s.totalCustomers}
                    hint="Registered on the platform"
                    icon={Users}
                    accent="bg-violet-500"
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
                            label="Pending"
                            value={s.totalPendingBookings}
                            total={s.totalBookings}
                            color="bg-amber-500"
                        />
                        <BreakdownRow
                            label="Completed"
                            value={s.totalCompletedBookings}
                            total={s.totalBookings}
                            color="bg-emerald-500"
                        />
                        <BreakdownRow
                            label="Cancelled"
                            value={s.totalCancelledBookings}
                            total={s.totalBookings}
                            color="bg-red-500"
                        />
                        {otherBookings > 0 && (
                            <BreakdownRow
                                label="Other (confirmed / in progress)"
                                value={otherBookings}
                                total={s.totalBookings}
                                color="bg-blue-500"
                            />
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Revenue</CardTitle>
                        <CardDescription>Gross vs refunded</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Gross</span>
                            <span className="font-medium">{formatMoney(s.totalRevenue)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Refunded</span>
                            <span className="font-medium text-red-500">
                                -{formatMoney(s.totalRefunded)}
                            </span>
                        </div>
                        <div className="flex justify-between border-t pt-3">
                            <span className="font-medium">Net</span>
                            <span className="text-lg font-bold">{formatMoney(netRevenue)}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Refund rate: {percent(s.totalRefunded, s.totalRevenue)}%
                        </p>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Services</CardTitle>
                        <CardDescription>
                            {s.totalActiveServices} of {s.totalServices} active
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <BreakdownRow
                            label="Active"
                            value={s.totalActiveServices}
                            total={s.totalServices}
                            color="bg-emerald-500"
                        />
                        <BreakdownRow
                            label="Inactive"
                            value={inactiveServices}
                            total={s.totalServices}
                            color="bg-muted-foreground"
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}