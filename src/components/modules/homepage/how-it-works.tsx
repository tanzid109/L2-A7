import { CalendarDays, ListChecks, Wrench } from "lucide-react";

const STEPS = [
  {
    icon: ListChecks,
    title: "Choose a service",
    description:
      "Browse the service catalogue and pick exactly what you need done.",
  },
  {
    icon: CalendarDays,
    title: "Pick a technician & time",
    description:
      "Compare verified technicians, then book a date and time slot that suits you.",
  },
  {
    icon: Wrench,
    title: "Get the job done",
    description:
      "Track the booking, pay securely and rate the technician when the work is complete.",
  },
];

export default function HowItWorks() {
  return (
    <section className="border-t bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-8 max-w-xl">
          <h2 className="text-2xl font-bold tracking-tight">How it works</h2>
          <p className="text-sm text-muted-foreground">
            Three simple steps from request to completed job.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((step, index) => (
            <div
              key={step.title}
              className="rounded-lg border bg-background p-6"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <step.icon className="size-5 text-primary" />
                </div>
                <span className="text-xs font-semibold text-muted-foreground">
                  Step {index + 1}
                </span>
              </div>
              <h3 className="mb-1 font-semibold">{step.title}</h3>
              <p className="text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
