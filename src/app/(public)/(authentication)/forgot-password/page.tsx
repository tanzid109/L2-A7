import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/auth-layout";
import ForgotPasswordForm from "@/components/form/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot Password",
  description:
    "Reset your FieldOps password with a one-time code sent to your email.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      image="/assets/register.jpg"
      imageAlt="FieldOps technician at work"
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
