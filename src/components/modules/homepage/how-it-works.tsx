import { CalendarDays, CheckCircle2, Search, Users } from "lucide-react";
import SectionHeading from "@/components/shared/section-heading";

const STEPS = [
  {
    number: "01",
    icon: Search,
    title: "Choose a Service",
    description:
      "Browse available services and find exactly what you need done.",
  },
  {
    number: "02",
    icon: Users,
    title: "Choose a Technician",
    description:
      "Compare verified professionals and pick the right one for the job.",
  },
  {
    number: "03",
    icon: CalendarDays,
    title: "Pick a Time",
    description:
      "Check live availability and select a time slot that works for you.",
  },
  {
    number: "04",
    icon: CheckCircle2,
    title: "Book & Relax",
    description:
      "Confirm your booking and let the professional handle the rest.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <SectionHeading
          eyebrow="How It Works"
          title="Four steps from request to completed job"
          description="Booking a trusted professional takes minutes, not hours."
        />

        <div className="relative mt-12">
          <div
            aria-hidden
            className="absolute left-[12%] right-[12%] top-[46px] hidden h-px bg-border lg:block"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step) => (
              <div
                key={step.number}
                className="relative rounded-lg border bg-background p-6 transition-all hover:border-primary/50"
              >
                <div className="flex items-center justify-between">
                  <span className="flex size-11 items-center justify-center rounded-lg bg-primary/10">
                    <step.icon className="size-5 text-primary" />
                  </span>
                  <span className="font-heading text-3xl font-bold text-primary/15">
                    {step.number}
                  </span>
                </div>
                <h3 className="mt-4 text-base font-semibold">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
