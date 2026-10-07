import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthLayout } from "@/components/auth/auth-layout";
import VerifyAccountForm from "@/components/form/auth/verify-account-form";

export const metadata: Metadata = {
  title: "Verify Account",
  description:
    "Enter the one-time code sent to your email to activate your FieldOps account.",
};

export default function VerifyAccountPage() {
  return (
    <AuthLayout
      image="/assets/register.jpg"
      imageAlt="Customer verifying their FieldOps account"
    >
      <Suspense
        fallback={<p className="text-sm text-muted-foreground">Loading...</p>}
      >
        <VerifyAccountForm />
      </Suspense>
    </AuthLayout>
  );
}
