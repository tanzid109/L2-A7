import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/auth-layout";
import TechnicianApplyForm from "@/components/form/technician/technician-apply-form";

export const metadata: Metadata = {
  title: "Become a Technician",
  description:
    "Join the FieldOps network as a technician and grow your service business.",
};

export default function ApplyPage() {
  return (
    <AuthLayout
      wide
      image="/assets/register.jpg"
      imageAlt="Technician joining the FieldOps network"
    >
      <TechnicianApplyForm />
    </AuthLayout>
  );
}
