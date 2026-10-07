import { cn } from "cn";
import { ArrowLeft, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Brand } from "@/components/shared/brand";

const showcasePoints = [
  "Verified & vetted local professionals",
  "Book services online in minutes",
  "Secure payments with clear pricing",
];

export function AuthShowcase({
  image,
  imageAlt,
  className,
}: {
  image?: string;
  imageAlt?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative hidden overflow-hidden bg-primary lg:block",
        className,
      )}
    >
      {image && (
        <Image
          src={image}
          alt={imageAlt ?? ""}
          fill
          priority
          sizes="50vw"
          className="object-cover opacity-40"
        />
      )}
      <div className="absolute inset-0 bg-linear-to-t from-primary via-primary/75 to-primary/30" />
      <div className="relative flex h-full flex-col justify-between p-12">
        <div className="flex flex-col gap-6">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/70">
            FieldOps
          </span>
          <h2 className="max-w-sm font-heading text-3xl font-bold leading-tight text-primary-foreground">
            Professional services, right when you need them.
          </h2>
          <ul className="flex flex-col gap-3 text-sm text-primary-foreground/85">
            {showcasePoints.map((point) => (
              <li key={point} className="flex items-center gap-2.5">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-white/15">
                  <Check className="size-3 text-primary-foreground" />
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-primary-foreground/60">
          Trusted by customers & technicians nationwide.
        </p>
      </div>
    </div>
  );
}

export function AuthLayout({
  children,
  image,
  imageAlt,
  wide = false,
}: {
  children: ReactNode;
  image?: string;
  imageAlt?: string;
  wide?: boolean;
}) {
  return (
    <div
      className={cn(
        "grid min-h-svh",
        wide ? "lg:grid-cols-3" : "lg:grid-cols-2",
      )}
    >
      <div
        className={cn(
          "flex flex-col gap-6 p-6 sm:p-10 lg:p-12",
          wide && "lg:col-span-2",
        )}
      >
        <div className="flex items-center justify-between gap-4">
          <Brand />
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to website
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center py-6">
          <div className={cn("w-full", wide ? "max-w-xl" : "max-w-sm")}>
            {children}
          </div>
        </div>
        <p className="text-center text-xs text-muted-foreground lg:text-left">
          © {new Date().getFullYear()} FieldOps. All rights reserved.
        </p>
      </div>
      <AuthShowcase image={image} imageAlt={imageAlt} />
    </div>
  );
}
