import { BookOpen, Search, ShoppingCart, Menu } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

interface NavbarProps {
    onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
    const { openCart, cartItemCount } = useCart();

    return (
        <nav className="sticky top-0 z-40 w-full shadow-sm backdrop-blur-md transition-all border-b border-white/20"
            style={{ backgroundColor: "rgba(184, 217, 240, 0.9)" }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 sm:h-20">

                    {/* Right side: Menu & Logo */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        <button
                            onClick={onMenuClick}
                            className="p-2 hover:text-gold transition-colors focus:outline-none"
                            style={{ color: "#1A3550" }}
                            aria-label="Open Menu"
                        >
                            <Menu className="w-5 h-5 sm:w-6 h-6" />
                        </button>
                        <Link href="/" className="flex items-center gap-1.5 sm:gap-2 hover:opacity-80 transition-opacity" style={{ color: "#1A3550" }}>
                            <BookOpen className="w-6 h-6 sm:w-8 h-8 text-gold" />
                            <span className="text-xl sm:text-2xl font-black tracking-tight">تسواهن</span>
                        </Link>
                    </div>

                    {/* Middle: Search bar */}
                    <div className="hidden md:flex flex-1 max-w-md mx-8">
                        <div className="relative w-full">
                            <div className="absolute inset-y-0 right-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 mr-3" style={{ color: "#2A6EA6" }} />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-3 pr-10 py-2 border rounded-full leading-5 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-colors sm:text-sm"
                                style={{
                                    backgroundColor: "rgba(255,255,255,0.6)",
                                    borderColor: "#B8D9F0",
                                    color: "#1A3550",
                                }}
                                placeholder="ابحث عن كتاب أو مؤلف..."
                            />
                        </div>
                    </div>

                    {/* Left side: Cart */}
                    <div className="flex items-center">
                        <button
                            onClick={openCart}
                            className="relative p-2 hover:text-gold transition-colors focus:outline-none"
                            style={{ color: "#1A3550" }}
                            aria-label="Shopping Cart"
                        >
                            <ShoppingCart className="w-6 h-6" />
                            {cartItemCount > 0 && (
                                <span className="absolute top-0 left-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-gold rounded-full">
                                    {cartItemCount}
                                </span>
                            )}
                        </button>
                    </div>

                </div>
            </div>
        </nav>
    );
}
