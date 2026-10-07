import { BadgeCheck, CalendarCheck, Layers, Lock } from "lucide-react";

const stats = [
  {
    icon: Layers,
    label: "Multiple Service Categories",
    hint: "Home maintenance, cleaning, repairs and more",
  },
  {
    icon: BadgeCheck,
    label: "Verified Professionals",
    hint: "Reviewed and approved technicians only",
  },
  {
    icon: CalendarCheck,
    label: "Easy Online Booking",
    hint: "Book in a few steps, on any device",
  },
  {
    icon: Lock,
    label: "Secure Payments",
    hint: "Protected checkout from start to finish",
  },
];

export default function TrustStrip() {
  return (
    <section
      className="bg-primary text-primary-foreground"
      aria-label="Why customers trust us"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:gap-10 lg:px-8">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-2">
            <stat.icon className="size-5 text-primary-foreground/70" />
            <p className="text-sm font-semibold sm:text-base">{stat.label}</p>
            <p className="text-xs leading-relaxed text-primary-foreground/60">
              {stat.hint}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
