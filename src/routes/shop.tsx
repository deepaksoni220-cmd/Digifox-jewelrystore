import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";
import { TopNav, PreOrderButton } from "@/components/site/TopNav";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/shop")({
  component: Shop,
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

function Shop() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <div className={`min-h-screen transition-colors duration-700 ${isLight ? "bg-[#f5f2eb] text-gray-900" : "bg-[#050505] text-white"}`}>
      <TopNav />
      <main className="mx-auto max-w-7xl px-6 pt-32 pb-20 md:px-12 md:pt-40">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 text-center md:mb-24"
        >
          <div className="mb-4 text-[10px] uppercase tracking-[0.28em] text-current opacity-60">
            The Collection
          </div>
          <h1 className="font-display text-4xl leading-[0.9] tracking-tight md:text-6xl">
            CURATED FOR
            <br />
            <span className="italic font-normal opacity-80">eternity</span>
          </h1>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-4"
        >
          {products.map((product) => (
            <motion.div key={product.id} variants={itemVariants} className="group relative">
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
                <PreOrderButton dark={isLight} />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
