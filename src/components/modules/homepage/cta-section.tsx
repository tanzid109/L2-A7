import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Reveal from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="border-t bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <Reveal>
          <div className="rounded-xl border bg-primary px-6 py-14 text-center text-primary-foreground sm:px-12">
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to Get the Job Done?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-primary-foreground/70 sm:text-base">
              Find a trusted professional and book your service today.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button
                size="lg"
                className="bg-background px-5 text-foreground hover:bg-background/90 hover:text-foreground"
                nativeButton={false}
                render={<Link href="/customer/book" />}
              >
                Book a Service
                <ArrowRight />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-primary-foreground/30 bg-transparent px-5 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                nativeButton={false}
                render={<Link href="/services" />}
              >
                Explore Services
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
