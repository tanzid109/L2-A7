import { z } from "zod";

export const bookingDetailsSchema = z.object({
  address: z
    .string()
    .min(10, "Address must be at least 10 characters")
    .max(500, "Address must not exceed 500 characters"),
  problemDescription: z
    .string()
    .min(10, "Problem description must be at least 10 characters")
    .max(1000, "Problem description must not exceed 1000 characters"),
});

export const MAX_BOOKING_ADDRESS_LENGTH = 500;
export const MAX_BOOKING_PROBLEM_LENGTH = 1000;

export const reviewFormSchema = z.object({
  rating: z
    .number()
    .min(1, "Please select a rating")
    .max(5, "Rating must be between 1 and 5"),
  comment: z.string().max(1000, "Comment must not exceed 1000 characters"),
});

export type ReviewFormValues = z.infer<typeof reviewFormSchema>;

export const MAX_REVIEW_COMMENT_LENGTH = 1000;
