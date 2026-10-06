import { z } from "zod";

export const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

export function getTodayDateKey() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

export const availabilitySchema = z
  .object({
    date: z.string().min(1, "Date is required"),
    startTime: z
      .string()
      .regex(TIME_PATTERN, "Start time must be a valid time"),
    endTime: z.string().regex(TIME_PATTERN, "End time must be a valid time"),
  })
  .refine((values) => values.startTime < values.endTime, {
    message: "Start time must be earlier than end time",
    path: ["endTime"],
  })
  .refine((values) => values.date === "" || values.date >= getTodayDateKey(), {
    message: "Date cannot be in the past",
    path: ["date"],
  });

export type AvailabilityFormValues = z.input<typeof availabilitySchema>;

export const MAX_TECHNICIAN_BIO_LENGTH = 500;
export const MAX_TECHNICIAN_EXPERIENCE = 50;

export const technicianProfileFormSchema = z.object({
  specialization: z
    .string()
    .trim()
    .min(2, "Specialization must be at least 2 characters long.")
    .max(100, "Specialization must be at most 100 characters long."),
  experience: z
    .string()
    .trim()
    .min(1, "Experience is required.")
    .refine((value) => Number.isInteger(Number(value)), {
      message: "Experience must be a whole number.",
    })
    .refine(
      (value) =>
        Number(value) >= 0 && Number(value) <= MAX_TECHNICIAN_EXPERIENCE,
      {
        message: `Experience must be between 0 and ${MAX_TECHNICIAN_EXPERIENCE} years.`,
      },
    ),
  hourlyRate: z
    .string()
    .trim()
    .min(1, "Hourly rate is required.")
    .refine((value) => !Number.isNaN(Number(value)), {
      message: "Hourly rate must be a number.",
    })
    .refine((value) => Number(value) > 0, {
      message: "Hourly rate must be greater than 0.",
    }),
  bio: z
    .string()
    .trim()
    .max(
      MAX_TECHNICIAN_BIO_LENGTH,
      `Bio must be at most ${MAX_TECHNICIAN_BIO_LENGTH} characters.`,
    )
    .refine((value) => value === "" || value.length >= 10, {
      message: "Bio must be at least 10 characters long (or left empty).",
    }),
});

export type TechnicianProfileFormValues = z.input<
  typeof technicianProfileFormSchema
>;
