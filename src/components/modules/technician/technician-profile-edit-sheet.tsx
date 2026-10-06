"use client";

import { useForm } from "@tanstack/react-form";
import { Camera, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { useUpdateMyTechnicianProfile } from "@/hooks";
import type { TechnicianProfile } from "@/types";
import { getErrorMessage } from "@/utils";
import {
  AVATAR_TYPES,
  MAX_FILE_SIZE,
  type TechnicianProfileFormValues,
  technicianProfileFormSchema,
} from "@/validation";

interface Props {
  profile: TechnicianProfile;
  onClose: () => void;
}

export default function TechnicianProfileEditSheet({
  profile,
  onClose,
}: Props) {
  const { mutate: update, isPending } = useUpdateMyTechnicianProfile();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const imageUrlRef = useRef<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const clearImagePreview = () => {
    if (imageUrlRef.current) {
      URL.revokeObjectURL(imageUrlRef.current);
      imageUrlRef.current = null;
    }
    setImagePreview(null);
  };

  const setImage = (file: File | null) => {
    clearImagePreview();
    if (file) {
      imageUrlRef.current = URL.createObjectURL(file);
      setImagePreview(imageUrlRef.current);
    }
    setImageFile(file);
  };

  useEffect(() => {
    return () => {
      if (imageUrlRef.current) {
        URL.revokeObjectURL(imageUrlRef.current);
      }
    };
  }, []);

  const defaultValues: TechnicianProfileFormValues = {
    specialization: profile.specialization,
    experience: String(profile.experience),
    hourlyRate: String(profile.hourlyRate),
    bio: profile.bio ?? "",
  };

  const form = useForm({
    defaultValues,
    validators: { onSubmit: technicianProfileFormSchema },
    onSubmit: ({ value }) => {
      const formData = new FormData();
      formData.append("specialization", value.specialization.trim());
      formData.append("experience", String(Number(value.experience)));
      formData.append("hourlyRate", String(Number(value.hourlyRate)));
      const bio = value.bio.trim();
      if (bio) {
        formData.append("bio", bio);
      }
      if (imageFile) {
        formData.append("profileImage", imageFile);
      }

      update(formData, {
        onSuccess: (res) => {
          toast.add({
            title: "Profile updated",
            description: res.message,
            type: "success",
          });
          setImage(null);
          onClose();
        },
        onError: (err) => {
          toast.add({
            title: "Could not update profile",
            description: getErrorMessage(err),
            type: "error",
          });
        },
      });
    },
  });

  const handleImageSelect = (file: File | null) => {
    if (file && !AVATAR_TYPES.includes(file.type)) {
      toast.add({
        title: "Invalid file",
        description: "Only JPG, PNG, WEBP or AVIF images are allowed",
        type: "error",
      });
      return;
    }
    if (file && file.size > MAX_FILE_SIZE * 1024 * 1024) {
      toast.add({
        title: "File too large",
        description: `Image must be ${MAX_FILE_SIZE}MB or smaller`,
        type: "error",
      });
      return;
    }
    setImage(file);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      noValidate
      className="flex flex-col gap-5 px-4 pb-4"
    >
      <Field>
        <FieldLabel htmlFor="profile-image">Profile image</FieldLabel>
        <div className="flex flex-wrap items-center gap-4">
          {imagePreview ? (
            // biome-ignore lint/performance/noImgElement: simple avatar preview
            <img
              src={imagePreview}
              alt="Profile preview"
              className="size-20 rounded-full object-cover"
            />
          ) : profile.user.avatar ? (
            // biome-ignore lint/performance/noImgElement: simple avatar
            <img
              src={profile.user.avatar}
              alt={profile.user.name}
              className="size-20 rounded-full object-cover"
            />
          ) : (
            <div className="flex size-20 items-center justify-center rounded-full bg-muted text-lg font-semibold">
              {profile.user.name
                .split(" ")
                .map((part) => part[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </div>
          )}
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => imageInputRef.current?.click()}
            >
              <Camera className="size-4" /> Change
            </Button>
            {imageFile && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setImage(null)}
              >
                <X className="size-4" /> Remove
              </Button>
            )}
          </div>
          <input
            id="profile-image"
            ref={imageInputRef}
            type="file"
            className="sr-only"
            name="profileImage"
            accept={AVATAR_TYPES.join(",")}
            onChange={(e) => {
              handleImageSelect(e.target.files?.[0] ?? null);
              e.target.value = "";
            }}
          />
        </div>
        <span className="text-xs text-muted-foreground">
          JPG, PNG, WEBP or AVIF up to {MAX_FILE_SIZE} MB
        </span>
      </Field>

      <form.Field name="specialization">
        {(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>Specialization</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                placeholder="Electronics"
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

      <div className="grid gap-4 sm:grid-cols-2">
        <form.Field name="experience">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Experience (years)</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="number"
                  min={0}
                  max={50}
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

        <form.Field name="hourlyRate">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Hourly rate (BDT)</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="number"
                  min={1}
                  step="0.01"
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

      <form.Field name="bio">
        {(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>Bio</FieldLabel>
              <Textarea
                id={field.name}
                name={field.name}
                rows={4}
                placeholder="Tell customers about your experience..."
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

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Spinner /> Saving
            </>
          ) : (
            "Save changes"
          )}
        </Button>
      </div>
    </form>
  );
}
