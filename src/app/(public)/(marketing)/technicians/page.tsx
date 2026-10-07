import type { Metadata } from "next";
import TechniciansExplorer from "@/components/modules/marketing/technicians-explorer";

export const metadata: Metadata = {
  title: "Technicians",
  description:
    "Browse verified FieldOps technicians, compare experience and ratings, check live availability and book a service.",
};

export default function TechniciansPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <TechniciansExplorer />
    </div>
  );
}
