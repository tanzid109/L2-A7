"use client";

import { useForm } from "@tanstack/react-form";
import type { VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";
import { Eye, EyeClosed, ShieldCheck, User, Wrench } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLogin } from "@/hooks";
import { loginSchema } from "@/validation";
import GoogleLoginComponent from "../../modules/google-login/GoogleLogin";
import { Button, type buttonVariants } from "../../ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "../../ui/field";
import { Input } from "../../ui/input";
import { Spinner } from "../../ui/spinner";
import { toast } from "../../ui/toast";

type DemoRole = "admin" | "customer" | "technician";

interface DemoAccount {
  role: DemoRole;
  label: string;
  email: string;
  password: string;
  href: string;
  icon: LucideIcon;
  variant: NonNullable<VariantProps<typeof buttonVariants>["variant"]>;
}

const allDemoAccounts: DemoAccount[] = [
  {
    role: "admin",
    label: "Admin",
    email: process.env.NEXT_PUBLIC_DEMO_ADMIN_EMAIL ?? "",
    password: process.env.NEXT_PUBLIC_DEMO_ADMIN_PASSWORD ?? "",
    href: "/admin",
    icon: ShieldCheck,
    variant: "default",
  },
  {
    role: "customer",
    label: "Customer",
    email: process.env.NEXT_PUBLIC_DEMO_CUSTOMER_EMAIL ?? "",
    password: process.env.NEXT_PUBLIC_DEMO_CUSTOMER_PASSWORD ?? "",
    href: "/customer",
    icon: User,
    variant: "outline",
  },
  {
    role: "technician",
    label: "Technician",
    email: process.env.NEXT_PUBLIC_DEMO_TECHNICIAN_EMAIL ?? "",
    password: process.env.NEXT_PUBLIC_DEMO_TECHNICIAN_PASSWORD ?? "",
    href: "/technician",
    icon: Wrench,
    variant: "secondary",
  },
];

const demoAccounts = allDemoAccounts.filter((account) =>
  Boolean(account.email && account.password),
);

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [demoPending, setDemoPending] = useState<DemoRole | null>(null);
  const router = useRouter();

  const { mutate: login, isPending: loginPending } = useLogin();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: ({ value }) => {
      const loginData = {
        email: value.email,
        password: value.password,
      };

      login(loginData, {
        onSuccess: () => {
          toast.add({
            title: "Login Success",
            description: "Welcome back",
            type: "success",
          });
          router.push("/");
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

  const handleDemoLogin = (account: DemoAccount) => {
    setDemoPending(account.role);
    login(
      { email: account.email, password: account.password },
      {
        onSuccess: () => {
          toast.add({
            title: "Demo login success",
            description: `Welcome back, ${account.label}`,
            type: "success",
          });
          router.push(account.href);
        },
        onError: (err) => {
          setDemoPending(null);
          toast.add({
            title: "Demo login failed",
            description:
              (err as Error & { data?: { message?: string } }).data?.message ||
              err.message ||
              "Something went wrong. Please try again",
            type: "error",
          });
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">
          Login to your account
        </h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your email below to login to your account
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

          <form.Field name="password">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <div className="flex items-center justify-between">
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <Link
                      href="/forgot-password"
                      className="text-sm text-muted-foreground underline underline-offset-4 hover:text-primary"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id={field.name}
                      name={field.name}
                      type={showPassword ? "text" : "password"}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      value={field.state.value}
                      autoComplete="off"
                      aria-invalid={isInvalid}
                    />
                    <button
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
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

          <Button disabled={loginPending} type="submit">
            {loginPending ? (
              <>
                <Spinner /> submitting
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </FieldGroup>
      </form>

      {demoAccounts.length > 0 && (
        <>
          <FieldSeparator>Demo login</FieldSeparator>
          <div className="flex flex-col gap-3">
            <p className="text-center text-xs text-muted-foreground">
              Explore FieldOps instantly with a one-click demo account.
            </p>
            <div className="grid grid-cols-3 gap-2">
              {demoAccounts.map((account) => {
                const Icon = account.icon;
                const pending = demoPending === account.role;

                return (
                  <Button
                    key={account.role}
                    type="button"
                    variant={account.variant}
                    className="h-auto flex-col gap-1.5 py-3"
                    disabled={demoPending !== null}
                    onClick={() => handleDemoLogin(account)}
                  >
                    {pending ? <Spinner /> : <Icon />}
                    {account.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </>
      )}

      {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
        <>
          <FieldSeparator>Or continue with</FieldSeparator>
          <GoogleLoginComponent />
        </>
      )}

      <div className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium underline underline-offset-4 hover:text-primary"
        >
          Register
        </Link>
      </div>
    </div>
  );
}
