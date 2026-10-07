import type { Metadata } from "next";
import ServicesExplorer from "@/components/modules/marketing/services-explorer";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Browse all available FieldOps home services, compare upfront prices and book a trusted professional in minutes.",
};

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <ServicesExplorer />
    </div>
  );
}
