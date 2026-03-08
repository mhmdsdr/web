"use client";

import { X, Trash2, Ticket, CheckCircle, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useState } from "react";

export function CartSlideOver() {
    const {
        items, isCartOpen, closeCart, removeItem, updateQuantity,
        subtotal, cartTotal, discountPercent, couponCode, applyCoupon, removeCoupon
    } = useCart();
    const router = useRouter();

    const [couponInput, setCouponInput] = useState("");
    const [isApplying, setIsApplying] = useState(false);
    const [error, setError] = useState("");

    const handleApply = async () => {
        if (!couponInput.trim()) return;
        setIsApplying(true);
        setError("");
        const result = await applyCoupon(couponInput);
        if (!result.success) {
            setError(result.error || "كود غير صالح");
        } else {
            setCouponInput("");
        }
        setIsApplying(false);
    };

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
                            <ShoppingBag className="w-12 h-12 mb-4 opacity-20" />
                            <p className="text-lg">سلة التسوق فارغة</p>
                        </div>
                    ) : (
                        items.map(item => (
                            <div key={item.id} className="flex gap-4 p-3 bg-cream dark:bg-gray-800 rounded-xl">
                                <div className="w-16 h-24 bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center text-gray-400 text-xs">
                                    {item.coverImage ? (
                                        <img src={item.coverImage} className="w-full h-full object-cover" alt={item.title} />
                                    ) : (
                                        "غلاف"
                                    )}
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
                        {/* Coupon Section */}
                        <div className="pb-3 border-b border-gray-100 dark:border-gray-800">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={couponInput}
                                    onChange={e => setCouponInput(e.target.value)}
                                    placeholder="كود الخصم (مثل: SAVE10)"
                                    disabled={discountPercent > 0}
                                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-gold bg-gray-50 dark:bg-gray-800 uppercase font-mono disabled:opacity-50"
                                />
                                <button
                                    onClick={handleApply}
                                    disabled={isApplying || !couponInput.trim() || discountPercent > 0}
                                    className="px-4 py-2 bg-navy text-white text-xs font-bold rounded-xl hover:bg-gold disabled:opacity-50 transition-colors"
                                >
                                    {isApplying ? "..." : (discountPercent > 0 ? "تم" : "تحقق")}
                                </button>
                            </div>
                            {error && <p className="text-red-500 text-[10px] mt-1 font-bold">{error}</p>}
                            {discountPercent > 0 && (
                                <div className="flex items-center justify-between mt-1">
                                    <p className="text-green-600 text-[10px] font-bold flex items-center gap-1">
                                        <CheckCircle className="w-3 h-3" />
                                        خصم {discountPercent}% مفعّل ({couponCode})
                                    </p>
                                    <button onClick={removeCoupon} className="text-[10px] text-gray-400 hover:text-red-500 underline">إلغاء</button>
                                </div>
                            )}
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">المجموع الفرعي</span>
                                <span className="font-semibold">{subtotal.toLocaleString("ar-IQ")} د.ع</span>
                            </div>
                            {discountPercent > 0 && (
                                <div className="flex justify-between items-center text-sm text-green-600">
                                    <span>الخصم ({discountPercent}%)</span>
                                    <span dir="ltr">-{(subtotal * (discountPercent / 100)).toLocaleString("ar-IQ")} د.ع</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center pt-1">
                                <span className="font-bold text-navy dark:text-cream">الإجمالي</span>
                                <span className="text-xl font-black text-navy dark:text-cream">{cartTotal.toLocaleString("ar-IQ")} د.ع</span>
                            </div>
                        </div>

                        {/* Link to full cart page */}
                        <Link
                            href="/cart"
                            onClick={closeCart}
                            className="block text-center text-[10px] font-bold text-navy hover:text-gold transition-colors"
                        >
                            عرض السلة بالتفصيل
                        </Link>

                        {/* Button 2: Proceed to Checkout */}
                        <button
                            onClick={handleCheckout}
                            className="w-full py-4 bg-navy hover:bg-gold text-white rounded-2xl font-black transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
                        >
                            متابعة الشراء
                            <ArrowRight className="w-5 h-5 rotate-180" />
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}

// Dummy ShoppingBag icon if not imported
function ShoppingBag({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
    )
}
