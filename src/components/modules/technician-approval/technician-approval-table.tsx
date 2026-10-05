"use client";

import type { Dispatch, SetStateAction } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetAllApplications } from "@/hooks";
import type { ApplicationParams, ApplicationStatus } from "@/types";
import ApplicationApprovalTableLoading from "./application-approval-table-loading";

interface Props extends ApplicationParams {
  search?: string;
  handleReview: Dispatch<SetStateAction<string>>;
}

const statusVariant: Record<
  ApplicationStatus,
  "default" | "secondary" | "destructive"
> = {
  PENDING: "secondary",
  APPROVED: "default",
  REJECTED: "destructive",
};

function getErrorMessage(error: unknown) {
  return (
    (error as Error & { data?: { message?: string } })?.data?.message ||
    (error as Error)?.message ||
    "Something went wrong. Please try again"
  );
}

export default function ApplicationApprovalTable({
  search = "",
  handleReview,
  ...params
}: Props) {
  const { data, isPending, isError, error, refetch, isFetching } =
    useGetAllApplications(params);

  if (isPending) {
    return <ApplicationApprovalTableLoading />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/5 p-5 text-sm">
        <p className="font-semibold text-destructive">
          Could not load applications
        </p>
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

  const term = search.trim().toLowerCase();
  const applications = term
    ? data.data.filter(
        (app) =>
          app.user.name.toLowerCase().includes(term) ||
          app.user.email.toLowerCase().includes(term),
      )
    : data.data;

  if (applications.length === 0) {
    return (
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead colSpan={9}>
                {term
                  ? "No applications match your search"
                  : "No applications found"}
              </TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Specialization</TableHead>
            <TableHead>Experience</TableHead>
            <TableHead>Hourly Rate</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Applied</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((app) => (
            <TableRow key={app.id}>
              <TableCell>{app.user.name}</TableCell>
              <TableCell>{app.user.email}</TableCell>
              <TableCell>{app.user.phone ?? "-"}</TableCell>
              <TableCell>{app.specialization}</TableCell>
              <TableCell>{app.experience} yrs</TableCell>
              <TableCell>{app.hourlyRate}</TableCell>
              <TableCell>
                <Badge variant={statusVariant[app.status]}>{app.status}</Badge>
              </TableCell>
              <TableCell>
                {new Date(app.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleReview(app.id)}
                >
                  Review
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
