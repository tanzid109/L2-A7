import {
  BadgeCheck,
  CalendarCheck,
  Check,
  Handshake,
  ShieldCheck,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import CTASection from "@/components/modules/homepage/cta-section";
import Reveal from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About",
  description:
    "FieldOps connects homes with trusted, verified service professionals. Learn how we make hiring professionals simple for customers and technicians.",
};

const values = [
  {
    icon: ShieldCheck,
    title: "Trust first",
    description:
      "Technicians are verified and every completed booking can be reviewed, so reputation is always earned.",
  },
  {
    icon: CalendarCheck,
    title: "Convenience",
    description:
      "Real-time availability, upfront pricing and online booking mean no more phone tag to get work done.",
  },
  {
    icon: Handshake,
    title: "Transparency",
    description:
      "Clear prices, clear schedules and honest customer feedback at every step of the journey.",
  },
];

const customerPoints = [
  "Discover services across multiple categories with upfront pricing",
  "Compare trusted technicians by ratings, experience and reviews",
  "Check live availability and book a time that suits you",
  "Pay securely and rate the work when it is complete",
];

const technicianPoints = [
  "Get discovered by customers who are ready to book",
  "Manage availability and bookings from a single dashboard",
  "Build a reputation through verified customer reviews",
  "Focus on the job — scheduling and payments are handled for you",
];

export default function AboutPage() {
  return (
    <>
      <section className="border-b bg-gradient-to-b from-primary/[0.05] to-background">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            About FieldOps
          </p>
          <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight sm:text-5xl">
            Connecting homes with trusted professionals
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            FieldOps is a home services platform that makes hiring a
            professional as easy as booking one. Customers discover services,
            compare verified technicians and book in minutes — while technicians
            get a simple way to find work and grow their reputation.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <Reveal>
            <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
              Why FieldOps exists
            </h2>
            <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
              Hiring someone for home maintenance used to mean calling around,
              comparing quotes and hoping for the best. FieldOps brings the
              whole process online: real services, real technicians, real
              availability and secure payments — with verified reviews so you
              always know who you are booking.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <Reveal delay={100}>
              <div className="h-full rounded-lg border bg-background p-6 sm:p-8">
                <h3 className="font-heading text-lg font-bold">
                  For Customers
                </h3>
                <ul className="mt-5 space-y-3">
                  {customerPoints.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground"
                    >
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="h-full rounded-lg border bg-background p-6 sm:p-8">
                <h3 className="font-heading text-lg font-bold">
                  For Technicians
                </h3>
                <ul className="mt-5 space-y-3">
                  {technicianPoints.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground"
                    >
                      <BadgeCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                      {point}
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-5"
                    nativeButton={false}
                    render={<Link href="/apply" />}
                  >
                    Become a Technician
                  </Button>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-t bg-muted/40">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-3">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-lg border bg-background p-6"
              >
                <span className="flex size-11 items-center justify-center rounded-lg bg-primary/10">
                  <value.icon className="size-5 text-primary" />
                </span>
                <h3 className="mt-4 font-semibold">{value.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
