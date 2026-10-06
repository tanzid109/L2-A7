"use client";

import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Check, CircleCheckIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import {
  useCreateBooking,
  useGetAllServices,
  useGetTechnicianAvailability,
  useGetTechnicians,
} from "@/hooks";
import { cn } from "@/lib/utils";
import type { BookingState, CreateBookingPayload } from "@/types";
import {
  type DateOption,
  getSlotDateKey,
  groupSlotsByDate,
  isSlotPast,
} from "@/utils";
import {
  bookingDetailsSchema,
  MAX_BOOKING_ADDRESS_LENGTH,
  MAX_BOOKING_PROBLEM_LENGTH,
} from "@/validation";
import BookingSummary from "./booking-summary";
import DateSelector from "./date-selector";
import ServiceSelector from "./service-selector";
import TechnicianSelector from "./technician-selector";
import TimeSlotSelector from "./time-slot-selector";

type BookingDetailsValues = z.input<typeof bookingDetailsSchema>;

const defaultDetails: BookingDetailsValues = {
  address: "",
  problemDescription: "",
};

const STEPS = [
  "Select service",
  "Select technician",
  "Date & time",
  "Review",
] as const;

type BookingErrorKind = "conflict" | "auth" | "validation" | "other";

function describeBookingError(err: unknown): {
  title: string;
  description: string;
  kind: BookingErrorKind;
} {
  const error = err as Error & {
    data?: { message?: string };
    status?: number;
    statusCode?: number;
  };
  const description =
    error.data?.message ||
    error.message ||
    "Something went wrong. Please try again";
  const status = error.status ?? error.statusCode ?? 0;

  if (
    description.includes("already booked") ||
    description.includes("already been requested") ||
    status === 409
  ) {
    return {
      title: "Slot no longer available",
      description:
        "This time slot has just been taken. Please pick another slot.",
      kind: "conflict",
    };
  }

  if (description.startsWith("Validation failed")) {
    return {
      title: "Invalid booking details",
      description,
      kind: "validation",
    };
  }

  if (
    description.includes("not logged in") ||
    description.includes("Forbidden") ||
    status === 401 ||
    status === 403
  ) {
    return {
      title: "Authentication required",
      description: "Please log in again as a customer to continue.",
      kind: "auth",
    };
  }

  if (status === 404) {
    return {
      title: "Not found",
      description,
      kind: "other",
    };
  }

  return {
    title: "Booking failed",
    description,
    kind: "other",
  };
}

interface Props {
  initialServiceId?: string;
}

