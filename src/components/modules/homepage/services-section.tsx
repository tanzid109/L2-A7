import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Reveal from "@/components/shared/reveal";
import SectionHeading from "@/components/shared/section-heading";
import ServiceCards from "@/components/shared/service-cards";
import { Button } from "@/components/ui/button";

export default function ServicesSection() {
  return (
    <section>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <SectionHeading
          eyebrow="Our Services"
          title="Explore Our Services"
          description="Browse professional services for your home and pick what you need — priced upfront, bookable in minutes."
        />

        <Reveal className="mt-12">
          <ServiceCards limit={6} isActive />
        </Reveal>

        <Reveal className="mt-10 flex justify-center">
          <Button
            variant="outline"
            size="lg"
            className="px-5"
            nativeButton={false}
            render={<Link href="/services" />}
          >
            View All Services
            <ArrowRight />
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
