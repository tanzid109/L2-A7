import z from "zod";

export const MAX_FILE_SIZE = 5;

export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE * 1024 * 1024;

export const MAX_ADDITIONAL_FILES = 5;

export const MAX_BIO_LENGTH = 1000;

export const MAX_HOURLY_RATE = 100000;

export const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
];

export function isAcceptedFileSize(fileSize: number) {
  return fileSize <= MAX_FILE_SIZE_BYTES;
}

export function isAcceptedFileType(fileType: string) {
  return ACCEPTED_FILE_TYPES.includes(fileType);
}

export const acceptedFileSchema = z
  .instanceof(File)
  .refine((file) => isAcceptedFileType(file.type), {
    message: "Only PDF, DOC, DOCX, PNG or JPEG files are allowed.",
  })
  .refine((file) => isAcceptedFileSize(file.size), {
    message: `File must be ${MAX_FILE_SIZE}MB or smaller.`,
  });

export const technicianApplicationSchema = z
  .object({
    specialization: z
      .string()
      .trim()
      .min(2, "Specialization must be at least 2 characters long.")
      .max(100, "Specialization must be at most 100 characters long."),
    experience: z
      .string()
      .trim()
      .min(2, "Experience must be at least 2 characters long.")
      .max(100, "Experience must be at most 100 characters long."),
    hourlyRate: z
      .string()
      .trim()
      .min(1, "Hourly rate is required.")
      .refine((value) => !Number.isNaN(Number(value)), {
        message: "Hourly rate must be a number.",
      })
      .refine((value) => Number(value) > 0, {
        message: "Hourly rate must be greater than 0.",
      })
      .refine((value) => Number(value) <= MAX_HOURLY_RATE, {
        message: `Hourly rate must be ${MAX_HOURLY_RATE} BDT or less.`,
      }),
    bio: z
      .string()
      .trim()
      .min(20, "Bio must be at least 20 characters long.")
      .max(MAX_BIO_LENGTH, `Bio must be at most ${MAX_BIO_LENGTH} characters.`),
    resume: acceptedFileSchema.nullable(),
    additionalFiles: z
      .array(acceptedFileSchema)
      .max(
        MAX_ADDITIONAL_FILES,
        `You can add up to ${MAX_ADDITIONAL_FILES} files.`,
      ),
  })
  .refine((data) => data.resume !== null, {
    message: "Resume is required.",
    path: ["resume"],
  });
