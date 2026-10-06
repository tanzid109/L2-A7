"use client";

import { Star } from "lucide-react";
import { useState } from "react";
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
import { useGetMyTechnicianProfile, useGetTechnicianReviews } from "@/hooks";
import { getErrorMessage } from "@/utils";

const PAGE_LIMIT = 10;

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => i + 1).map((star) => (
        <Star
          key={star}
          className={
            star <= rating
              ? "size-4 fill-amber-400 text-amber-400"
              : "size-4 text-muted-foreground"
          }
        />
      ))}
    </div>
  );
}

export default function TechnicianReviews() {
  const [page, setPage] = useState(1);

  const {
    data: profileData,
    isPending: profilePending,
    isError: profileError,
    error: profileErrorData,
    refetch: refetchProfile,
    isFetching: profileFetching,
  } = useGetMyTechnicianProfile();

  const profileId = profileData?.data.id ?? "";

  const { data, isPending, isError, error, refetch, isFetching } =
    useGetTechnicianReviews(profileId, { page, limit: PAGE_LIMIT });

  if (profilePending) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-32 w-full" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="flex flex-col items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/5 p-5 text-sm">
        <p className="font-semibold text-destructive">
          Could not load your profile
        </p>
        <p className="text-muted-foreground">
          {getErrorMessage(profileErrorData)}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetchProfile()}
          disabled={profileFetching}
        >
          {profileFetching ? <Spinner /> : "Retry"}
        </Button>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-32 w-full" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/5 p-5 text-sm">
        <p className="font-semibold text-destructive">Could not load reviews</p>
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

  const profile = profileData.data;
  const reviews = data?.data.data ?? [];
  const meta = data?.data.meta;
  const avgRating = Number(profile.rating);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reviews</h1>
        <p className="text-sm text-muted-foreground">
          What customers say about your work.
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-wrap items-center gap-6">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold tracking-tight">
              {avgRating.toFixed(1)}
            </span>
            <span className="text-sm text-muted-foreground">/ 5</span>
          </div>
          <div className="flex flex-col gap-1">
            <StarRow rating={Math.round(avgRating)} />
            <span className="text-sm text-muted-foreground">
              Based on {profile.totalReviews} review
              {profile.totalReviews === 1 ? "" : "s"}
            </span>
          </div>
        </CardContent>
      </Card>

      {reviews.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed p-10 text-center">
          <p className="text-sm font-medium">No reviews yet</p>
          <p className="text-sm text-muted-foreground">
            Reviews appear here once customers rate your completed bookings.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <CardTitle className="text-base">
                      {review.customer.name}
                    </CardTitle>
                    <CardDescription>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <StarRow rating={review.rating} />
                </div>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                  {review.comment ?? "No comment provided."}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={page <= 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {meta.page} of {meta.totalPages}
          </span>
          <Button
            type="button"
            variant="outline"
            disabled={page >= meta.totalPages}
            onClick={() =>
              setPage((current) => Math.min(meta.totalPages, current + 1))
            }
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
