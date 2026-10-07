"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TablePagination from "@/components/ui/table-pagination";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/toast";
import {
  useCreateAvailability,
  useDeleteAvailability,
  useGetMyAvailability,
  useUpdateAvailability,
} from "@/hooks";
import type { Availability } from "@/types";
import { formatDateKey, getErrorMessage, getSlotDateKey } from "@/utils";
import AvailabilityForm from "./availability-form";

type SlotFilter = "ALL" | "AVAILABLE" | "BOOKED";

const FILTER_TABS: { value: SlotFilter; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "AVAILABLE", label: "Available" },
  { value: "BOOKED", label: "Booked" },
];

const PAGE_LIMIT = 10;

const toIsoDate = (dateKey: string) => `${dateKey}T00:00:00.000Z`;

export default function AvailabilityManager() {
  const [filter, setFilter] = useState<SlotFilter>("ALL");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Availability | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [createCount, setCreateCount] = useState(0);

  const { data, isPending, isError, error, refetch, isFetching } =
    useGetMyAvailability({
      page,
      limit: PAGE_LIMIT,
      ...(filter === "ALL" ? {} : { isBooked: filter === "BOOKED" }),
    });
  const { mutate: create, isPending: creating } = useCreateAvailability();
  const { mutate: update, isPending: updating } = useUpdateAvailability();
  const { mutate: remove, isPending: deleting } = useDeleteAvailability();

  const slots = data?.data.data ?? [];
  const meta = data?.data.meta;

  const handleFilterChange = (value: string) => {
    setFilter(value as SlotFilter);
    setPage(1);
  };

  const handleCreate = (values: {
    date: string;
    startTime: string;
    endTime: string;
  }) => {
    create(
      {
        date: toIsoDate(values.date),
        startTime: values.startTime,
        endTime: values.endTime,
      },
      {
        onSuccess: (res) => {
          toast.add({
            title: "Availability added",
            description: res.message,
            type: "success",
          });
          setCreateCount((count) => count + 1);
        },
        onError: (err) => {
          toast.add({
            title: "Could not add availability",
            description: getErrorMessage(err),
            type: "error",
          });
        },
      },
    );
  };

  const handleUpdate = (values: {
    date: string;
    startTime: string;
    endTime: string;
  }) => {
    if (!editing) return;

    update(
      {
        availabilityId: editing.id,
        payload: {
          date: toIsoDate(values.date),
          startTime: values.startTime,
          endTime: values.endTime,
        },
      },
      {
        onSuccess: (res) => {
          toast.add({
            title: "Availability updated",
            description: res.message,
            type: "success",
          });
          setEditing(null);
        },
        onError: (err) => {
          toast.add({
            title: "Could not update availability",
            description: getErrorMessage(err),
            type: "error",
          });
        },
      },
    );
  };

  const handleDelete = (availabilityId: string) => {
    remove(availabilityId, {
      onSuccess: (res) => {
        toast.add({
          title: "Availability removed",
          description: res.message,
          type: "success",
        });
        setDeletingId(null);
        if (slots.length === 1 && page > 1) {
          setPage((current) => Math.max(1, current - 1));
        }
      },
      onError: (err) => {
        toast.add({
          title: "Could not remove availability",
          description: getErrorMessage(err),
          type: "error",
        });
        setDeletingId(null);
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Availability</h1>
        <p className="text-sm text-muted-foreground">
          Manage the time slots customers can book with you.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add availability</CardTitle>
          <CardDescription>
            Pick a date and a start/end time. Overlapping or past slots are
            rejected by the server.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AvailabilityForm
            key={createCount}
            submitLabel="Add availability"
            isPending={creating}
            onSubmit={handleCreate}
          />
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Tabs value={filter} onValueChange={handleFilterChange}>
          <TabsList className="max-w-full overflow-x-auto">
            {FILTER_TABS.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {isPending ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/5 p-5 text-sm">
            <p className="font-semibold text-destructive">
              Could not load availability
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
        ) : slots.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed p-10 text-center">
            <p className="text-sm font-medium">No slots found</p>
            <p className="text-sm text-muted-foreground">
              {filter === "ALL"
                ? "You have not added any availability yet."
                : "No slots match this filter."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Start</TableHead>
                  <TableHead>End</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {slots.map((slot) => (
                  <TableRow key={slot.id}>
                    <TableCell className="whitespace-nowrap">
                      {formatDateKey(getSlotDateKey(slot.date))}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {slot.startTime}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {slot.endTime}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex w-fit shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                          slot.isBooked
                            ? "bg-blue-500/10 text-blue-600"
                            : "bg-emerald-500/10 text-emerald-600"
                        }`}
                      >
                        {slot.isBooked ? "Booked" : "Available"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {slot.isBooked ? (
                        <span className="block text-right text-xs text-muted-foreground">
                          Locked
                        </span>
                      ) : deletingId === slot.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-xs text-muted-foreground">
                            Remove?
                          </span>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            disabled={deleting}
                            onClick={() => handleDelete(slot.id)}
                          >
                            {deleting ? <Spinner /> : "Yes"}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={deleting}
                            onClick={() => setDeletingId(null)}
                          >
                            No
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setEditing(slot)}
                          >
                            <Pencil className="size-4" /> Edit
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setDeletingId(slot.id)}
                          >
                            <Trash2 className="size-4" /> Delete
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <TablePagination
          page={page}
          totalPages={meta?.totalPages ?? 1}
          handlePageChange={setPage}
        />
      </div>

      {editing && (
        <Sheet
          open
          onOpenChange={(open) => {
            if (!open) setEditing(null);
          }}
        >
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Edit availability</SheetTitle>
              <SheetDescription>
                Change the date or time of this slot. Booked slots cannot be
                edited.
              </SheetDescription>
            </SheetHeader>
            <div className="px-4">
              <AvailabilityForm
                initialValues={{
                  date: getSlotDateKey(editing.date),
                  startTime: editing.startTime,
                  endTime: editing.endTime,
                }}
                submitLabel="Save changes"
                isPending={updating}
                onSubmit={handleUpdate}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}
