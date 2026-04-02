"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, Zap, Layers, Camera } from "lucide-react";

const STYLE_LANES = [
  {
    key: "women",
    title: "Women Authentic",
    label: "Leather & Edge",
    image: "/women-editorial.png",
    summary:
      "Black leather, round glasses, dark lipstick — editorial confidence with a nerdy edge that feels effortless.",
    tags: ["leather", "editorial", "authentic"],
  },
  {
    key: "anime",
    title: "Anime",
    label: "Dark Warrior",
    image: "/kpop-girl.png",
    summary:
      "Sasuke-style intensity with lightning-charged atmosphere and sharp anime linework. Dark, powerful, cinematic.",
    tags: ["anime", "dark energy", "cinematic"],
  },
  {
    key: "men",
    title: "Menswear",
    label: "Tailored Shadow",
    image: "/men-fashion.png",
    summary:
      "Sharp tailoring, graphite tones, and controlled contrast for a campaign image that feels structured and expensive.",
    tags: ["tailored", "campaign", "graphite"],
  },
] as const;

const CAPABILITIES = [
  {
    icon: Camera,
    title: "Prompt-First Control",
    description:
      "Write a clean creative direction once, then let the AI engine render a polished image that matches your intent.",
  },
  {
    icon: Layers,
    title: "Style Presets",
    description:
      "Load women, anime, or menswear aesthetic directions with a single click. No hunting for hidden options.",
  },
  {
    icon: Zap,
    title: "Separate Studio Panel",
    description:
      "Generate images, edit photos, and create videos from a dedicated workspace — separate from the landing page.",
  },
];

function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-white/[0.06] bg-black/80 backdrop-blur-2xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white shadow-[0_8px_24px_rgba(255,255,255,0.08)]">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-black">a</span>
          </div>
          <div>
            <p className="text-[0.6rem] uppercase tracking-[0.4em] text-white/30">creative system</p>
            <p className="text-sm font-semibold text-white">amine studio</p>
          </div>
        </div>

        <nav className="hidden items-center gap-8 text-sm text-white/40 md:flex">
          <a href="#styles" className="link-underline transition hover:text-white">Styles</a>
          <a href="#capabilities" className="link-underline transition hover:text-white">Capabilities</a>
          <Link
            href="/studio"
            className="group flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-5 py-2.5 text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            Open Studio
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </nav>

        <Link
          href="/studio"
          className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white md:hidden"
        >
          Studio <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </header>
  );
}

