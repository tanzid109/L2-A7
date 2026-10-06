import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Hero from "@/components/modules/homepage/Hero";
import HowItWorks from "@/components/modules/homepage/how-it-works";
import ServiceCards from "@/components/shared/service-cards";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div>
      <Hero />

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Book a service
            </h2>
            <p className="text-sm text-muted-foreground">
              Pick a service and book a technician in a few clicks.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<Link href="/services" />}
          >
            View all services <ArrowRight className="size-4" />
          </Button>
        </div>

        <ServiceCards limit={6} isActive />
      </section>

      <HowItWorks />
    </div>
  );
}
