import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/auth-layout";
import { RegisterForm } from "@/components/form/auth/register-form";

export const metadata: Metadata = {
  title: "Create an Account",
  description:
    "Join FieldOps to book verified local professionals for services around your home or business.",
};

export default function RegisterPage() {
  return (
    <AuthLayout
      image="/assets/register.jpg"
      imageAlt="Customer signing up with FieldOps"
    >
      <RegisterForm />
    </AuthLayout>
  );
}
