"use client";

import { useForm } from "@tanstack/react-form";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Eye, EyeClosed } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useReset } from "@/hooks";
import { resetPasswordSchema } from "@/validation";
import { Button } from "../../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "../../ui/field";
import { Input } from "../../ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../../ui/input-otp";
import { Spinner } from "../../ui/spinner";
import { toast } from "../../ui/toast";

const RESEND_COOLDOWN = 120;

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const email = searchParams.get("email") || "";

  const [showPassword, setShowPassword] = useState(false);
  const [resendTimer, setResendTimer] = useState(RESEND_COOLDOWN);

  const { mutate: reset, isPending: resetPending } = useReset();

  useEffect(() => {
    if (!email) {
      router.replace("/forgot-password");
    }
  }, [email, router]);

  useEffect(() => {
    if (resendTimer <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendTimer]);

  const form = useForm({
    defaultValues: {
      email,
      otp: "",
      newPassword: "",
    },
    validators: {
      onSubmit: resetPasswordSchema,
    },
    onSubmit: ({ value }) => {
      const resetData = {
        email: value.email,
        otp: value.otp,
        newPassword: value.newPassword,
      };

      reset(resetData, {
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
            title: "Password Reset Successful",
            description: "Please login with your new password",
            type: "success",
          });
          router.push("/login");
        },
        onError: (err) => {
          toast.add({
            title: "Reset failure",
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

  if (!email) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>
          Enter the OTP we sent to your email and your new password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="reset-form"
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <form.Field name="email">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  readOnly
                />
              </Field>
            )}
          </form.Field>

          <form.Field name="otp">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>OTP</FieldLabel>
                  <InputOTP
                    id={field.name}
                    name={field.name}
                    maxLength={6}
                    value={field.state.value}
                    onChange={field.handleChange}
                    onBlur={field.handleBlur}
                    autoComplete="off"
                    pattern={REGEXP_ONLY_DIGITS}
                    aria-invalid={isInvalid}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  <FieldDescription>
                    Resend available in {resendTimer}s
                  </FieldDescription>
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="newPassword">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>New Password</FieldLabel>
                  <div className="relative">
                    <Input
                      id={field.name}
                      name={field.name}
                      type={showPassword ? "text" : "password"}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      autoComplete="new-password"
                      aria-invalid={isInvalid}
                      className="pr-10"
                    />
                    <button
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeClosed className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
        </form>
      </CardContent>
      <CardFooter>
        <Button disabled={resetPending} type="submit" form="reset-form">
          {resetPending ? (
            <>
              <Spinner /> Submitting
            </>
          ) : (
            "Reset Password"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
