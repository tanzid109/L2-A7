"use client";

import { CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { type DateOption, formatDateKey } from "@/utils";

interface Props {
  dates: DateOption[];
  value: string;
  onSelect: (dateKey: string) => void;
  isPending?: boolean;
}

export default function DateSelector({
  dates,
  value,
  onSelect,
  isPending = false,
}: Props) {
  if (isPending) {
    return (
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-16 w-32" />
        ))}
      </div>
    );
  }

  if (dates.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed p-6 text-center">
        <CalendarDays className="size-6 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          No available dates for this technician.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {dates.map((date) => {
        const isSelected = date.key === value;
        const [year, month, day] = date.key.split("-");
        const weekday = formatDateKey(date.key).split(",")[0];

        return (
          <button
            key={date.key}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onSelect(date.key)}
            className={cn(
              "flex flex-col items-center gap-0.5 rounded-lg border px-4 py-2 text-center transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
              isSelected
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background hover:bg-muted",
            )}
          >
            <span className="text-xs uppercase">{weekday}</span>
            <span className="text-lg font-semibold leading-tight">
              {Number(day)}
            </span>
            <span className="text-xs">
              {month}/{year?.slice(2)}
            </span>
            <Badge
              variant={isSelected ? "secondary" : "outline"}
              className="mt-0.5"
            >
              {date.slots.length} slot{date.slots.length > 1 ? "s" : ""}
            </Badge>
          </button>
        );
      })}
    </div>
  );
}
