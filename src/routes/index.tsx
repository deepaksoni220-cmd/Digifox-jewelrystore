import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, lazy, Suspense } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { ringState } from "@/components/scene/ringState";
const RingCanvas = lazy(() => import("@/components/scene/RingCanvas").then(m => ({ default: m.RingCanvas })));
import { TopNav, PreOrderButton, AddToCartButton } from "@/components/site/TopNav";
import { useCart } from "@/contexts/CartContext";
import { Footer } from "@/components/site/Footer";
import { useTheme } from "@/hooks/useTheme";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aurelle — Worn for Life" },
      {
        name: "description",
        content:
          "A cinematic scroll-driven journey through the Aurelle signature solitaire.",
      },
    ],
  }),
  component: Index,
});

const products = [
  {
    id: "solitaire-ring",
    name: "The Signature Solitaire",
    description: "Round Brilliant · 1.84 ct",
    price: "$700",
    image: "/products/solitaire-ring.jpg",
  },
  {
    id: "tennis-bracelet",
    name: "Eternal Tennis Bracelet",
    description: "18k White Gold · 5.20 tcw",
    price: "$700",
    image: "/products/tennis-bracelet.jpg",
  },
  {
    id: "eternity-band",
    name: "Lumière Eternity Band",
    description: "Platinum · 3.10 tcw",
    price: "$700",
    image: "/products/eternity-band.jpg",
  },
  {
    id: "solitaire-pendant",
    name: "Classic Solitaire Pendant",
    description: "Round Brilliant · 1.00 ct",
    price: "$700",
    image: "/products/solitaire-pendant.jpg",
  },
];

// Ring transform keyframes (tuned against the reference film). Each keyframe is
// pinned to an explicit scroll position `at` (0 = page top, 1 = page bottom).
// Sections fill the viewport at at = section_index / 5 (0, .2, .4, .6, .8, 1).
// The hero gets two extra keyframes so it can run its own slow forward-pitch
// "product reveal" (the diamond progressively faces the camera) before the
// first section transition. rotX is a forward pitch: larger = diamond tilts
// more toward the camera with the band arcing up and over.
const RING_STATES = [
  // Hero start — resting "presentation pose" (end state of the load reveal):
  // big, low, with a clear forward pitch (~26°) so the diamond crown tilts toward you
  { at: 0.0, scale: 1.35, posX: 0.0, posY: -0.65, rotX: 0.46, rotY: 0, rotZ: 0, camZ: 3.9, cluster: 0 },
  // Hero end — the same presentation keeps pitching forward as you scroll in
  { at: 0.15, scale: 1.5, posX: 0.0, posY: -0.8, rotX: 0.62, rotY: 0, rotZ: 0, camZ: 3.78, cluster: 0 },
  // Explore angle — smaller, tilted 3/4 from above to read the diamond facets
  { at: 0.2, scale: 0.32, posX: 0.0, posY: 0.3, rotX: -0.62, rotY: 0.9, rotZ: 0, camZ: 4.0, cluster: 0 },
  // Transcending — bigger, pushed hard left, leaned right (near sideways),
  // diamond crown turned to face the viewer
  { at: 0.4, scale: 0.58, posX: -1.15, posY: 0.0, rotX: 0.12, rotY: -0.99, rotZ: -0.95, camZ: 4.0, cluster: 0 },
  // Story — recede off-screen (manifesto is pure text, no ring)
  { at: 0.6, scale: 0.42, posX: 0.0, posY: -2.4, rotX: 0.1, rotY: 3.0, rotZ: 0, camZ: 5.0, cluster: 0 },
  // Cluster — rises back to center and blooms into the floating cluster
  { at: 0.8, scale: 0.55, posX: 0.0, posY: -0.05, rotX: 0.1, rotY: 3.4, rotZ: 0, camZ: 4.6, cluster: 1 },
  // Return — diamond presented on the right of the headline, one full turn around
  { at: 1.0, scale: 0.62, posX: 0.28, posY: -0.05, rotX: 0.25, rotY: Math.PI * 2, rotZ: 0, camZ: 4.2, cluster: 0 },
];

