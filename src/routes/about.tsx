import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";
import { TopNav } from "@/components/site/TopNav";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <div className={`min-h-screen transition-colors duration-700 ${isLight ? "bg-[#f5f2eb] text-gray-900" : "bg-[#050505] text-white"}`}>
      <TopNav />
      <main className="mx-auto max-w-4xl px-6 pt-32 pb-20 md:px-12 md:pt-48">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mb-4 text-[10px] uppercase tracking-[0.28em] text-current opacity-60">
            Our Story
          </div>
          <h1 className="font-display text-5xl leading-[0.9] tracking-tight md:text-7xl">
            SHAPED BY HAND,
            <br />
            <span className="italic font-normal opacity-80">finished by light.</span>
          </h1>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-12 md:mt-24 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-6 text-[13px] leading-relaxed tracking-[0.05em] opacity-80 md:text-sm"
          >
            <p>
              Aurelle was founded on a singular belief: true luxury does not shout; it waits to be noticed. We approach jewelry making not as manufacturing, but as sculpture. Every facet, every prong, and every band is considered for how it will interact with the world around it.
            </p>
            <p>
              Our artisans spend hundreds of hours refining a single design, stripping away the unnecessary until only the essential remains. We do this because a piece of jewelry is never just an object. It is a permanent record of a moment, a person, a life.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={`aspect-[3/4] w-full bg-cover bg-center ${isLight ? "border-amber-900/10" : "border-white/10"} border`} style={{ backgroundImage: "url('/products/solitaire-ring.jpg')" }} />
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
