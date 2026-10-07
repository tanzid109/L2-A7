"use client";

import { Pencil, Trash2 } from "lucide-react";
import { type Dispatch, type SetStateAction, useState } from "react";
import AddServiceForm from "@/components/form/admin/add-service-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
import { toast } from "@/components/ui/toast";
import { useDeleteService, useGetAllServices } from "@/hooks";
import type { ServiceParams } from "@/types";
import type { Service } from "@/types/admin.type";
import ServiceTableLoading from "./service-table-loading";

interface Props extends ServiceParams {
  handlePageChange: Dispatch<SetStateAction<number>>;
}

function getErrorMessage(error: unknown) {
  return (
    (error as Error & { data?: { message?: string } })?.data?.message ||
    (error as Error)?.message ||
    "Something went wrong. Please try again"
  );
}

export default function ServiceTable({ handlePageChange, ...params }: Props) {
  const [updating, setUpdating] = useState<Service | null>(null);
  const { data, isPending, isError, error, refetch, isFetching } =
    useGetAllServices(params);

  const totalPages = data?.data?.meta?.totalPages ?? 0;
  const {
    mutate: remove,
    isPending: deleting,
    variables: deletingId,
  } = useDeleteService();

  if (isPending) {
    return <ServiceTableLoading />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/5 p-5 text-sm">
        <p className="font-semibold text-destructive">
          Could not load services
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

  const services = data.data.data;

  const handleDelete = (id: string) => {
    remove(id, {
      onSuccess: (res) =>
        toast.add({
          title: "Service deleted",
          description: res?.message,
          type: "success",
        }),
      onError: (err) =>
        toast.add({
          title: "Failed to delete service",
          description: getErrorMessage(err),
          type: "error",
        }),
    });
  };

  if (services.length === 0) {
    return (
      <div className="rounded-lg border p-5 text-sm text-muted-foreground">
        No services found
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service) => (
            <TableRow key={service.id}>
              <TableCell>
                {service.imageUrl ? (
                  // biome-ignore lint/performance/noImgElement: simple thumbnail
                  <img
                    src={service.imageUrl}
                    alt={service.title}
                    className="size-10 rounded-md object-cover"
                  />
                ) : (
                  <div className="size-10 rounded-md bg-muted" />
                )}
              </TableCell>
              <TableCell>
                <div className="font-medium">{service.title}</div>
                <div className="text-xs text-muted-foreground">
                  {service.slug}
                </div>
              </TableCell>
              <TableCell>{service.category}</TableCell>
              <TableCell>
                {Number(service.price).toLocaleString()} BDT
              </TableCell>
              <TableCell>{service.duration} min</TableCell>
              <TableCell>
                <Badge variant={service.isActive ? "default" : "secondary"}>
                  {service.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(service.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setUpdating(service)}
                  >
                    <Pencil className="size-4" />
                    Update
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(service.id)}
                    disabled={deleting && deletingId === service.id}
                  >
                    {deleting && deletingId === service.id ? (
                      <Spinner />
                    ) : (
                      <Trash2 className="size-4" />
                    )}
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {totalPages > 1 && (
        <div className="my-5">
          <TablePagination
            page={params.page ?? 1}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
        </div>
      )}
      <Sheet
        open={!!updating}
        onOpenChange={(open) => !open && setUpdating(null)}
      >
        <SheetContent side="right" className="overflow-y-auto sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Update service</SheetTitle>
            <SheetDescription>
              Edit the service details and save changes.
            </SheetDescription>
          </SheetHeader>
          {updating && (
            <div className="px-8 pb-8">
              <AddServiceForm
                key={updating.id}
                service={updating}
                embedded
                onSaved={() => setUpdating(null)}
              />
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
