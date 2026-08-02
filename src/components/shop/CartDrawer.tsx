import { useCart } from "@/contexts/CartContext";
import { useTheme } from "@/hooks/useTheme";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";

export function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    cartTotal,
    clearCart,
  } = useCart();
  const { theme } = useTheme();
  const isLight = theme === "light";
  
  // Local state for animation
  const [shouldRender, setRender] = useState(isCartOpen);

  useEffect(() => {
    if (isCartOpen) setRender(true);
  }, [isCartOpen]);

  const onAnimationEnd = () => {
    if (!isCartOpen) setRender(false);
  };

  // Prevent scrolling when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCartOpen]);

  if (!shouldRender) return null;

  const handleCheckout = () => {
    if (items.length === 0) return;
    toast.success("Order placed successfully!", {
      description: "Thank you for shopping with Aurelle.",
    });
    clearCart();
    setIsCartOpen(false);
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex justify-end"
      onAnimationEnd={onAnimationEnd}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-500 ${
          isCartOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div
        className={`relative w-full max-w-md h-full flex flex-col shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        } ${isLight ? "bg-white text-gray-900" : "bg-zinc-950 text-white"}`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-5 border-b ${
            isLight ? "border-gray-200" : "border-zinc-800"
          }`}
        >
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            <h2 className="font-display text-xl tracking-tight">Your Cart</h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className={`p-2 rounded-full transition-colors ${
              isLight ? "hover:bg-gray-100" : "hover:bg-zinc-800"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-50 space-y-4">
              <ShoppingBag className="w-12 h-12" />
              <p className="text-sm uppercase tracking-widest">
                Your cart is empty
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 group">
                  <div
                    className={`w-24 h-24 rounded-sm flex-shrink-0 overflow-hidden bg-gray-100 ${
                      isLight ? "" : "opacity-90"
                    }`}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover mix-blend-multiply"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <h3 className="font-medium text-sm leading-snug pr-4">{item.name}</h3>
                      <p className="text-xs opacity-70 mt-1">{item.price}</p>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div
                        className={`flex items-center border rounded-sm ${
                          isLight ? "border-gray-300" : "border-zinc-700"
                        }`}
                      >
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="px-2 py-1 opacity-70 hover:opacity-100 transition-opacity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-medium min-w-[1.5rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="px-2 py-1 opacity-70 hover:opacity-100 transition-opacity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-[10px] uppercase tracking-wider underline opacity-0 group-hover:opacity-60 hover:!opacity-100 transition-opacity"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className={`p-6 border-t ${
            isLight ? "border-gray-200" : "border-zinc-800"
          }`}
        >
          <div className="flex justify-between items-center mb-6">
            <span className="text-xs uppercase tracking-[0.2em] font-medium opacity-80">
              Total
            </span>
            <span className="font-display text-2xl">
              ${cartTotal.toFixed(2)}
            </span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={items.length === 0}
            className={`w-full py-4 text-xs uppercase tracking-[0.2em] transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              isLight
                ? "bg-black text-white hover:bg-gray-800"
                : "bg-white text-black hover:bg-gray-200"
            }`}
          >
            {items.length === 0 ? "Cart is empty" : "Checkout"}
          </button>
        </div>
      </div>
    </div>
  );
}
