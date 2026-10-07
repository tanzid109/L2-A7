import {
  BadgeCheck,
  CalendarClock,
  CreditCard,
  MessageSquareQuote,
  MousePointerClick,
  Tag,
} from "lucide-react";
import SectionHeading from "@/components/shared/section-heading";

const benefits = [
  {
    icon: BadgeCheck,
    title: "Verified Professionals",
    description:
      "Choose from qualified technicians with genuine reviews from real bookings.",
  },
  {
    icon: MousePointerClick,
    title: "Easy Booking",
    description:
      "Book a service in just a few steps — pick, schedule and confirm.",
  },
  {
    icon: CalendarClock,
    title: "Flexible Scheduling",
    description:
      "Check live availability and choose a time that works for you.",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description: "A safe and reliable online payment flow for every booking.",
  },
  {
    icon: Tag,
    title: "Transparent Pricing",
    description:
      "Know the service price upfront, before you confirm the booking.",
  },
  {
    icon: MessageSquareQuote,
    title: "Real Customer Reviews",
    description:
      "Make decisions based on genuine feedback from previous customers.",
  },
];

export default function WhyChooseUs() {
  return (
    <section>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <SectionHeading
          eyebrow="Why Choose Us"
          title="Built around trust, convenience and clarity"
          description="Everything you need to hire the right professional with confidence."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="rounded-lg border bg-background p-6 transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-md"
            >
              <span className="flex size-11 items-center justify-center rounded-lg bg-primary/10">
                <benefit.icon className="size-5 text-primary" />
              </span>
              <h3 className="mt-4 text-base font-semibold">{benefit.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
