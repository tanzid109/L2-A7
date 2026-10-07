"use client";

import { useQueries } from "@tanstack/react-query";
import { Quote, Star } from "lucide-react";
import { useMemo } from "react";
import { getTechnicianReviews } from "@/api";
import Reveal from "@/components/shared/reveal";
import SectionHeading from "@/components/shared/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetTechnicians } from "@/hooks";
import type { TechnicianReview } from "@/types";

function Stars({ rating }: { rating: number }) {
  return (
    <span
      role="img"
      className="flex items-center gap-0.5"
      aria-label={`${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={
            star <= rating
              ? "size-4 fill-current text-amber-500"
              : "size-4 text-border"
          }
        />
      ))}
    </span>
  );
}

export default function Testimonials() {
  const { data: techniciansData, isPending } = useGetTechnicians({ limit: 6 });

  const technicianIds = useMemo(
    () => (techniciansData?.data.data ?? []).slice(0, 3).map((t) => t.id),
    [techniciansData],
  );

  const reviewQueries = useQueries({
    queries: technicianIds.map((id) => ({
      queryKey: ["technician-reviews", id, { limit: 5 }],
      queryFn: () => getTechnicianReviews(id, { limit: 5 }),
    })),
  });

  const reviewsPending =
    technicianIds.length > 0 && reviewQueries.some((query) => query.isPending);

  const allReviews = reviewQueries.flatMap(
    (query) => query.data?.data.data ?? [],
  );
  const seen = new Set<string>();
  const testimonials = allReviews
    .filter((review: TechnicianReview) => {
      const key = `${review.customer.name}:${review.comment ?? ""}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort(
      (a, b) =>
        b.rating - a.rating ||
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 6);

  if (isPending || reviewsPending) {
    return (
      <section>
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <SectionHeading
            eyebrow="Testimonials"
            title="What Our Customers Say"
            description="Real feedback from customers after their bookings."
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-52 w-full" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) return null;

  return (
    <section aria-label="Customer testimonials">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <SectionHeading
          eyebrow="Testimonials"
          title="What Our Customers Say"
          description="Real feedback from customers after their bookings."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((review) => (
            <Reveal key={review.id}>
              <Card className="h-full transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-md">
                <CardContent className="flex h-full flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <Stars rating={review.rating} />
                    <Quote className="size-5 text-primary/30" />
                  </div>
                  {review.comment && (
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      “{review.comment}”
                    </p>
                  )}
                  <div className="mt-auto flex items-center gap-3 border-t pt-4">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {review.customer.name
                        .split(" ")
                        .map((part) => part[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        {review.customer.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        FieldOps customer
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
