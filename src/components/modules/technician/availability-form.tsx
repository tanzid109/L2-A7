"use client";

import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  type AvailabilityFormValues,
  availabilitySchema,
  getTodayDateKey,
} from "@/validation";

interface Props {
  initialValues?: {
    date: string;
    startTime: string;
    endTime: string;
  };
  submitLabel: string;
  isPending: boolean;
  onSubmit: (values: {
    date: string;
    startTime: string;
    endTime: string;
  }) => void;
}

export default function AvailabilityForm({
  initialValues,
  submitLabel,
  isPending,
  onSubmit,
}: Props) {
  const defaultValues: AvailabilityFormValues = {
    date: initialValues?.date ?? "",
    startTime: initialValues?.startTime ?? "",
    endTime: initialValues?.endTime ?? "",
  };

  const form = useForm({
    defaultValues,
    validators: { onSubmit: availabilitySchema },
    onSubmit: ({ value }) => onSubmit(value),
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      noValidate
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <form.Field name="date">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Date</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="date"
                  min={getTodayDateKey()}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="startTime">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Start time</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="time"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="endTime">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>End time</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="time"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
      </div>

      <div className="mt-4 flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Spinner /> Saving
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </form>
  );
}
