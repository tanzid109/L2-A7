"use client";

import { RefreshCw, Star } from "lucide-react";
import Link from "next/link";
import Reveal from "@/components/shared/reveal";
import SectionHeading from "@/components/shared/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetTechnicians } from "@/hooks";

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export default function FeaturedTechnicians() {
  const { data, isPending, isError, isFetching, refetch } = useGetTechnicians({
    limit: 6,
  });

  const technicians = data?.data.data ?? [];

  return (
    <section className="border-t bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <SectionHeading
          eyebrow="Our Professionals"
          title="Meet Our Professionals"
          description="Experienced, reviewed technicians ready to take on your next job."
        />

        <div className="mt-12">
          {isPending ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-64 w-full" />
              ))}
            </div>
          ) : isError ? (
            <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-lg border border-destructive/40 bg-destructive/5 p-8 text-center">
              <p className="text-sm font-semibold text-destructive">
                Could not load professionals
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                disabled={isFetching}
              >
                <RefreshCw />
                Retry
              </Button>
            </div>
          ) : technicians.length === 0 ? (
            <div className="mx-auto flex max-w-md flex-col items-center gap-2 rounded-lg border border-dashed p-10 text-center">
              <p className="text-sm font-medium">
                No professionals to show yet
              </p>
              <p className="text-sm text-muted-foreground">
                New technicians are joining regularly — check back soon.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {technicians.map((technician) => (
                <Card
                  key={technician.id}
                  className="transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-md"
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                        {technician.user.avatar ? (
                          // biome-ignore lint/performance/noImgElement: avatar from API
                          <img
                            src={technician.user.avatar}
                            alt={technician.user.name}
                            className="size-full rounded-full object-cover"
                          />
                        ) : (
                          getInitials(technician.user.name)
                        )}
                      </span>
                      <div className="min-w-0">
                        <CardTitle className="line-clamp-1">
                          {technician.user.name}
                        </CardTitle>
                        <CardDescription className="line-clamp-1">
                          {technician.specialization}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="flex flex-col gap-3">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Star className="size-4 fill-current text-amber-500" />
                        {Number(technician.rating).toFixed(1)}
                        <span className="text-xs">
                          ({technician.totalReviews} reviews)
                        </span>
                      </span>
                      <span>{technician.experience} yrs experience</span>
                    </div>

                    {technician.bio && (
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {technician.bio}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Badge
                        variant={
                          technician.isAvailable ? "outline" : "secondary"
                        }
                      >
                        {technician.isAvailable ? "Available" : "Unavailable"}
                      </Badge>
                      <span className="text-sm font-semibold">
                        {Number(technician.hourlyRate).toLocaleString()} BDT/hr
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <Reveal className="mt-10 flex justify-center">
          <Button
            variant="outline"
            size="lg"
            className="px-5"
            nativeButton={false}
            render={<Link href="/technicians" />}
          >
            View All Technicians
            <Star />
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
