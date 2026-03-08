"use client";

import { X, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export function CartSlideOver() {
    const { items, isCartOpen, closeCart, removeItem, updateQuantity, cartTotal } = useCart();
    const router = useRouter();

    const handleCheckout = () => {
        closeCart();
        router.push("/checkout");
    };

    return (
        <>
            <div
                className={`fixed inset-0 bg-navy/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${isCartOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                onClick={closeCart}
            />
            <div
                className={`fixed inset-y-0 left-0 z-50 w-full md:w-96 bg-background shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col ${isCartOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                    <span className="text-xl font-bold text-navy dark:text-cream">ملخص الطلب</span>
                    <button
                        onClick={closeCart}
                        className="p-2 text-gray-500 hover:text-gold transition-colors focus:outline-none"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                            <p className="text-lg">سلة التسوق فارغة</p>
                        </div>
                    ) : (
                        items.map(item => (
                            <div key={item.id} className="flex gap-4 p-3 bg-cream dark:bg-gray-800 rounded-xl">
                                <div className="w-16 h-24 bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center text-gray-400 text-xs">
                                    غلاف
                                </div>
                                <div className="flex flex-col justify-between flex-1">
                                    <div>
                                        <h4 className="font-bold text-navy dark:text-cream line-clamp-1">{item.title}</h4>
                                        <span className="text-sm text-gray-500 line-clamp-1">{item.author}</span>
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="font-bold text-gold">{item.price.toLocaleString("ar-IQ")} د.ع</span>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-navy dark:text-cream hover:bg-gold hover:text-white transition-colors"
                                            >-</button>
                                            <span className="w-4 text-center text-sm">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-navy dark:text-cream hover:bg-gold hover:text-white transition-colors"
                                            >+</button>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="p-1 mr-2 text-red-500 hover:text-red-700 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {items.length > 0 && (
                    <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 space-y-3">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-gray-500">المجموع التقديري</span>
                            <span className="text-xl font-bold text-navy dark:text-cream">{cartTotal.toLocaleString("ar-IQ")} د.ع</span>
                        </div>

                        {/* Link to full cart page */}
                        <Link
                            href="/cart"
                            onClick={closeCart}
                            className="block text-center text-xs font-bold text-navy hover:text-gold transition-colors mb-2"
                        >
                            عرض السلة بالتفصيل وتطبيق كوبون الخصم
                        </Link>

                        {/* Button 2: Proceed to Checkout */}
                        <button
                            onClick={handleCheckout}
                            className="w-full py-3.5 bg-navy hover:bg-gold text-white rounded-xl font-bold transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                        >
                            متابعة الشراء
                        </button>

                        {/* Button 1: Continue Shopping */}
                        <button
                            onClick={() => {
                                closeCart();
                                router.push("/");
                            }}
                            className="w-full py-3 bg-white border-2 border-navy/10 hover:border-gold hover:bg-gold/5 text-navy dark:text-cream rounded-xl font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                            إكمال التسوق
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
