import { cn } from "cn";
import { Wrench } from "lucide-react";
import Link from "next/link";

export function Brand({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Wrench className="size-4" />
      </span>
      <span className="font-heading text-lg font-bold tracking-tight">
        FieldOps
      </span>
    </Link>
  );
}
