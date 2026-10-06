"use client";

import { Check, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Availability } from "@/types";

interface Props {
  slots: Availability[];
  value: string;
  onSelect: (availabilityId: string) => void;
  isPending?: boolean;
}

export default function TimeSlotSelector({
  slots,
  value,
  onSelect,
  isPending = false,
}: Props) {
  if (isPending) {
    return (
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed p-6 text-center">
        <Clock className="size-6 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          No available time slots on this date.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
      {slots.map((slot) => {
        const isSelected = slot.id === value;

        return (
          <button
            key={slot.id}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onSelect(slot.id)}
            className={cn(
              "flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
              isSelected
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background hover:bg-muted",
            )}
          >
            {isSelected && <Check className="size-4" />}
            {slot.startTime} – {slot.endTime}
          </button>
        );
      })}
    </div>
  );
}
