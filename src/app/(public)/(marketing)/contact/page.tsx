import ContactForm from "@/components/modules/homepage/contact-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with the FieldOps team. Questions about a booking? Contact the technician directly from your booking page.",
};

const shortcuts = [
  { name: "Browse services", url: "/services" },
  { name: "View technicians", url: "/technicians" },
  { name: "My bookings", url: "/customer" },
  { name: "Become a technician", url: "/apply" },
];

export default function ContactPage() {
  return (
    <section className="border-b bg-linear-to-b from-primary/5 to-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1fr_320px] lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Contact
          </p>
          <h1 className="mt-3 font-heading text-4xl font-bold tracking-tight sm:text-5xl">
            Get in touch
          </h1>
          <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">
            Have a question or feedback? Send us a message and the FieldOps team
            will get back to you.
          </p>

          <div className="mt-8 rounded-xl border bg-background p-6 sm:p-8">
            <ContactForm />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border bg-background p-6">
            <h2 className="text-sm font-semibold">Useful shortcuts</h2>
            <ul className="mt-4 space-y-3">
              {shortcuts.map((link) => (
                <li key={link.url}>
                  <a
                    href={link.url}
                    className="text-sm text-primary underline-offset-4 hover:underline"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border bg-muted/50 p-6">
            <h2 className="text-sm font-semibold">Booking support</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              The fastest way to resolve an issue with an existing booking is to
              contact the technician directly from your booking details in the
              customer dashboard.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
