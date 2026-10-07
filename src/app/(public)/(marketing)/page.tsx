import type { Metadata } from "next";
import CTASection from "@/components/modules/homepage/cta-section";
import FeaturedTechnicians from "@/components/modules/homepage/featured-technicians";
import Hero from "@/components/modules/homepage/Hero";
import HowItWorks from "@/components/modules/homepage/how-it-works";
import ServicesSection from "@/components/modules/homepage/services-section";
import Testimonials from "@/components/modules/homepage/testimonials";
import TrustStrip from "@/components/modules/homepage/trust-strip";
import WhyChooseUs from "@/components/modules/homepage/why-choose-us";

export const metadata: Metadata = {
  description:
    "Discover trusted home service professionals, check live availability and book appointments online. Find reliable technicians and book services at your convenience.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <ServicesSection />
      <HowItWorks />
      <WhyChooseUs />
      <FeaturedTechnicians />
      <Testimonials />
      <CTASection />
    </>
  );
}
