import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="border-b bg-muted/40">
      <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 py-16 sm:py-24">
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          Trusted home services
        </span>
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
          Book trusted professionals for your home, in minutes.
        </h1>
        <p className="max-w-xl text-muted-foreground">
          Pick a service, choose a verified technician and book a time that
          works for you — all in one place.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button nativeButton={false} render={<Link href="/customer/book" />}>
            Book a service <ArrowRight className="size-4" />
          </Button>
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href="/services" />}
          >
            Browse services
          </Button>
        </div>
      </div>
    </section>
  );
}
