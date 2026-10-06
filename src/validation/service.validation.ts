import { z } from "zod";
import { MAX_FILE_SIZE } from "./technician-application.validation";

export const SERVICE_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];
export const MAX_SERVICE_DESCRIPTION_LENGTH = 500;

export const serviceSchema = z.object({
  title: z.string().trim().min(3, "Title is too short").max(100),
  slug: z
    .string()
    .trim()
    .min(3, "Slug is too short")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Lowercase letters, numbers and hyphens only",
    ),
  description: z
    .string()
    .trim()
    .min(10, "Description is too short")
    .max(MAX_SERVICE_DESCRIPTION_LENGTH),
  category: z.string().trim().min(2, "Category is required"),
  price: z.string().refine((v) => Number(v) > 0, "Enter a valid price"),
  duration: z
    .string()
    .refine(
      (v) => Number.isInteger(Number(v)) && Number(v) > 0,
      "Enter minutes",
    ),
  image: z
    .instanceof(File)
    .nullable()
    .refine((f): f is File => f !== null, "Image is required")
    .refine(
      (f) => !f || SERVICE_IMAGE_TYPES.includes(f.type),
      "Unsupported image type",
    )
    .refine(
      (f) => !f || f.size <= MAX_FILE_SIZE * 1024 * 1024,
      `Max ${MAX_FILE_SIZE} MB`,
    ),
});

export const serviceUpdateSchema = serviceSchema.omit({ image: true }).extend({
  image: z
    .instanceof(File)
    .nullable()
    .refine(
      (f) => !f || SERVICE_IMAGE_TYPES.includes(f.type),
      "Unsupported image type",
    )
    .refine(
      (f) => !f || f.size <= MAX_FILE_SIZE * 1024 * 1024,
      `Max ${MAX_FILE_SIZE} MB`,
    ),
});
