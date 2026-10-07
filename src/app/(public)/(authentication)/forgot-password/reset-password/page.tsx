import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthLayout } from "@/components/auth/auth-layout";
import ResetPasswordForm from "@/components/form/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Reset Password",
  description:
    "Enter the one-time code sent to your email and choose a new password.",
};

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      image="/assets/login.jpg"
      imageAlt="FieldOps technician at work"
    >
      <Suspense
        fallback={<p className="text-sm text-muted-foreground">Loading...</p>}
      >
        <ResetPasswordForm />
      </Suspense>
    </AuthLayout>
  );
}
