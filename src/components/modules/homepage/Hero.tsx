import {
  ArrowRight,
  CalendarDays,
  Check,
  ShieldCheck,
  Star,
} from "lucide-react";
import Link from "next/link";
import Reveal from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";

const assurances = [
  "Verified professionals",
  "Upfront pricing",
  "Secure payments",
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b bg-linear-to-b from-primary/5 via-background to-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(hsl(220_25%_90%)_1px,transparent_1px)] bg-size-[22px_22px] mask-[linear-gradient(to_bottom,black,transparent_75%)]"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-28">
        <Reveal className="max-w-xl">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
            <ShieldCheck className="size-3.5" />
            Trusted Home Services
          </span>

          <h1 className="mt-5 font-heading text-4xl font-bold tracking-tight sm:text-5xl">
            Professional Services,{" "}
            <span className="text-primary">Right When You Need Them.</span>
          </h1>

          <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
            Discover services, compare trusted technicians, check live
            availability and book appointments online — all in one place.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              size="lg"
              className="px-5"
              nativeButton={false}
              render={<Link href="/customer/book" />}
            >
              Book a Service
              <ArrowRight />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-5"
              nativeButton={false}
              render={<Link href="/services" />}
            >
              Explore Services
            </Button>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
            {assurances.map((item) => (
              <li
                key={item}
                className="flex items-center gap-1.5 text-sm text-muted-foreground"
              >
                <Check className="size-4 text-primary" />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal
          delay={150}
          className="relative mx-auto w-full max-w-md lg:max-w-lg"
        >
          <div className="relative aspect-10/9 w-full">
            <div
              aria-hidden
              className="absolute inset-x-8 inset-y-8 rounded-3xl border bg-muted/40"
            />
            <div
              aria-hidden
              className="absolute -left-4 -top-4 size-20 rounded-full border border-primary/20 sm:-left-6 sm:-top-6 sm:size-28"
            />
            <div
              aria-hidden
              className="absolute -bottom-3 -right-3 size-14 rounded-full bg-primary/10 sm:-bottom-4 sm:-right-4 sm:size-20"
            />

            <div className="animate-float absolute left-1/2 top-8 w-[88%] -translate-x-1/2 rounded-2xl border bg-card p-4 shadow-lg sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-sm font-semibold">
                  <span className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="size-3.5" />
                  </span>
                  Booking confirmed
                </span>
                <span className="text-xs text-muted-foreground">
                  Today · 3:00 PM
                </span>
              </div>
              <div className="mt-4 space-y-2.5 border-t pt-4 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Service</span>
                  <span className="font-medium">Home maintenance</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Status</span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <span className="size-2 rounded-full bg-emerald-500" />
                    Technician on the way
                  </span>
                </div>
              </div>
            </div>

            <div className="animate-float-delayed absolute left-0 top-[52%] z-10 w-[70%] -translate-y-1/2 rounded-2xl border bg-card p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  FO
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    Verified Professional
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    Assigned to your booking
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 border-t pt-3 text-xs font-medium text-muted-foreground">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="size-3.5 fill-current text-amber-500"
                  />
                ))}
                <span className="ml-1">Top rated</span>
              </div>
            </div>

            <div className="absolute right-0 bottom-6 z-10 w-[62%] rounded-2xl border bg-card p-4 shadow-lg sm:bottom-8">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                <CalendarDays className="size-3.5 text-primary" />
                Next available slot
              </p>
              <div className="mt-2 flex items-center justify-between gap-2">
                <span className="text-sm font-semibold">Today, 3:00 PM</span>
                <span className="rounded-full border border-emerald-600/30 bg-emerald-500/10 px-2 py-0.5 text-[0.6875rem] font-semibold text-emerald-700">
                  Available
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
