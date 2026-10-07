import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/auth-layout";
import LoginForm from "@/components/form/auth/login-form";

export const metadata: Metadata = {
  title: "Login",
  description:
    "Sign in to your FieldOps account to manage bookings, payments, and more.",
};

export default function LoginPage() {
  return (
    <AuthLayout
      image="/assets/login.jpg"
      imageAlt="FieldOps technician at work"
    >
      <LoginForm />
    </AuthLayout>
  );
}
