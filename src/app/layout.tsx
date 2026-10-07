import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat, Oxanium } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import Providers from "@/providers";

const montserratHeading = Montserrat({
  subsets: ["latin"],
  variable: "--font-heading",
});

const oxanium = Oxanium({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | FieldOps",
    default: "FieldOps — Professional Services, Simplified",
  },
  description:
    "Find trusted professionals and book reliable home services at your convenience. Discover services, compare verified technicians, check live availability and book online.",
  applicationName: "FieldOps",
  openGraph: {
    title: "FieldOps — Professional Services, Simplified",
    description:
      "Find trusted professionals and book reliable home services at your convenience. Discover services, compare verified technicians, check live availability and book online.",
    siteName: "FieldOps",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "FieldOps — Professional Services, Simplified",
    description:
      "Find trusted professionals and book reliable home services at your convenience.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        oxanium.variable,
        montserratHeading.variable,
      )}
    >
      <Providers>
        <body className="min-h-full flex flex-col">
          {children}
          <Toaster />
        </body>
      </Providers>
    </html>
  );
}
