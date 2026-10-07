"use client";

import { Check, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetTechnicians } from "@/hooks";
import { cn } from "@/lib/utils";

interface Props {
  value: string;
  onSelect: (technicianId: string) => void;
  category?: string;
}

function matchesCategory(specialization: string, category?: string) {
  if (!category) return true;

  const tokens = (value: string) =>
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .split(" ")
      .filter(
        (token) =>
          token.length > 1 && !["and", "of", "the", "amp"].includes(token),
      );

  const categoryTokens = tokens(category);
  const specTokens = tokens(specialization);

  return categoryTokens.some((token) => specTokens.includes(token));
}

export default function TechnicianSelector({
  value,
  onSelect,
  category,
}: Props) {
  const { data, isPending, isError } = useGetTechnicians({ limit: 100 });

  if (isPending) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-56 w-full" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-sm text-destructive">Could not load technicians</p>
    );
  }

  const technicians = (data?.data.data ?? []).filter((technician) =>
    matchesCategory(technician.specialization, category),
  );

  if (technicians.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        {category
          ? `No technicians available for ${category} right now. Please try another service.`
          : "No technicians are available right now. Please try again later."}
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {technicians.map((technician) => {
        const isSelected = technician.id === value;
        const isUnavailable = !technician.isAvailable;
        const initials = technician.user.name
          .split(" ")
          .map((part) => part[0])
          .slice(0, 2)
          .join("")
          .toUpperCase();

        return (
          <button
            key={technician.id}
            type="button"
            aria-pressed={isSelected}
            disabled={isUnavailable}
            onClick={() => onSelect(technician.id)}
            className="text-left focus:outline-none disabled:cursor-not-allowed"
          >
            <Card
              className={cn(
                "transition-all hover:border-primary/50 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
                isSelected && "border-primary ring-2 ring-primary/20",
                isUnavailable && "opacity-60",
              )}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                      {technician.user.avatar ? (
                        // biome-ignore lint/performance/noImgElement: avatar thumbnail
                        <img
                          src={technician.user.avatar}
                          alt={technician.user.name}
                          className="size-full rounded-full object-cover"
                        />
                      ) : (
                        initials
                      )}
                    </span>
                    <div>
                      <CardTitle className="line-clamp-1">
                        {technician.user.name}
                      </CardTitle>
                      <CardDescription className="line-clamp-1">
                        {technician.specialization}
                      </CardDescription>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="size-4" />
                    </span>
                  )}
                </div>
              </CardHeader>

              <CardContent className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Star className="size-4 fill-current text-amber-500" />
                    {Number(technician.rating).toFixed(1)}
                    <span className="text-xs">({technician.totalReviews})</span>
                  </span>
                  <span>{technician.experience} yrs experience</span>
                </div>

                {technician.bio && (
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {technician.bio}
                  </p>
                )}

                <div className="flex items-center justify-between gap-2">
                  <Badge
                    variant={technician.isAvailable ? "outline" : "secondary"}
                  >
                    {technician.isAvailable ? "Available" : "Unavailable"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </button>
        );
      })}
    </div>
  );
}
