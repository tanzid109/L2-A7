import Reveal from "@/components/shared/reveal";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "center" | "left";
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: SectionHeadingProps) {
  return (
    <Reveal>
      <div
        className={
          align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"
        }
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          {eyebrow}
        </p>
        <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          {title}
        </h2>
        {description && (
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            {description}
          </p>
        )}
      </div>
    </Reveal>
  );
}