function HeroSection() {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacityBg = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <section ref={ref} className="relative min-h-screen overflow-hidden" style={{ position: "relative" }}>
      <motion.div className="absolute inset-0 -z-10" style={{ y: yBg, opacity: opacityBg, scale }}>
        <div className="relative h-full w-full">
          <Image src="/hero-bg.png" alt="" fill sizes="100vw" className="object-cover opacity-40 grayscale" priority />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/70 to-black" />
      </motion.div>

      <div className="pointer-events-none absolute inset-0 -z-[5] overflow-hidden">
        <div className="float-slow absolute -left-32 top-20 h-80 w-80 rounded-full bg-white/[0.04] blur-[100px]" />
        <div className="float-fast absolute right-[-8rem] top-1/4 h-[26rem] w-[26rem] rounded-full bg-white/[0.03] blur-[120px]" />
        <div className="scanline absolute inset-y-0 left-[14%] hidden w-px bg-white/[0.03] md:block" />
        <div className="scanline absolute inset-y-0 right-[20%] hidden w-px bg-white/[0.03] md:block" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 pb-20 pt-32">
        <div className="max-w-4xl space-y-8">
          <FadeIn>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-1.5 text-xs font-medium tracking-wide text-white/70">
              <Sparkles className="h-3.5 w-3.5" />
              AI-Powered Creative Generation
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="text-5xl font-semibold leading-[0.95] tracking-tight sm:text-6xl lg:text-[5.5rem]">
              Create stunning visuals
              <span className="block text-shimmer mt-2">with intelligent precision.</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="max-w-2xl text-lg leading-relaxed text-white/40">
              From editorial portraits to anime art and menswear campaigns — our AI engine learns your creative intent and adapts. Generate, edit, and animate from a single studio.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="flex flex-wrap gap-4">
              <Link href="/studio" className="group flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.06] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/15">
                Start Creating <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a href="#styles" className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-6 py-3.5 text-sm text-white/70 transition hover:bg-white/10 hover:text-white">
                Explore Styles
              </a>
            </div>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="flex flex-wrap gap-3 pt-4">
              {[["3 Lanes", "Women · Anime · Men"], ["AI Engine", "Generate + Edit"], ["Studio Panel", "Separate workspace"]].map(([value, label]) => (
                <div key={value} className="glass-card rounded-2xl px-5 py-3">
                  <p className="text-sm font-semibold text-white">{value}</p>
                  <p className="mt-0.5 text-xs text-white/30">{label}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent" />
    </section>
  );
}

function StyleShowcase() {
  return (
    <section id="styles" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <FadeIn>
          <div className="mb-16 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-white/30">Style Library</p>
              <h2 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Three aesthetic lanes,
                <span className="block text-white/30">one creative system.</span>
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-white/30">
              Each lane is tuned for a different visual language. Click a card in the studio to load its preset.
            </p>
          </div>
        </FadeIn>

        <div className="grid gap-6 lg:grid-cols-3">
          {STYLE_LANES.map((lane, i) => (
            <FadeIn key={lane.key} delay={i * 0.12}>
              <Link href="/studio" className="group block">
                <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.06] bg-[#0a0a0a] transition-all duration-500 hover:border-white/12 hover:shadow-[0_20px_70px_rgba(255,255,255,0.04)]">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image src={lane.image} alt={lane.title} fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/30 to-transparent" />
                    <div className="absolute left-5 top-5">
                      <span className="inline-block rounded-full border border-white/10 bg-black/50 px-3 py-1 text-[0.65rem] uppercase tracking-[0.3em] font-medium text-white/70 backdrop-blur-sm">{lane.label}</span>
                    </div>
                  </div>
                  <div className="relative px-6 pb-7 pt-2">
                    <h3 className="text-2xl font-semibold text-white">{lane.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/40">{lane.summary}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {lane.tags.map((tag) => (
                        <span key={tag} className="rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1 text-xs text-white/40">{tag}</span>
                      ))}
                    </div>
                    <div className="mt-5 flex items-center gap-2 text-sm font-medium text-white/40 transition-colors group-hover:text-white">
                      Use this preset <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function CapabilitiesSection() {
  return (
    <section id="capabilities" className="relative py-24">
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[60%] -translate-x-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="mx-auto max-w-7xl px-6">
        <FadeIn>
          <div className="mb-16 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-white/25">Capabilities</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">Designed for creative professionals</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/30">
              Generate from prompts, edit existing images, create videos from stills — all from a focused studio panel.
            </p>
          </div>
        </FadeIn>

        <div className="grid gap-5 md:grid-cols-3">
          {CAPABILITIES.map((cap, i) => (
            <FadeIn key={cap.title} delay={i * 0.1}>
              <div className="glass-card group rounded-[1.75rem] p-7 transition-all duration-500 hover:border-white/12 hover:bg-white/[0.04]">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/8 bg-white/[0.04] text-white/50 transition-colors group-hover:border-white/15 group-hover:text-white">
                  <cap.icon className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-semibold text-white">{cap.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/35">{cap.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTABanner() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <FadeIn>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/[0.06]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-black to-white/[0.02]" />
            <div className="relative px-8 py-20 text-center sm:px-16">
              <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">Open the studio panel</h2>
              <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-white/35">
                Generate, edit, and animate — all from one focused workspace.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link href="/studio" className="group flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.06] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/15">
                  Launch Studio <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/[0.05] py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-black">
            <span className="text-xs font-bold uppercase tracking-[0.2em]">a</span>
          </div>
          <span className="text-sm text-white/30">amine studio</span>
        </div>
        <div className="flex gap-6 text-xs text-white/20">
          <a href="#styles" className="transition hover:text-white/50">Styles</a>
          <Link href="/studio" className="transition hover:text-white/50">Studio</Link>
        </div>
        <p className="text-xs text-white/15">© 2026 amine studio</p>
      </div>
    </footer>
  );
}

export function LandingPage() {
  return (
    <main className="relative">
      <div className="noise-overlay" />
      <Navbar />
      <HeroSection />
      <StyleShowcase />
      <CapabilitiesSection />
      <CTABanner />
      <Footer />
    </main>
  );
}
