"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Static — above the fold
import HeaderSection from "../Components/HeaderSection";
import HeroScroller from "../Components/Hero";

// Dynamic — below the fold
const AboutBento        = dynamic(() => import("@/Components/AboutTheClub"),       { ssr: false });
const LeadershipSection = dynamic(() => import("@/Components/leadership"),          { ssr: false });
const Terminal          = dynamic(() => import("../Components/Terminal"),           { ssr: false });
const EventGallery      = dynamic(() => import("../Components/EventGallery"),       { ssr: false });
const About3D           = dynamic(() => import("@/Components/About"),              { ssr: false });
const ClubTechStack     = dynamic(() => import("../Components/TechnologyArsenal"), { ssr: false });
const JoinClubForm      = dynamic(() => import("../Components/JoinClub"),          { ssr: false });
const Footer            = dynamic(() => import("@/Components/footer"),             { ssr: false });
const UpcomingEvents    = dynamic(() => import('../Components/future'),    { ssr: false });

// Extend Window so TypeScript doesn't complain about __lenis
declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export default function Page() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;

    // expose the instance so child components
    // can call lenis.on('scroll', ...) to sync
    // ScrollTrigger to the smooth scroll position rather than native scroll.
    window.__lenis = lenis;

    // Keep GSAP ticker in sync with Lenis
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      window.__lenis = undefined;
      gsap.ticker.remove((time) => { lenis.raf(time * 1000); });
      ScrollTrigger.getAll().forEach((t) => t.kill());
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
      <UpcomingEvents />
      <JoinClubForm />
      <Footer />
    </main>
  );
}