"use client";

import { useForm } from "@tanstack/react-form";
import { Banknote, Clock, FileText, ImageUp, Tag, X } from "lucide-react";
import { useRef, useState } from "react";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { useCreateService, useUpdateService } from "@/hooks";
import type { Service } from "@/types/admin.type";
import { formatFileSize, slugify } from "@/utils";
import {
  MAX_FILE_SIZE,
  MAX_SERVICE_DESCRIPTION_LENGTH,
  SERVICE_IMAGE_TYPES,
  serviceSchema,
  serviceUpdateSchema,
} from "@/validation";

type ServiceValues = z.input<typeof serviceSchema>;

const defaultValues: ServiceValues = {
  title: "",
  slug: "",
  description: "",
  category: "",
  price: "",
  duration: "",
  image: null,
};

function getServiceDefaultValues(service: Service): ServiceValues {
  return {
    title: service.title,
    slug: service.slug,
    description: service.description,
    category: service.category,
    price: service.price,
    duration: String(service.duration),
    image: null,
  };
}

interface Props {
  service?: Service;
  embedded?: boolean;
  onSaved?: () => void;
}

export default function AddServiceForm({
  service,
  embedded = false,
  onSaved,
}: Props) {
  const isUpdate = Boolean(service);
  const { mutate: create, isPending: creating } = useCreateService();
  const { mutate: update, isPending: updating } = useUpdateService();
  const isPending = creating || updating;
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [slugEdited, setSlugEdited] = useState(false);

  const form = useForm({
    defaultValues: service ? getServiceDefaultValues(service) : defaultValues,
    validators: {
      onSubmit: isUpdate ? serviceUpdateSchema : serviceSchema,
    },
    onSubmit: async ({ value }) => {
      if (!isUpdate && !value.image) return;

      const formData = new FormData();
      formData.append("title", value.title.trim());
      formData.append("slug", value.slug.trim());
      formData.append("description", value.description.trim());
      formData.append("category", value.category.trim());
      formData.append("price", value.price.trim());
      formData.append("duration", value.duration.trim());
      if (value.image) {
        formData.append("image", value.image);
      }

      if (service) {
        update(
          { id: service.id, payload: formData },
          {
            onSuccess: (res) => {
              if (!res.success) {
                toast.add({
                  title: "Server Failure",
                  description: "Something went wrong. Please try again",
                  type: "error",
                });
                return;
              }
              toast.add({
                title: "Service updated",
                description: res.message,
                type: "success",
              });
              onSaved?.();
            },
            onError: (err) => {
              toast.add({
                title: "Failed to update service",
                description:
                  (err as Error & { data?: { message?: string } }).data
                    ?.message ||
                  err.message ||
                  "Something went wrong. Please try again",
                type: "error",
              });
            },
          },
        );
        return;
      }

      create(formData, {
        onSuccess: (res) => {
          if (!res.success) {
            toast.add({
              title: "Server Failure",
              description: "Something went wrong. Please try again",
              type: "error",
            });
            return;
          }
          toast.add({
            title: "Service created",
            description: res.message,
            type: "success",
          });
          form.reset();
          setSlugEdited(false);
        },
        onError: (err) => {
          toast.add({
            title: "Failed to create service",
            description:
              (err as Error & { data?: { message?: string } }).data?.message ||
              err.message ||
              "Something went wrong. Please try again",
            type: "error",
          });
        },
      });
    },
  });

  return (
    <div className="flex flex-col gap-6">
      {!embedded && (
        <h1 className="text-2xl font-bold tracking-tight">Add Service</h1>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        noValidate
      >
        <FieldGroup>
          <div className="grid gap-5 sm:grid-cols-2">
            <form.Field name="title">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      placeholder="AC Repair Service"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        field.handleChange(e.target.value);
                        if (!slugEdited) {
                          form.setFieldValue("slug", slugify(e.target.value));
                        }
                      }}
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="slug">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Slug</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      placeholder="ac-repair-service"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        setSlugEdited(true);
                        field.handleChange(e.target.value);
                      }}
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <form.Field name="category">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Category</FieldLabel>
                    <div className="relative">
                      <Tag className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id={field.name}
                        name={field.name}
                        placeholder="HVAC"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        className="pl-9"
                      />
                    </div>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="price">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Price (BDT)</FieldLabel>
                    <div className="relative">
                      <Banknote className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id={field.name}
                        name={field.name}
                        type="number"
                        min={0}
                        step="0.01"
                        inputMode="decimal"
                        placeholder="1500"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        className="pl-9"
                      />
                    </div>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="duration">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Duration (min)</FieldLabel>
                    <div className="relative">
                      <Clock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id={field.name}
                        name={field.name}
                        type="number"
                        min={1}
                        step={1}
                        placeholder="120"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        className="pl-9"
                      />
                    </div>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
          </div>

          <form.Field name="description">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                  <Textarea
                    id={field.name}
                    name={field.name}
                    rows={4}
                    placeholder="Describe what this service includes..."
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                  />
                  <div className="flex items-center justify-between gap-2">
                    <FieldDescription>
                      Shown on the service page.
                    </FieldDescription>
                    <span className="text-xs text-muted-foreground">
                      {field.state.value.length}/
                      {MAX_SERVICE_DESCRIPTION_LENGTH}
                    </span>
                  </div>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="image">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              const file = field.state.value;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor="service-image-field">Image</FieldLabel>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => imageInputRef.current?.click()}
                    >
                      <ImageUp className="size-4" />
                      Upload image
                    </Button>
                    <input
                      id="service-image-field"
                      ref={imageInputRef}
                      type="file"
                      className="sr-only"
                      name={field.name}
                      accept={SERVICE_IMAGE_TYPES.join(",")}
                      onChange={(e) => {
                        field.handleChange(e.target.files?.[0] ?? null);
                        e.target.value = "";
                      }}
                    />
                    {file ? (
                      <span className="inline-flex max-w-full items-center gap-2 rounded-lg bg-muted px-2.5 py-1 text-sm">
                        <FileText className="size-4 shrink-0 text-primary" />
                        <span className="truncate">{file.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)}
                        </span>
                        <button
                          type="button"
                          aria-label="Remove image"
                          onClick={() => {
                            field.handleChange(null);
                            field.handleBlur();
                          }}
                          className="text-muted-foreground transition-colors hover:text-destructive focus:outline-none"
                        >
                          <X className="size-4" />
                        </button>
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        {isUpdate
                          ? "No change, current image will be kept"
                          : `JPG, PNG, WEBP or AVIF up to ${MAX_FILE_SIZE} MB`}
                      </span>
                    )}
                  </div>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
        </FieldGroup>

        <div className="mt-5 flex w-full justify-end">
          <Button disabled={isPending} type="submit">
            {isPending ? (
              <>
                <Spinner /> {isUpdate ? "Saving" : "Creating"}
              </>
            ) : isUpdate ? (
              "Update Service"
            ) : (
              "Create Service"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
