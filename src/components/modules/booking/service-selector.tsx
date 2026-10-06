"use client";

import { Check, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllServices } from "@/hooks";
import { cn } from "@/lib/utils";

interface Props {
  value: string;
  onSelect: (serviceId: string) => void;
}

export default function ServiceSelector({ value, onSelect }: Props) {
  const { data, isPending, isError } = useGetAllServices({
    isActive: true,
    limit: 100,
  });

  if (isPending) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-72 w-full" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <p className="text-sm text-destructive">Could not load services</p>;
  }

  const services = data?.data.data ?? [];

  if (services.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No services available right now. Please try again later.
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => {
        const isSelected = service.id === value;

        return (
          <button
            key={service.id}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onSelect(service.id)}
            className="text-left focus:outline-none"
          >
            <Card
              className={cn(
                "overflow-hidden pt-0 transition-all hover:border-primary/50 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
                isSelected && "border-primary ring-2 ring-primary/20",
              )}
            >
              <div className="relative aspect-video w-full bg-muted">
                {service.imageUrl && (
                  // biome-ignore lint/performance/noImgElement: simple card image
                  <img
                    src={service.imageUrl}
                    alt={service.title}
                    className="size-full object-cover"
                  />
                )}
                <Badge
                  variant="outline"
                  className="absolute left-3 top-3 bg-background/80 backdrop-blur"
                >
                  {service.category}
                </Badge>
                {isSelected && (
                  <span className="absolute right-3 top-3 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="size-4" />
                  </span>
                )}
              </div>

              <CardHeader>
                <CardTitle className="line-clamp-1">{service.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {service.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex items-center justify-between">
                <span className="text-lg font-bold">
                  {Number(service.price).toLocaleString()} BDT
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="size-4" />
                  {service.duration} min
                </span>
              </CardContent>
            </Card>
          </button>
        );
      })}
    </div>
  );
}
