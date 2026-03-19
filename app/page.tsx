"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Static imports (above-the-fold — load immediately)
import HeaderSection from "../Components/HeaderSection";
import HeroScroller from "../Components/Hero";

// Dynamic imports (below-the-fold — lazy loaded for performance)
const AboutBento = dynamic(() => import("@/Components/AboutTheClub"), {
  ssr: false,
});
const LeadershipSection = dynamic(() => import("@/Components/leadership"), {
  ssr: false,
});
const Terminal = dynamic(() => import("../Components/Terminal"), {
  ssr: false,
});
const EventGallery = dynamic(() => import("../Components/EventGallery"), {
  ssr: false,
});
const About3D = dynamic(() => import("@/Components/About"), { ssr: false });
const ClubTechStack = dynamic(
  () => import("../Components/TechnologyArsenal"),
  { ssr: false }
);
const JoinClubForm = dynamic(() => import("../Components/JoinClub"), {
  ssr: false,
});
const Footer = dynamic(() => import("@/Components/footer"), { ssr: false });

export default function Page() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Register GSAP ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,          // Scroll duration (higher = smoother/slower)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Expo ease
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Cleanup on unmount
    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000);
      });
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <main>
      <HeaderSection />
      <HeroScroller />
      <AboutBento />
      <LeadershipSection />
      <Terminal />
      <EventGallery />
      <About3D />
      <ClubTechStack />
      <JoinClubForm />
      <Footer />
    </main>
  );
}