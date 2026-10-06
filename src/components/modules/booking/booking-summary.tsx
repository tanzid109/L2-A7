"use client";

import { CalendarDays, Clock, User } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Availability, TechnicianProfile } from "@/types";
import type { Service } from "@/types/admin.type";
import { formatDateKey, getSlotDateKey } from "@/utils";

interface Props {
  service?: Service;
  technician?: TechnicianProfile;
  availability?: Availability;
}

function SummaryRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-muted-foreground">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium wrap-break-word">{value}</p>
      </div>
    </div>
  );
}

export default function BookingSummary({
  service,
  technician,
  availability,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking summary</CardTitle>
        <CardDescription>Review your booking before confirming</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <SummaryRow
          icon={<Clock className="size-4" />}
          label="Service"
          value={
            service
              ? `${service.title} (${service.category}, ${service.duration} min)`
              : "Not selected"
          }
        />

        <SummaryRow
          icon={<User className="size-4" />}
          label="Technician"
          value={
            technician
              ? `${technician.user.name} — ${technician.specialization}`
              : "Not selected"
          }
        />

        <Separator />

        <SummaryRow
          icon={<CalendarDays className="size-4" />}
          label="Date"
          value={
            availability
              ? formatDateKey(getSlotDateKey(availability.date))
              : "Not selected"
          }
        />

        <SummaryRow
          icon={<Clock className="size-4" />}
          label="Time"
          value={
            availability
              ? `${availability.startTime} – ${availability.endTime}`
              : "Not selected"
          }
        />

        <SummaryRow
          icon={<Clock className="size-4" />}
          label="Duration"
          value={service ? `${service.duration} min` : "—"}
        />

        <Separator />

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total price</span>
          <span className="text-lg font-bold">
            {service ? `${Number(service.price).toLocaleString()} BDT` : "—"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
