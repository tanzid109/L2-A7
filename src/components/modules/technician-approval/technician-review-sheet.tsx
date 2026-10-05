"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { useGetAllApplications, useReviewApplication } from "@/hooks";
import type {
  ApplicationParams,
  ReviewApplicationPayload,
  ReviewStatus,
} from "@/types";

interface Props extends ApplicationParams {
  selectedId: string;
  onClose: () => void;
}

export default function TechnicianReviewSheet({
  selectedId,
  onClose,
  ...params
}: Props) {
  const [confirmRejection, setConfirmRejection] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const { data } = useGetAllApplications(params);
  const { mutate: review, isPending } = useReviewApplication();
  const queryClient = useQueryClient();

  const selectedApplication = data?.data.find((app) => app.id === selectedId);

  const handleClose = () => {
    setConfirmRejection(false);
    setRejectionReason("");
    onClose();
  };

  const handleReviewAction = (status: ReviewStatus) => {
    const reviewData: ReviewApplicationPayload = {
      applicationId: selectedId,
      status,
      ...(status === "REJECTED" ? { rejectionReason } : {}),
    };

    review(reviewData, {
      onSuccess: (res) => {
        if (res.success) {
          toast.add({
            title: "Application reviewed",
            description: `Application ${status === "APPROVED" ? "approved" : "rejected"} successfully`,
            type: "success",
          });
        } else {
          toast.add({
            title: "Review failed",
            description:
              res.message || "Something went wrong. Please try again",
            type: "error",
          });
        }

        queryClient.invalidateQueries({
          queryKey: ["technician-applications"],
        });

        handleClose();
      },
      onError: (err) => {
        toast.add({
          title: "Review failed",
          description:
            (err as Error & { data?: { message?: string } }).data?.message ||
            err.message ||
            "Something went wrong. Please try again",
          type: "error",
        });
      },
    });
  };

  if (!selectedApplication) {
    return null;
  }

  const { user, resume, additionalFiles } = selectedApplication;

  return (
    <Sheet open={!!selectedId} onOpenChange={(open) => !open && handleClose()}>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Review application</SheetTitle>
          <SheetDescription>
            Review the details below and take an action.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-2 px-4 text-sm">
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Phone: {user.phone ?? "-"}</p>
          <p>Specialization: {selectedApplication.specialization}</p>
          <p>Experience: {selectedApplication.experience} yrs</p>
          <p>Hourly Rate: {selectedApplication.hourlyRate}</p>
          <p>Bio: {selectedApplication.bio}</p>
          <a
            href={resume}
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            Resume
          </a>
          {additionalFiles.map((file) => (
            <a
              key={file.publicId}
              href={file.url}
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              Additional file
            </a>
          ))}
          {selectedApplication.rejectionReason && (
            <p>Rejection reason: {selectedApplication.rejectionReason}</p>
          )}
        </div>

        {selectedApplication.status === "PENDING" && (
          <SheetFooter>
            {confirmRejection ? (
              <div className="flex flex-col gap-3">
                <Textarea
                  placeholder="Explain why the application is rejected"
                  value={rejectionReason}
                  onChange={(event) => setRejectionReason(event.target.value)}
                />

                <div className="flex gap-2">
                  <Button
                    onClick={() => setConfirmRejection(false)}
                    variant="outline"
                    size="lg"
                    className="flex-1"
                    disabled={isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleReviewAction("REJECTED")}
                    variant="destructive"
                    size="lg"
                    className="flex-1"
                    disabled={isPending || !rejectionReason.trim()}
                  >
                    {isPending ? <Spinner /> : "Confirm Rejection"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button
                  onClick={() => setConfirmRejection(true)}
                  variant="destructive"
                  size="lg"
                  className="flex-1"
                  disabled={isPending}
                >
                  Reject
                </Button>
                <Button
                  onClick={() => handleReviewAction("APPROVED")}
                  size="lg"
                  className="flex-1"
                  disabled={isPending}
                >
                  {isPending ? <Spinner /> : "Approve"}
                </Button>
              </div>
            )}
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
