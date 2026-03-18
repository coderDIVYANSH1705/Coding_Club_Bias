"use client";
import { useState, useRef, MouseEvent } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import GlassSurface from "./GlassSurface";

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

type NavItem = {
  label: string;
  href?: string;
  scrollTo?: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About the Club", scrollTo: "about" },
  { label: "Arena", href: "/arena" },
  { label: "Upcoming Events", scrollTo: "upcoming-events" },
  { label: "Gallery", scrollTo: "gallery" },
];

const CodingClubHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (item: NavItem) => {
    if (item.scrollTo) scrollToId(item.scrollTo);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4"
      >
        <GlassSurface
          width="auto"
          height="auto"
          borderRadius={50}
          borderWidth={0.05}
          brightness={55}
          opacity={0.9}
          blur={12}
          displace={0.5}
          backgroundOpacity={0.05}
          saturation={1.2}
          distortionScale={-150}
          redOffset={0}
          greenOffset={8}
          blueOffset={15}
          xChannel="R"
          yChannel="G"
          mixBlendMode="difference"
        >
          <nav className="flex items-center justify-between gap-4 px-5 py-2.5 w-full">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="flex-shrink-0"
            >
              <div className="flex flex-col">
                <span className="text-base md:text-lg font-bold text-green-400 tracking-tight whitespace-nowrap font-mono">
                  &lt;CodeClub /&gt;
                </span>
                <span className="text-[8px] md:text-[9px] text-white/40 tracking-widest uppercase font-mono hidden sm:block">
                  Birla Institute of Applied Sciences
                </span>
              </div>
            </motion.div>

            {/* Desktop Nav */}
            <ul className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <MagneticLink
                  key={item.label}
                  href={item.scrollTo ? undefined : item.href}
                  onClick={item.scrollTo ? () => handleNavClick(item) : undefined}
                >
                  {item.label}
                </MagneticLink>
              ))}

              {/* ADMIN LOGIN LINK */}
              <MagneticLink href="/admin/login">
                <span className="text-green-400 font-bold">_ADMIN</span>
              </MagneticLink>
            </ul>

            {/* Right side: Join CTA + Mobile Menu Button */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {/* Join CTA — desktop only */}
              <GlassSurface
                width="auto"
                height="auto"
                borderRadius={30}
                borderWidth={0.06}
                brightness={60}
                opacity={0.92}
                blur={10}
                displace={0.4}
                backgroundOpacity={0.08}
                saturation={1.3}
                distortionScale={-120}
                redOffset={0}
                greenOffset={5}
                blueOffset={10}
                xChannel="R"
                yChannel="G"
                mixBlendMode="screen"
                className="cursor-pointer hidden md:block"
              >
                <motion.button
                  onClick={() => scrollToId("join")}
                  whileTap={{ scale: 0.95 }}
                  className="px-5 py-2 text-sm font-medium text-green-400 whitespace-nowrap font-mono"
                >
                  &gt;_ Join Us
                </motion.button>
              </GlassSurface>

              {/* Mobile Menu Button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-white/90 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10"
                aria-label="Toggle menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </motion.button>
            </div>
          </nav>
        </GlassSurface>
      </motion.header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div className="absolute inset-0 backdrop-blur-xl bg-black/40" />

          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="absolute top-24 left-4 right-4"
            onClick={(e) => e.stopPropagation()}
          >
            <GlassSurface
              width="100%"
              height="auto"
              borderRadius={24}
              borderWidth={0.05}
              brightness={55}
              opacity={0.9}
              blur={12}
              displace={0.5}
              backgroundOpacity={0.05}
              saturation={1.2}
              distortionScale={-150}
              redOffset={0}
              greenOffset={8}
              blueOffset={15}
              xChannel="R"
              yChannel="G"
              mixBlendMode="difference"
            >
              <ul className="flex flex-col gap-1 p-4 w-full">
                {NAV_ITEMS.map((item, index) => (
                  <motion.li
                    key={item.label}
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.07 }}
                  >
                    <a
                      href={item.scrollTo ? undefined : item.href}
                      onClick={item.scrollTo ? () => handleNavClick(item) : undefined}
                      className="flex items-center text-white/80 hover:text-green-400 transition-all duration-300 py-3 px-4 rounded-xl hover:bg-white/5 cursor-pointer font-mono text-sm"
                    >
                      <span className="text-green-400 mr-2 opacity-50 text-xs">{">"}</span>
                      {item.label}
                    </a>
                  </motion.li>
                ))}

                {/* ADMIN LOGIN — Mobile */}
                <motion.li
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: NAV_ITEMS.length * 0.07 }}
                >
                  <a
                    href="/admin/login"
                    className="flex items-center text-green-400 font-bold hover:text-green-300 transition-all duration-300 py-3 px-4 rounded-xl hover:bg-white/5 cursor-pointer font-mono text-sm"
                  >
                    <span className="text-green-400 mr-2 opacity-50 text-xs">{">"}</span>
                    _ROOT
                  </a>
                </motion.li>

                {/* Divider */}
                <li className="my-1 border-t border-white/10" />

                {/* Join CTA — Mobile */}
                <motion.li
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: (NAV_ITEMS.length + 1) * 0.07 }}
                >
                  <GlassSurface
                    width="100%"
                    height="auto"
                    borderRadius={16}
                    borderWidth={0.06}
                    brightness={60}
                    opacity={0.92}
                    blur={10}
                    displace={0.4}
                    backgroundOpacity={0.08}
                    saturation={1.3}
                    distortionScale={-120}
                    redOffset={0}
                    greenOffset={5}
                    blueOffset={10}
                    xChannel="R"
                    yChannel="G"
                    mixBlendMode="screen"
                    className="cursor-pointer"
                  >
                    <button
                      onClick={() => {
                        scrollToId("join");
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-green-400 font-medium text-sm py-3 font-mono tracking-wide"
                    >
                      &gt;_ Join Us
                    </button>
                  </GlassSurface>
                </motion.li>
              </ul>
            </GlassSurface>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

// ─── Magnetic Link ─────────────────────────────────────────────────────────────
const springConfig = { damping: 20, stiffness: 200 };

const MagneticLink = ({
  children,
  href,
  onClick,
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
}) => {
  const ref = useRef<HTMLLIElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const distanceX = e.clientX - (rect.left + rect.width / 2);
    const distanceY = e.clientY - (rect.top + rect.height / 2);
    const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
    const maxDistance = 80;
    if (distance < maxDistance) {
      const strength = (maxDistance - distance) / maxDistance;
      x.set(distanceX * strength * 0.2);
      y.set(distanceY * strength * 0.2);
    } else {
      x.set(0);
      y.set(0);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.li
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className="relative"
    >
      <motion.a
        href={href}
        onClick={onClick}
        whileHover={{ scale: 1.02 }}
        className="relative block text-white/70 hover:text-green-400 transition-colors duration-300 px-4 py-2 rounded-full group cursor-pointer font-mono"
      >
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 rounded-full transition-colors duration-300" />
        <span className="relative z-10 text-sm font-medium whitespace-nowrap">{children}</span>
      </motion.a>
    </motion.li>
  );
};

export default CodingClubHeader;