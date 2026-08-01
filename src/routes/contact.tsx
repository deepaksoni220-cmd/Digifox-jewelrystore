import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";
import { TopNav } from "@/components/site/TopNav";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/contact")({
  component: Contact,
});

function Contact() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <div className={`min-h-screen transition-colors duration-700 ${isLight ? "bg-[#f5f2eb] text-gray-900" : "bg-[#050505] text-white"}`}>
      <TopNav />
      <main className="mx-auto max-w-4xl px-6 pt-32 pb-20 md:px-12 md:pt-40">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-12">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-center"
          >
            <div className="mb-4 text-[10px] uppercase tracking-[0.28em] text-current opacity-60">
              Private Appointments
            </div>
            <h1 className="mb-8 font-display text-4xl leading-[0.9] tracking-tight md:text-5xl">
              CONNECT
              <br />
              <span className="italic font-normal opacity-80">with our atelier</span>
            </h1>
            <p className="mb-10 max-w-sm text-[13px] leading-relaxed tracking-[0.05em] opacity-80 md:text-sm">
              Whether you wish to commission a bespoke piece, request a private viewing, or inquire about our signature collections, our dedicated consultants are at your service.
            </p>
            
            <div className="flex flex-col gap-4 text-[11px] uppercase tracking-[0.2em] opacity-70">
              <div>
                <span className="block opacity-50">Email</span>
                <a href="mailto:atelier@aurelle.com" className="hover:opacity-100 transition-opacity">atelier@aurelle.com</a>
              </div>
              <div>
                <span className="block opacity-50">Boutique</span>
                <span>12 Place Vendôme, Paris</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <form className={`flex flex-col gap-6 p-8 md:p-10 ${isLight ? "bg-white/50 border border-amber-900/10" : "bg-white/5 border border-white/10"}`}>
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-[10px] uppercase tracking-[0.2em] opacity-60">Full Name</label>
                <input 
                  type="text" 
                  id="name" 
                  className={`border-b bg-transparent px-0 py-2 text-sm outline-none transition-colors focus:border-current ${isLight ? "border-amber-900/20" : "border-white/20"}`}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-[10px] uppercase tracking-[0.2em] opacity-60">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  className={`border-b bg-transparent px-0 py-2 text-sm outline-none transition-colors focus:border-current ${isLight ? "border-amber-900/20" : "border-white/20"}`}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-[10px] uppercase tracking-[0.2em] opacity-60">Inquiry</label>
                <textarea 
                  id="message" 
                  rows={4}
                  className={`resize-none border-b bg-transparent px-0 py-2 text-sm outline-none transition-colors focus:border-current ${isLight ? "border-amber-900/20" : "border-white/20"}`}
                />
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  className={`inline-flex items-center justify-center border px-7 py-3 text-[10px] uppercase tracking-[0.22em] transition-colors ${
                    isLight
                      ? "border-black bg-black text-white hover:bg-transparent hover:text-black"
                      : "border-white bg-white text-black hover:bg-transparent hover:text-white"
                  }`}
                >
                  Send Inquiry
                </button>
              </div>
            </form>
          </motion.div>

        </div>

        {/* Google Maps Embed */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20 md:mt-32 w-full h-[400px] overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000"
        >
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.536768341645!2d2.3274291775836473!3d48.86705030008581!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e31c79e6bc5%3A0xc6c76472cf725208!2sPlace%20Vend%C3%B4me%2C%2075001%20Paris%2C%20France!5e0!3m2!1sen!2sus!4v1714073356123!5m2!1sen!2sus" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen={false} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
