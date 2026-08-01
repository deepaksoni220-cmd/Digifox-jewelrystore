import { Link } from "@tanstack/react-router";
import { useTheme } from "@/hooks/useTheme";

export function Footer() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <footer className={`border-t py-12 px-6 md:px-12 md:py-16 ${isLight ? "border-amber-900/10 text-gray-800" : "border-white/10 text-white"}`}>
      <div className="mx-auto max-w-7xl grid grid-cols-1 gap-12 md:grid-cols-4">
        
        <div className="flex flex-col gap-4 md:col-span-1">
          <div className="font-display text-2xl italic tracking-tight">
            Aurelle
          </div>
          <p className="text-[11px] uppercase tracking-[0.2em] opacity-60">
            Shaped by hand.<br />Finished by light.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="text-[10px] uppercase tracking-[0.2em] opacity-60">Explore</h4>
          <nav className="flex flex-col gap-3 text-[12px] uppercase tracking-[0.15em] opacity-80">
            <Link to="/" className="hover:opacity-100 transition-opacity">Home</Link>
            <Link to="/shop" className="hover:opacity-100 transition-opacity">Shop</Link>
            <Link to="/about" className="hover:opacity-100 transition-opacity">About</Link>
          </nav>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="text-[10px] uppercase tracking-[0.2em] opacity-60">Client Care</h4>
          <nav className="flex flex-col gap-3 text-[12px] uppercase tracking-[0.15em] opacity-80">
            <Link to="/contact" className="hover:opacity-100 transition-opacity">Contact Us</Link>
            <a href="#" className="hover:opacity-100 transition-opacity">Shipping & Returns</a>
            <a href="#" className="hover:opacity-100 transition-opacity">Care Guide</a>
          </nav>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="text-[10px] uppercase tracking-[0.2em] opacity-60">Boutique</h4>
          <div className="flex flex-col gap-3 text-[12px] tracking-[0.05em] opacity-80">
            <p>12 Place Vendôme<br />75001 Paris, France</p>
            <a href="mailto:atelier@aurelle.com" className="hover:opacity-100 transition-opacity uppercase tracking-[0.15em]">atelier@aurelle.com</a>
          </div>
        </div>

      </div>
      
      <div className={`mt-16 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] uppercase tracking-[0.2em] opacity-40 ${isLight ? "border-amber-900/10" : "border-white/10"}`}>
        <p>&copy; {new Date().getFullYear()} Aurelle Diamond Jewelry. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:opacity-100 transition-opacity">Privacy Policy</a>
          <a href="#" className="hover:opacity-100 transition-opacity">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
