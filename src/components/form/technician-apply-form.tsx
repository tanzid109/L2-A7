"use client";

import { useForm } from "@tanstack/react-form";
import {
  Banknote,
  Briefcase,
  FileText,
  FileUp,
  Plus,
  Stethoscope,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import type z from "zod";
// import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTechnicianApply } from "@/hooks";
import { formatFileSize } from "@/utils";
import {
  ACCEPTED_FILE_TYPES,
  MAX_ADDITIONAL_FILES,
  MAX_BIO_LENGTH,
  MAX_FILE_SIZE,
  technicianApplicationSchema,
} from "@/validation";
import { toast } from "../ui/toast";
import { Spinner } from "../ui/spinner";

export default function TechnicianApplyForm() {
  // const router = useRouter();
  const { mutate: apply, isPending: applyPending } = useTechnicianApply();
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const additionalFilesInputRef = useRef<HTMLInputElement>(null);

  type TechnicianApplicationValues = z.infer<
    typeof technicianApplicationSchema
  >;

  const defaultValues: TechnicianApplicationValues = {
    specialization: "",
    experience: "",
    hourlyRate: "",
    bio: "",
    resume: null,
    additionalFiles: [],
  };

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: technicianApplicationSchema,
    },
    onSubmit: async ({ value }) => {
      if (!value.resume) return;

      const formData = new FormData();
      formData.append("specialization", value.specialization.trim());
      formData.append("experience", value.experience.trim());
      formData.append("hourlyRate", value.hourlyRate.trim());
      formData.append("bio", value.bio.trim());
      formData.append("resume", value.resume);
      value.additionalFiles.forEach((file) => {
        formData.append("additionalFiles", file);
      });

      apply(formData, {
        onSuccess: (res) => {
          if (!res.success) {
            toast.add({
              title: "Server Failure",
              description: "Something went wrong. Please try again",
              type: "error",
            });
          }

          toast.add({
            title: "Application Successful",
            description: "Soon you will get email",
            type: "success",
          });
          form.reset()
        },
        onError: (err) => {
          toast.add({
            title: "Verification failure",
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
    <div className="flex flex-col gap-6 ">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">
          Apply to become a Technician
        </h1>
      </div>

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
            <form.Field name="specialization">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Specialization</FieldLabel>
                    <div className="relative">
                      <Stethoscope className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id={field.name}
                        name={field.name}
                        type="text"
                        placeholder="Electronics, HVAC, etc."
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

            <form.Field name="experience">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Experience</FieldLabel>
                    <div className="relative">
                      <Briefcase className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id={field.name}
                        name={field.name}
                        type="number"
                        placeholder="e.g. 3+ years in appliance repair"
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

            <form.Field name="hourlyRate">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Hourly Rate (BDT)
                    </FieldLabel>
                    <div className="relative">
                      <Banknote className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id={field.name}
                        name={field.name}
                        type="number"
                        min={0}
                        step="0.01"
                        inputMode="decimal"
                        placeholder="1000"
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

          <form.Field name="bio">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    Professional bio{" "}
                  </FieldLabel>
                  <Textarea
                    id={field.name}
                    name={field.name}
                    rows={4}
                    placeholder="Share your background, skills and work philosophy..."
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                  />
                  <div className="flex items-center justify-between gap-2">
                    <FieldDescription>
                      Shown on your public profile after approval.
                    </FieldDescription>
                    <span className="text-xs text-muted-foreground">
                      {field.state.value.length}/{MAX_BIO_LENGTH}
                    </span>
                  </div>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="resume">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              const file = field.state.value;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor="resume-field">Resume</FieldLabel>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => resumeInputRef.current?.click()}
                    >
                      <FileUp size="4" />
                      Upload resume
                    </Button>
                    <input
                      id="resume-field"
                      ref={resumeInputRef}
                      type="file"
                      className="sr-only"
                      name={field.name}
                      accept={ACCEPTED_FILE_TYPES.join(",")}
                      onChange={(e) => {
                        const selected = e.target.files?.[0] ?? null;

                        field.handleChange(selected);
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
                          aria-label="Remove resume"
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
                        PDF, DOC, DOCX or image up to {MAX_FILE_SIZE} MB
                      </span>
                    )}
                  </div>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="additionalFiles">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              const files = field.state.value;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor="additional-file-field">
                    Additional Files{" "}
                    <span className="font-normal text-muted-foreground">
                      (optional)
                    </span>
                  </FieldLabel>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => additionalFilesInputRef.current?.click()}
                    >
                      <Plus size="4" />
                      Add Files
                    </Button>
                    <input
                      id="additional-file-field"
                      ref={additionalFilesInputRef}
                      type="file"
                      multiple
                      className="sr-only"
                      name={field.name}
                      accept={ACCEPTED_FILE_TYPES.join(",")}
                      onChange={(e) => {
                        const incoming = Array.from(e.target.files ?? []);

                        if (incoming.length === 0) {
                          return;
                        }

                        field.handleChange([...files, ...incoming]);
                        e.target.value = "";
                      }}
                    />
                    {files.length > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {files.length} of {MAX_ADDITIONAL_FILES} added
                      </span>
                    )}
                  </div>
                  {files.length > 0 && (
                    <ul className="flex flex-col gap-2">
                      {files.map((file, index) => (
                        <li
                          key={`${file.name}-${index}`}
                          className="flex items-center justify-between gap-2 rounded-lg bg-muted px-3 py-2 text-sm"
                        >
                          <span className="flex min-w-0 items-center gap-2">
                            <FileText className="size-4 shrink-0 text-primary" />
                            <span className="truncate">{file.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {formatFileSize(file.size)}
                            </span>
                          </span>
                          <button
                            type="button"
                            aria-label={`Remove ${file.name}`}
                            onClick={() => {
                              field.handleChange(
                                files.filter((_, i) => i !== index),
                              );
                              field.handleBlur();
                            }}
                            className="text-muted-foreground transition-colors hover:text-destructive focus:outline-none"
                          >
                            <X className="size-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
        </FieldGroup>
        <div className="flex justify-end w-full mt-5">
          <Button disabled={applyPending} type="submit">
            {applyPending ? (
              <>
                <Spinner /> Submitting
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
