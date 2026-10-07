"use client";

import { TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { Brand } from "@/components/shared/brand";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="relative flex min-h-[70vh] flex-1 items-center justify-center overflow-hidden px-4 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,oklch(0.62_0.13_270/0.22),transparent_55%)]"
      />

      <div className="flex w-full max-w-md flex-col items-center gap-6 text-center">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <TriangleAlert className="size-7" />
        </span>

        <div className="flex flex-col items-center gap-2">
          <Brand />
          <p className="mt-2 font-heading text-2xl font-bold tracking-tight">
            Something went wrong
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            We hit an unexpected issue while loading this page. Please try again
            — if the problem persists, go back home and start over.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button onClick={() => retry()}>Try again</Button>
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href="/" />}
          >
            Back to home
          </Button>
        </div>

        {error.digest ? (
          <p className="text-[0.7rem] text-muted-foreground/70">
            Error ID:&nbsp;
            <code className="font-mono">{error.digest}</code>
          </p>
        ) : null}
      </div>
    </main>
  );
}
