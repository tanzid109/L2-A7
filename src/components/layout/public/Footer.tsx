import { Wrench } from "lucide-react";
import Link from "next/link";

const linkGroups = [
  {
    title: "Quick Links",
    links: [
      { name: "Services", url: "/services" },
      { name: "How It Works", url: "/#how-it-works" },
      { name: "About", url: "/about-us" },
      { name: "Contact", url: "/contact" },
    ],
  },
  {
    title: "For Customers",
    links: [
      { name: "Book a Service", url: "/customer/book" },
      { name: "My Bookings", url: "/customer" },
      { name: "Payments", url: "/customer/payments" },
    ],
  },
  {
    title: "For Technicians",
    links: [
      // { name: "Become a Technician", url: "/apply" },
      { name: "Technician Dashboard", url: "/technician" },
      { name: "Availability", url: "/technician/availability" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="max-w-xs">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Wrench className="size-4" />
              </span>
              <span className="font-heading text-lg font-bold tracking-tight">
                FieldOps
              </span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Find trusted professionals and book reliable home services at your
              convenience.
            </p>
          </div>

          {linkGroups.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h3 className="text-sm font-semibold">{group.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.url}>
                    <Link
                      href={link.url}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-10 border-t pt-6">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} FieldOps. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
