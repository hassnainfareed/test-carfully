"use client";

import { Footer } from "@/components/Footer";
import { HeroComponent } from "@/components/HeroComponent";
import HomeServices from "@/components/HomeServices";
import HowToComponent from "@/components/HowToComponent";
import HowToPromo from "@/components/HowToPromo";
import PricingComponent from "@/components/PricingComponent";
import Navigation from "@/components/navigation/Navigation";

export default function Home() {
  return (
    <>
      <Navigation />
      <HeroComponent />
      <HowToComponent />
      <HomeServices />
      {/* <PricingComponent /> */}
      <HowToPromo />
      <Footer />
    </>
  );
}