export default function BookingForm({ initialServiceId }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [stepIndex, setStepIndex] = useState(0);
  const [dateKey, setDateKey] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [booking, setBooking] = useState<BookingState>({
    serviceId: initialServiceId ?? "",
    technicianId: "",
    availabilityId: "",
  });

  const { mutate: create, isPending: creating } = useCreateBooking();

  const { data: servicesData } = useGetAllServices({
    isActive: true,
    limit: 100,
  });
  const { data: techniciansData } = useGetTechnicians({ limit: 100 });
  const availabilityQuery = useGetTechnicianAvailability(booking.technicianId, {
    limit: 100,
  });

  const services = servicesData?.data.data ?? [];
  const technicians = techniciansData?.data.data ?? [];

  const selectedService = services.find(
    (service) => service.id === booking.serviceId,
  );
  const selectedTechnician = technicians.find(
    (technician) => technician.id === booking.technicianId,
  );

  const slots = availabilityQuery.data?.data.data ?? [];

  const futureSlots = useMemo(
    () =>
      slots.filter(
        (slot) => !isSlotPast(getSlotDateKey(slot.date), slot.endTime),
      ),
    [slots],
  );
  const dateOptions: DateOption[] = useMemo(
    () => groupSlotsByDate(futureSlots),
    [futureSlots],
  );

  const activeDateKey = dateOptions.some((date) => date.key === dateKey)
    ? dateKey
    : (dateOptions[0]?.key ?? "");
  const activeDateSlots =
    dateOptions.find((date) => date.key === activeDateKey)?.slots ?? [];
  const selectedSlot = activeDateSlots.find(
    (slot) => slot.id === booking.availabilityId,
  );
  const activeAvailabilityId = selectedSlot?.id ?? "";

  const detailsForm = useForm({
    defaultValues: defaultDetails,
    validators: {
      onSubmit: bookingDetailsSchema,
    },
    onSubmit: async ({ value }) => {
      if (!selectedService || !selectedTechnician || !activeAvailabilityId) {
        return;
      }

      const payload: CreateBookingPayload = {
        serviceId: selectedService.id,
        technicianId: selectedTechnician.id,
        availabilityId: activeAvailabilityId,
        address: value.address.trim(),
        problemDescription: value.problemDescription.trim(),
      };

      setSubmitError(null);

      create(payload, {
        onSuccess: (res) => {
          if (!res.success) {
            toast.add({
              title: "Booking failed",
              description:
                res.message || "Something went wrong. Please try again",
              type: "error",
            });
            setSubmitError(
              res.message || "Something went wrong. Please try again",
            );
            return;
          }

          toast.add({
            title: "Booking created",
            description: res.message,
            type: "success",
          });
          router.push("/customer/bookings");
        },
        onError: (err) => {
          const info = describeBookingError(err);

          toast.add({
            title: info.title,
            description: info.description,
            type: "error",
          });
          setSubmitError(info.description);

          if (info.kind === "conflict") {
            setBooking((prev) => ({ ...prev, availabilityId: "" }));
            queryClient.invalidateQueries({ queryKey: ["availability"] });
          }
        },
      });
    },
  });

  const handleServiceSelect = (serviceId: string) => {
    setBooking((prev) =>
      prev.serviceId === serviceId
        ? prev
        : { serviceId, technicianId: "", availabilityId: "" },
    );
    setDateKey("");
  };

  const handleTechnicianSelect = (technicianId: string) => {
    setBooking((prev) =>
      prev.technicianId === technicianId
        ? prev
        : { ...prev, technicianId, availabilityId: "" },
    );
    setDateKey("");
  };

  const handleDateSelect = (nextDateKey: string) => {
    setDateKey(nextDateKey);

    const slot = slots.find((item) => item.id === booking.availabilityId);

    if (!slot || getSlotDateKey(slot.date) !== nextDateKey) {
      setBooking((prev) => ({ ...prev, availabilityId: "" }));
    }
  };

  const handleSlotSelect = (availabilityId: string) => {
    setBooking((prev) => ({ ...prev, availabilityId }));
  };

  const canContinue =
    (stepIndex === 0 && Boolean(selectedService)) ||
    (stepIndex === 1 && Boolean(selectedTechnician)) ||
    (stepIndex === 2 && Boolean(activeAvailabilityId));

  const jumpToStep = (index: number) => {
    if (index < stepIndex) {
      setStepIndex(index);
      setSubmitError(null);
    }
  };

  const stepContent = () => {
    switch (stepIndex) {
      case 0:
        return (
          <ServiceSelector
            value={booking.serviceId}
            onSelect={handleServiceSelect}
          />
        );
      case 1:
        return (
          <TechnicianSelector
            value={booking.technicianId}
            onSelect={handleTechnicianSelect}
          />
        );
      case 2: {
        if (availabilityQuery.isError) {
          return (
            <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed p-6 text-center">
              <p className="text-sm text-destructive">
                Could not load availability for this technician.
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => availabilityQuery.refetch()}
              >
                Try again
              </Button>
            </div>
          );
        }

        return (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-medium">Select a date</h3>
              <DateSelector
                dates={dateOptions}
                value={activeDateKey}
                onSelect={handleDateSelect}
                isPending={availabilityQuery.isPending}
              />
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-medium">Select a time slot</h3>
                {!availabilityQuery.isPending && (
                  <span className="text-xs text-muted-foreground">
                    {activeDateSlots.length} available
                  </span>
                )}
              </div>
              <TimeSlotSelector
                slots={activeDateSlots}
                value={activeAvailabilityId}
                onSelect={handleSlotSelect}
                isPending={availabilityQuery.isPending}
              />
            </div>
          </div>
        );
      }
      case 3:
        return (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              event.stopPropagation();
              detailsForm.handleSubmit();
            }}
            noValidate
            className="flex flex-col gap-6"
          >
            <div className="grid gap-6 lg:grid-cols-2">
              <BookingSummary
                service={selectedService}
                technician={selectedTechnician}
                availability={selectedSlot}
              />

              <FieldGroup>
                <detailsForm.Field name="address">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          Service address
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          placeholder="House 12, Road 5, Dhanmondi, Dhaka"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(event) =>
                            field.handleChange(event.target.value)
                          }
                          aria-invalid={isInvalid}
                        />
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs text-muted-foreground">
                            Minimum 10 characters.
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {field.state.value.length}/
                            {MAX_BOOKING_ADDRESS_LENGTH}
                          </span>
                        </div>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </detailsForm.Field>

                <detailsForm.Field name="problemDescription">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          Problem description
                        </FieldLabel>
                        <Textarea
                          id={field.name}
                          name={field.name}
                          rows={5}
                          placeholder="Describe the issue you are facing..."
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(event) =>
                            field.handleChange(event.target.value)
                          }
                          aria-invalid={isInvalid}
                        />
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs text-muted-foreground">
                            Minimum 10 characters.
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {field.state.value.length}/
                            {MAX_BOOKING_PROBLEM_LENGTH}
                          </span>
                        </div>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </detailsForm.Field>
              </FieldGroup>
            </div>

            {submitError && (
              <p className="text-sm text-destructive">{submitError}</p>
            )}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <Button
                type="button"
                variant="outline"
                size="lg"
                disabled={creating}
                onClick={() => jumpToStep(2)}
              >
                <ArrowLeft className="size-4" />
                Back
              </Button>
              <Button type="submit" size="lg" disabled={creating}>
                {creating ? (
                  <>
                    <Spinner /> Confirming
                  </>
                ) : (
                  <>
                    Confirm booking
                    <CircleCheckIcon className="size-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold tracking-tight">Book a service</h1>

      <ol className="flex flex-wrap items-center gap-2 sm:gap-3">
        {STEPS.map((label, index) => {
          const isCompleted = index < stepIndex;
          const isCurrent = index === stepIndex;
          const canJump = index < stepIndex;

          return (
            <li key={label} className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                disabled={!canJump}
                onClick={() => jumpToStep(index)}
                aria-current={isCurrent ? "step" : undefined}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                  canJump && "hover:bg-muted",
                  !canJump && !isCurrent && "text-muted-foreground",
                )}
              >
                <span
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                    isCompleted &&
                      "border-primary bg-primary text-primary-foreground",
                    isCurrent && "border-primary text-primary",
                    !isCompleted &&
                      !isCurrent &&
                      "border-border text-muted-foreground",
                  )}
                >
                  {isCompleted ? <Check className="size-3.5" /> : index + 1}
                </span>
                <span
                  className={cn(
                    "whitespace-nowrap",
                    isCurrent && "font-medium",
                  )}
                >
                  {label}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <Card>
        <CardHeader>
          <CardTitle>{STEPS[stepIndex]}</CardTitle>
          <CardDescription>
            {stepIndex === 0 &&
              "Choose the service you need. Prices are per service."}
            {stepIndex === 1 &&
              "Pick a technician. Availability and ratings come from their live profile."}
            {stepIndex === 2 &&
              "Only free time slots reported by the technician are shown."}
            {stepIndex === 3 &&
              "Review your selection, add your address, then confirm."}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          {stepContent()}
        </CardContent>
      </Card>

      {stepIndex < 3 && (
        <div className="flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            size="lg"
            disabled={stepIndex === 0}
            onClick={() => jumpToStep(stepIndex - 1)}
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>
          <Button
            type="button"
            size="lg"
            disabled={!canContinue}
            onClick={() => setStepIndex(stepIndex + 1)}
          >
            Continue
            <ArrowRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
