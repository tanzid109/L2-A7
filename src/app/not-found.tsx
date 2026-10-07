import { SearchX } from "lucide-react";
import Link from "next/link";
import { Brand } from "@/components/shared/brand";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="relative flex min-h-[70vh] flex-1 items-center justify-center overflow-hidden px-4 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,oklch(0.62_0.13_270/0.22),transparent_55%)]"
      />

      <div className="flex w-full max-w-md flex-col items-center gap-6 text-center">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <SearchX className="size-7" />
        </span>

        <div className="flex flex-col items-center gap-2">
          <Brand />
          <p className="mt-2 font-heading text-2xl font-bold tracking-tight">
            Page not found
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist or may have been
            moved. Check the address and try again, or head back home.
          </p>
        </div>

        <div className="text-sm font-bold">
          <span className="text-foreground">404</span>
          <span className="mx-2 text-muted-foreground/50">/</span>
          <span className="text-primary">Not Found</span>
        </div>

        <Button
          variant="default"
          nativeButton={false}
          render={<Link href="/" />}
        >
          Back to home
        </Button>
      </div>
    </main>
  );
}
