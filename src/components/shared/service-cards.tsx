"use client";

import { Clock, SearchX } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllServices } from "@/hooks";
import type { ServiceParams } from "@/types";

export default function ServiceCards(params: ServiceParams) {
  const { data, isPending, isError } = useGetAllServices(params);

  if (isPending) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-80 w-full" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <p className="text-sm text-destructive">Could not load services</p>;
  }

  const services = data.data.data;

  if (services.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed p-10 text-center">
        <SearchX className="size-8 text-muted-foreground/50" />
        <p className="text-sm font-medium">No services found</p>
        <p className="text-sm text-muted-foreground">
          Try a different search or category.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <Card
          key={service.id}
          className="group overflow-hidden pt-0 transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-md"
        >
          <div className="relative aspect-video w-full overflow-hidden bg-muted">
            {service.imageUrl && (
              // biome-ignore lint/performance/noImgElement: simple card image
              <img
                src={service.imageUrl}
                alt={service.title}
                className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            )}
            <Badge variant="outline" className="absolute right-3 top-3">
              Service
            </Badge>
          </div>

          <CardHeader>
            <Badge variant="outline" className="w-fit">
              {service.category}
            </Badge>
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

          {service.isActive && (
            <CardFooter>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                nativeButton={false}
                render={
                  <Link href={`/customer/book?serviceId=${service.id}`} />
                }
              >
                Book now
              </Button>
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  );
}
