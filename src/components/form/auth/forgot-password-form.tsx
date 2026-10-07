"use client";

import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForgot } from "@/hooks";
import { forgotPasswordSchema } from "@/validation";
import { Button } from "../../ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "../../ui/field";
import { Input } from "../../ui/input";
import { Spinner } from "../../ui/spinner";
import { toast } from "../../ui/toast";

export default function ForgotPasswordForm() {
  const router = useRouter();

  const { mutate: forget, isPending: forgetPending } = useForgot();

  const form = useForm({
    defaultValues: {
      email: "tanzid.unkhalil380@gmail.com",
    },
    validators: {
      onSubmit: forgotPasswordSchema,
    },
    onSubmit: ({ value }) => {
      const forgetData = {
        email: value.email,
      };

      forget(forgetData, {
        onSuccess: () => {
          toast.add({
            title: "Otp Sent",
            description: "Please check your email",
            type: "success",
          });
          const params = new URLSearchParams({ email: forgetData.email });
          router.push(`/forgot-password/reset-password?${params.toString()}`);
        },
        onError: (err) => {
          toast.add({
            title: "Authorization failure",
            description:
              err.message || "Something went wrong. Please try again",
            type: "error",
          });
        },
      });
    },
  });

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">
          Forgot your password?
        </h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your email address and we will send you a one-time code to reset
          your password
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <FieldGroup>
          <form.Field name="email">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    value={field.state.value}
                    autoComplete="off"
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
          <Button disabled={forgetPending} type="submit">
            {forgetPending ? (
              <>
                <Spinner /> Sending
              </>
            ) : (
              "Send Reset Code"
            )}
          </Button>
        </FieldGroup>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        Remembered your password?{" "}
        <Link
          href="/login"
          className="font-medium underline underline-offset-4 hover:text-primary"
        >
          Back to login
        </Link>
      </div>
    </div>
  );
}
