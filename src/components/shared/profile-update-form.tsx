"use client";

import { useForm } from "@tanstack/react-form";
import { Camera, Phone, User as UserIcon, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { useGetMe, useUpdateProfile } from "@/hooks";
import type { User } from "@/types";
import { AVATAR_TYPES, MAX_FILE_SIZE, profileUpdateSchema } from "@/validation";
import ProfileLoading from "./profile-loading";

type ProfileValues = z.input<typeof profileUpdateSchema>;

interface Props {
  user: User;
  onSaved?: () => void;
}

export default function ProfileUpdateForm({ user, onSaved }: Props) {
  const { mutate: update, isPending } = useUpdateProfile();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const avatarUrlRef = useRef<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const clearAvatarPreview = () => {
    if (avatarUrlRef.current) {
      URL.revokeObjectURL(avatarUrlRef.current);
      avatarUrlRef.current = null;
    }
    setAvatarPreview(null);
  };

  const setAvatarFile = (file: File | null) => {
    clearAvatarPreview();
    if (file) {
      avatarUrlRef.current = URL.createObjectURL(file);
      setAvatarPreview(avatarUrlRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (avatarUrlRef.current) {
        URL.revokeObjectURL(avatarUrlRef.current);
      }
    };
  }, []);

  const defaultValues: ProfileValues = {
    name: user.name,
    phone: user.phone ?? "",
    avatar: null,
  };
  const { data } = useGetMe();
  
    if (!data) return <ProfileLoading />;

  const form = useForm({
    defaultValues,
    validators: { onSubmit: profileUpdateSchema },
    onSubmit: async ({ value }) => {
        const formData = new FormData();
        const name = value.name?.trim();
        const phone = value.phone?.trim();

        if (name && name !== user.name) formData.append("name", name);
        if (phone && phone !== (user.phone ?? "")) formData.append("phone", phone);
        if (value.avatar) formData.append("avatar", value.avatar);

        if ([...formData.keys()].length === 0) {
            toast.add({
                title: "Nothing to update",
                description: "Change at least one field",
                type: "info",
            });
            return;
        }

      update(formData, {
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
            title: "Profile updated",
            description: res.message,
            type: "success",
          });
          form.setFieldValue("avatar", null);
          setAvatarFile(null);
          onSaved?.();
        },
        onError: (err) => {
          toast.add({
            title: "Failed to update profile",
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
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      noValidate
    >
      <FieldGroup>
        <form.Field name="avatar">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            const file = field.state.value;
            const src = avatarPreview ?? user.avatar;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor="avatar-field">Avatar</FieldLabel>
                <div className="flex flex-wrap items-center gap-4">
                  {src ? (
                    // biome-ignore lint/performance/noImgElement: simple avatar
                    <img
                      src={src}
                      alt={user.name}
                      className="size-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex size-20 items-center justify-center rounded-full bg-muted">
                      <UserIcon className="size-8 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => avatarInputRef.current?.click()}
                      >
                        <Camera className="size-4" />
                        Change
                      </Button>
                      {file && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            field.handleChange(null);
                            setAvatarFile(null);
                            field.handleBlur();
                          }}
                        >
                          <X className="size-4" />
                          Remove
                        </Button>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      JPG, PNG, WEBP or AVIF up to {MAX_FILE_SIZE} MB
                    </span>
                  </div>
                  <input
                    id="avatar-field"
                    ref={avatarInputRef}
                    type="file"
                    className="sr-only"
                    name={field.name}
                    accept={AVATAR_TYPES.join(",")}
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null;
                      setAvatarFile(file);
                      field.handleChange(file);
                      e.target.value = "";
                    }}
                  />
                </div>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <form.Field name="name">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                  <div className="relative">
                    <UserIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id={field.name}
                      name={field.name}
                      placeholder="John Doe"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      className="pl-9"
                    />
                  </div>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="phone">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Phone</FieldLabel>
                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id={field.name}
                      name={field.name}
                      type="tel"
                      placeholder="+8801712345678"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      className="pl-9"
                    />
                  </div>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
        </div>
      </FieldGroup>

      <div className="mt-5 flex w-full justify-end">
        <Button disabled={isPending} type="submit">
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