// Keys we actually interpolate (everything except the `at` position marker).
const RING_KEYS = ["scale", "posX", "posY", "rotX", "rotY", "rotZ", "camZ", "cluster"] as const;
// power3.out — quick start, slow settle (luxury-product easing).
const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);

function Index() {
  const root = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const { addToCart } = useCart();
  const isLight = theme === "light";

  useEffect(() => {
    setMounted(true);
    if (!root.current) return;

    // ?card → embedded as a non-scrollable gallery thumbnail. Instead of waiting
    // for user scroll, auto-play the whole journey as a slow ping-pong so the
    // card shows the full scrolling experience.
    const card =
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).has("card");

    // Lenis smooth scroll — gives the page real momentum, so when you stop
    // scrolling it glides to rest (and everything tied to scroll glides with
    // it) instead of dead-stopping. Driven by GSAP's ticker and feeding
    // ScrollTrigger, so the ring timeline stays perfectly in sync. Skipped in
    // card mode (we drive the scroll ourselves there).
    let lenis: Lenis | null = null;
    const tick = (time: number) => lenis?.raf(time * 1000);
    if (!card) {
      lenis = new Lenis({
        lerp: 0.12, // smoothing — lower is silkier, higher is snappier
        wheelMultiplier: 1,
        smoothWheel: true,
      });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }
    let cardRaf = 0;

    const ctx = gsap.context(() => {
      // Single, deterministic timeline. Overall scroll progress (0→1) is mapped
      // to the keyframe whose `at` positions straddle it, then eased — smooth,
      // jitter-free motion with no fighting triggers.
      const applyState = (p: number) => {
        let i = 0;
        while (i < RING_STATES.length - 2 && p > RING_STATES[i + 1].at) i++;
        const a = RING_STATES[i];
        const b = RING_STATES[i + 1];
        const span = b.at - a.at || 1;
        const local = easeOut(Math.min(Math.max((p - a.at) / span, 0), 1));
        RING_KEYS.forEach((k) => {
          (ringState as any)[k] = gsap.utils.interpolate(a[k], b[k], local);
        });
      };
      // Seed the first keyframe so the ring is correct before the first scroll.
      applyState(0);
      const proxy = { p: 0 };
      gsap.to(proxy, {
        p: 1,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
        },
        onUpdate: () => applyState(proxy.p),
      });

      // Hero load reveal — the ring is already present (no fade/slide). It holds
      // still for 300ms, then over ~1.7s gently pitches forward, grows, and the
      // camera pushes in — like a jeweler tilting a ring toward you so the
      // diamond catches the light. It only owns the ring until the first scroll.
      if (!card) {
        const hero = RING_STATES[0];
        gsap.fromTo(
          ringState,
          {
            rotX: 0.18, // ~10° — only lightly tilted, diamond just peeking
            scale: 1.3,
            camZ: 4.0, // sat a touch deeper in the scene
          },
          {
            rotX: hero.rotX, // ~26° presentation pose — the tilt is the main motion
            scale: hero.scale,
            camZ: hero.camZ,
            duration: 1.7,
            delay: 0.3,
            ease: "power3.out",
            overwrite: "auto",
          },
        );
      }

      // Panel content reveals
      gsap.utils.toArray<HTMLElement>("[data-panel]").forEach((panel) => {
        const items = panel.querySelectorAll<HTMLElement>("[data-reveal]");
        gsap.fromTo(
          items,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: panel,
              start: "top 75%",
              end: "top 35%",
              scrub: 1,
            },
          },
        );
        gsap.to(panel, {
          opacity: 0,
          y: -30,
          ease: "power2.in",
          scrollTrigger: {
            trigger: panel,
            start: "bottom 60%",
            end: "bottom 20%",
            scrub: 1,
          },
        });
      });

      // Story progress bar
      const bar = document.querySelector<HTMLElement>("[data-progress]");
      const storyEl = document.querySelector<HTMLElement>("[data-section='story']");
      if (bar && storyEl) {
        gsap.fromTo(
          bar,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: { trigger: storyEl, start: "top center", end: "bottom center", scrub: true },
          },
        );
      }
    }, root);

    // Card auto-play: ping-pong the page scroll top→bottom→top so the thumbnail
    // shows the entire scroll journey (the ring timeline + reveals follow along).
    if (card) {
      const easeInOut = (t: number) =>
        t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      const DUR = 9000; // ms for one top→bottom sweep
      const HOLD = 900; // pause at each end
      const startT = performance.now();
      const loop = (now: number) => {
        const max = document.body.scrollHeight - window.innerHeight;
        const cycle = DUR * 2 + HOLD * 2;
        let t = (now - startT) % cycle;
        let p: number;
        if (t < HOLD) p = 0;
        else if ((t -= HOLD) < DUR) p = easeInOut(t / DUR);
        else if ((t -= DUR) < HOLD) p = 1;
        else p = easeInOut(1 - (t - HOLD) / DUR);
        window.scrollTo(0, p * max);
        ScrollTrigger.update();
        cardRaf = requestAnimationFrame(loop);
      };
      cardRaf = requestAnimationFrame(loop);
    }

    return () => {
      ctx.revert();
      cancelAnimationFrame(cardRaf);
      if (lenis) {
        gsap.ticker.remove(tick);
        lenis.destroy();
      }
    };
  }, []);

  return (
    <div className={`gradient-bg relative w-full transition-colors duration-700 ${isLight ? "text-gray-900" : "text-white"}`}>
      <TopNav />

      <div ref={root} className="relative w-full">
        {/* Sticky 3D ring layer — scrolls away after the cinematic journey */}
        <div className="pointer-events-none sticky top-0 h-screen w-full z-10">
          {mounted && (
            <Suspense fallback={null}>
              <RingCanvas />
            </Suspense>
          )}
        </div>

        <div className="relative z-20 -mt-[100vh]">
          {/* ============ HERO ============ */}
          <section
            data-section="hero"
            className="relative flex h-screen items-center justify-center px-4 md:px-8"
          >
        <GlassPanel>
          <div className="relative z-20 flex h-full flex-col justify-end gap-5 p-6 pb-2 translate-y-[6vh] md:translate-y-0 md:p-12 md:pb-10">
            {/* Main headline block */}
            <div data-reveal>
              <div className="mb-3 text-[10px] uppercase tracking-[0.28em] text-white/60">
                The Eternal Series · No. 01
              </div>
              <h1 className="font-display text-[13vw] leading-[0.88] tracking-tight md:text-[6.5vw]">
                WORN
                <br />
                <span className="italic font-normal text-white/85">for life</span>
              </h1>
            </div>

            {/* Description + CTA */}
            <div data-reveal className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <p className="max-w-xs text-[10px] uppercase leading-relaxed tracking-[0.18em] text-white/65">
                Shaped by hand, finished by light — a quiet study of weight, patience, and permanence.
              </p>
              <PreOrderButton />
            </div>

            {/* Bottom bar */}
            <div className="flex items-center justify-between border-t border-white/10 pt-4 text-[10px] uppercase tracking-[0.24em] text-white/50" data-reveal>
              <span>Scroll to explore more</span>
              <span>001 / 006</span>
            </div>
          </div>
        </GlassPanel>
      </section>

      {/* ============ EXPLORE ANGLE ============ */}
      <section
        data-section="angle"
        className="relative z-20 flex h-screen items-center justify-center px-4 md:px-8"
      >
        <GlassPanel>
          <div className="flex h-full flex-col gap-6 p-6 md:grid md:grid-cols-2 md:gap-8 md:p-12">
            <div className="flex flex-col justify-between" data-reveal>
              <div className="text-[10px] uppercase tracking-[0.28em] text-white/60">
                One stone, set to
                <br />
                catch every angle
              </div>
              <h2 className="font-display text-[10vw] leading-[0.9] tracking-tight md:text-[3.6vw]">
                SEE IT
                <br />
                FROM EVERY SIDE
                <br />
                <span className="italic font-normal text-white/80 text-[7.5vw] md:text-[2.6vw]">
                  where the light lives
                </span>
              </h2>
              <div className="text-[10px] uppercase tracking-[0.24em] text-white/55">
                002 / 006
              </div>
            </div>
            <div className="flex flex-col justify-end gap-3 text-right" data-reveal>
              <div className="text-[10px] uppercase tracking-[0.24em] text-white/55">The Stone</div>
              <div className="font-display text-xl md:text-3xl">Round Brilliant — 1.84 ct</div>
              <div className="text-[10px] uppercase tracking-[0.24em] text-white/55">
                D colour · IF clarity · Triple Excellent
              </div>
            </div>
          </div>
        </GlassPanel>
      </section>

      {/* ============ TRANSCENDING ============ */}
      <section
        data-section="transcending"
        className="relative z-20 flex h-screen items-center justify-center px-4 md:px-8"
      >
        <GlassPanel>
          <div className="grid h-full grid-cols-1 p-0 md:grid-cols-5">
            <div className="hidden md:col-span-2 md:block" />
            <div className="col-span-1 flex flex-col justify-between bg-white p-6 text-black md:col-span-3 md:p-12" data-reveal>
              <div className="text-[10px] uppercase tracking-[0.24em] text-black/55">
                The light has only
                <br />
                begun to travel
              </div>
              <div>
                <h3 className="font-display text-3xl leading-[0.95] md:text-5xl">
                  BEYOND
                  <br />
                  THE EXPECTED
                  <br />
                  <span className="italic font-normal">ordinary</span>
                </h3>
                <p className="mt-4 max-w-sm text-[10px] uppercase leading-relaxed tracking-[0.18em] text-black/65">
                  Every surface is considered — the way it turns, the way it catches, the way it holds a room's light and gives it back.
                </p>
              </div>
              <div className="flex items-center justify-between">
                <PreOrderButton dark />
                <span className="text-[10px] uppercase tracking-[0.24em] text-black/55">003 / 006</span>
              </div>
            </div>
          </div>
        </GlassPanel>
      </section>

      {/* ============ STORY ============ */}
      <section
        data-section="story"
        className="relative z-20 flex h-screen items-center justify-center px-4 md:px-8"
      >
        <GlassPanel>
          <div className="flex h-full flex-col p-6 md:p-12">
            <div className="relative h-[2px] w-full bg-white/15">
              <div data-progress className="absolute inset-y-0 left-0 w-full origin-left bg-white" />
            </div>
            <div className="mt-8 flex flex-1 items-center" data-reveal>
              <p
                className="font-display text-[5.5vw] leading-[1.2] tracking-tight text-white md:text-[1.9vw]"
                style={{ textAlign: "justify" }}
              >
                A ring is never only a ring. It carries the story of how you arrived, the taste that is yours alone, the quiet confidence you wear without a word. Each time it catches the light, it tells a little more of it — a small, permanent record of who you are.
              </p>
            </div>
            <div className="flex items-end justify-between text-[10px] uppercase tracking-[0.24em] text-white/55">
              <span>The Manifesto</span>
              <span>004 / 006</span>
            </div>
          </div>
        </GlassPanel>
      </section>

      {/* ============ CLUSTER / ETERNAL ============ */}
      <section
        data-section="cluster"
        className="relative z-20 flex h-screen items-center justify-center px-4 md:px-8"
      >
        <GlassPanel>
          <div className="flex h-full flex-col justify-between p-6 md:p-12">
            <div className="flex justify-between text-[10px] uppercase tracking-[0.24em] text-white/60" data-reveal>
              <span>
                Shaped by patient hands
                <br />
                refusing the ordinary
              </span>
              <span className="text-right">
                One design
                <br />
                reflected six ways
              </span>
            </div>
            <div className="ml-auto max-w-md text-right" data-reveal>
              <h3 className="font-display text-3xl leading-tight md:text-5xl">
                LET IT BE
                <br />
                <span className="italic font-normal">your forever</span>
              </h3>
              <div className="mt-5 flex justify-end">
                <PreOrderButton />
              </div>
            </div>
            <div className="flex items-end justify-between text-[10px] uppercase tracking-[0.24em] text-white/55" data-reveal>
              <span>
                Lose an afternoon
                <br />
                to the way it
                <br />
                catches light
              </span>
              <span>005 / 006</span>
            </div>
          </div>
        </GlassPanel>
      </section>

      {/* ============ RETURN ============ */}
      <section
        data-section="return"
        className="relative z-20 flex h-screen items-center justify-center px-4 md:px-8"
      >
        <GlassPanel>
          <div className="flex h-full w-full flex-col items-start justify-center gap-6 p-6 text-left md:max-w-[52%] md:gap-8 md:p-12">
            <div className="text-[10px] uppercase tracking-[0.28em] text-white/60" data-reveal>
              A circle, returned
            </div>
            <h1 className="font-display text-[15vw] leading-[0.85] tracking-tight md:text-[6.5vw]" data-reveal>
              WORN
              <br />
              <span className="italic font-normal text-white/85">for life</span>
            </h1>
            <div data-reveal>
              <PreOrderButton />
            </div>
            <div className="text-[10px] uppercase tracking-[0.24em] text-white/55" data-reveal>
              006 / 006
            </div>
          </div>
        </GlassPanel>
      </section>
      </div>
      </div>

      {/* ============ PRODUCTS ============ */}
      <section
        data-section="products"
        className="relative z-30 mx-auto max-w-7xl px-6 py-24 md:px-12 md:py-32"
      >
        <div className="mb-16 text-center">
          <div className="mb-4 text-[10px] uppercase tracking-[0.28em] opacity-60">
            The Collection
          </div>
          <h2 className="font-display text-4xl leading-[0.9] tracking-tight md:text-5xl">
            CURATED FOR
            <br />
            <span className="italic font-normal opacity-80">eternity</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <div key={product.id} className="group relative">
              <div className={`overflow-hidden aspect-[3/4] w-full bg-cover bg-center ${isLight ? "border-amber-900/10" : "border-white/10"} border`}>
                <div 
                  className="h-full w-full bg-cover bg-center transition-transform duration-1000 ease-out group-hover:scale-110" 
                  style={{ backgroundImage: `url('${product.image}')` }} 
                />
              </div>
              
              <div className="mt-5 flex flex-col gap-1 text-center">
                <h3 className="font-display text-xl tracking-wide">{product.name}</h3>
                <p className="text-[10px] uppercase tracking-[0.24em] opacity-60">{product.description}</p>
                <p className="mt-2 text-sm font-medium opacity-80">{product.price}</p>
              </div>

              <div className="mt-6 flex justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <AddToCartButton 
                  dark={isLight} 
                  onClick={() => addToCart({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image
                  })} 
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ ABOUT US ============ */}
      <section
        data-section="about"
        className={`relative z-30 mx-auto max-w-7xl px-6 py-24 md:px-12 md:py-32 border-t ${isLight ? "border-amber-900/10" : "border-white/10"}`}
      >
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 items-center">
          <div>
            <div className="mb-4 text-[10px] uppercase tracking-[0.28em] opacity-60">
              Our Story
            </div>
            <h2 className="font-display text-4xl leading-[0.9] tracking-tight md:text-5xl mb-8">
              SHAPED BY HAND,
              <br />
              <span className="italic font-normal opacity-80">finished by light.</span>
            </h2>
            <div className="flex flex-col gap-6 text-[13px] leading-relaxed tracking-[0.05em] opacity-80 md:text-sm">
              <p>
                Aurelle was founded on a singular belief: true luxury does not shout; it waits to be noticed. We approach jewelry making not as manufacturing, but as sculpture. Every facet, every prong, and every band is considered for how it will interact with the world around it.
              </p>
              <p>
                Our artisans spend hundreds of hours refining a single design, stripping away the unnecessary until only the essential remains. We do this because a piece of jewelry is never just an object. It is a permanent record of a moment, a person, a life.
              </p>
            </div>
          </div>
          <div className="flex justify-end">
            <div className={`aspect-[4/3] w-full max-w-lg bg-cover bg-center ${isLight ? "border-amber-900/10" : "border-white/10"} border`} style={{ backgroundImage: "url('/products/eternity-band.jpg')" }} />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function GlassPanel({ children }: { children: React.ReactNode }) {
  // Invisible layout container — keeps the section bounds, the reveal-animation
  // hook (data-panel) and pointer events, but no visible box (no border, glass
  // background, blur or shadow). Content sits directly on the dark page.
  return (
    <div
      data-panel
      className="pointer-events-auto relative h-[82vh] w-[95vw] max-w-[1280px] md:h-[78vh] md:w-[92vw]"
    >
      {children}
    </div>
  );
}
