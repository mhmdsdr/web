"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { Trash2, ShoppingBag, ArrowRight, Ticket, CheckCircle, BookOpen } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";

export default function CartPage() {
    const {
        items, removeItem, updateQuantity, clearCart,
        subtotal, cartTotal, discountPercent, couponCode, applyCoupon, removeCoupon
    } = useCart();
    const router = useRouter();

    // Local UI states
    const [couponInput, setCouponInput] = useState("");
    const [couponError, setCouponError] = useState("");
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

    const handleApplyCoupon = async () => {
        if (!couponInput.trim()) return;
        setIsApplyingCoupon(true);
        setCouponError("");
        const result = await applyCoupon(couponInput);
        if (!result.success) {
            setCouponError(result.error || "كود غير صحيح");
        } else {
            setCouponInput("");
            setCouponError("");
        }
        setIsApplyingCoupon(false);
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-background pb-20">
                <Navbar onMenuClick={() => { }} />
                <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                    <div className="bg-white dark:bg-gray-900 rounded-3xl p-12 shadow-sm border border-gray-100 dark:border-gray-800 max-w-lg mx-auto">
                        <ShoppingBag className="w-16 h-16 mx-auto mb-6 text-gray-200" />
                        <h1 className="text-3xl font-black text-navy dark:text-cream mb-4">سلة التسوق فارغة</h1>
                        <p className="text-gray-500 mb-8 leading-relaxed">يبدو أنك لم تضف أي كتب إلى سلتك بعد. اكتشف أروع الإصدارات وابدأ رحلتك في القراءة!</p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 bg-navy text-white px-10 py-4 rounded-2xl font-bold hover:bg-gold transition-all shadow-lg shadow-navy/10 active:scale-95"
                        >
                            <BookOpen className="w-5 h-5" />
                            تصفح الكتب الآن
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black pb-20">
            <Navbar onMenuClick={() => { }} />

            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="flex items-center gap-4 mb-10">
                    <h1 className="text-4xl font-black text-navy dark:text-cream">سلة التسوق</h1>
                    <span className="bg-navy text-white text-sm px-3 py-1 rounded-full font-bold">
                        {items.length} {items.length === 1 ? 'منتج' : 'منتجات'}
                    </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Items List */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item) => (
                            <div key={item.id} className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row gap-6 items-center">
                                {/* Book Cover Placeholder */}
                                <div className="w-24 h-36 bg-cream dark:bg-gray-800 rounded-xl overflow-hidden shadow-md flex-shrink-0 flex items-center justify-center text-gray-400 font-bold text-sm">
                                    {item.coverImage ? (
                                        <img src={item.coverImage} className="w-full h-full object-cover" alt={item.title} />
                                    ) : (
                                        "غلاف"
                                    )}
                                </div>

                                <div className="flex-1 text-center sm:text-right">
                                    <h3 className="text-xl font-black text-navy dark:text-cream mb-1">{item.title}</h3>
                                    <p className="text-gray-500 text-sm mb-4">{item.author}</p>
                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
                                        <span className="text-gold font-black text-lg">
                                            {item.price.toLocaleString("ar-IQ")} د.ع
                                        </span>
                                        <div className="h-4 w-[1px] bg-gray-200 hidden sm:block" />
                                        <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 p-1.5 rounded-full border border-gray-100 dark:border-gray-700">
                                            <button
                                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                className="w-10 h-10 rounded-full bg-white dark:bg-gray-700 shadow-sm flex items-center justify-center hover:bg-gold hover:text-white transition-all text-xl"
                                            >-</button>
                                            <span className="w-8 text-center font-black">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-10 h-10 rounded-full bg-white dark:bg-gray-700 shadow-sm flex items-center justify-center hover:bg-gold hover:text-white transition-all text-xl"
                                            >+</button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center sm:items-end gap-3 sm:ml-4">
                                    <span className="text-navy dark:text-cream font-black text-xl">
                                        {(item.price * item.quantity).toLocaleString("ar-IQ")} د.ع
                                    </span>
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="p-3 text-red-500 hover:bg-red-50 rounded-2xl transition-all active:scale-90"
                                    >
                                        <Trash2 className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                        ))}

                        <button
                            onClick={clearCart}
                            className="text-gray-400 hover:text-red-500 text-sm font-bold flex items-center gap-2 pr-4 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                            مسح السلة بالكامل
                        </button>
                    </div>

                    {/* Summary */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 shadow-xl border border-gray-100 dark:border-gray-800 sticky top-24">
                            <h2 className="text-2xl font-black text-navy dark:text-cream mb-8">ملخص الحساب</h2>

                            {/* Coupon Input */}
                            <div className="mb-8">
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 pr-2">كود الخصم</label>
                                <div className="flex gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 focus-within:border-gold transition-colors">
                                    <input
                                        type="text"
                                        placeholder="SALE20"
                                        value={discountPercent > 0 ? couponCode : couponInput}
                                        onChange={(e) => setCouponInput(e.target.value)}
                                        className="flex-1 bg-transparent border-none focus:outline-none px-2 font-mono uppercase font-bold disabled:opacity-50"
                                        disabled={discountPercent > 0}
                                    />
                                    {discountPercent > 0 ? (
                                        <button
                                            onClick={removeCoupon}
                                            className="bg-red-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-red-600 transition-all"
                                        >
                                            إزالة
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleApplyCoupon}
                                            disabled={isApplyingCoupon || !couponInput.trim()}
                                            className="bg-navy text-white px-6 py-2 rounded-xl font-bold hover:bg-gold transition-all disabled:opacity-50"
                                        >
                                            {isApplyingCoupon ? "..." : "تطبيق"}
                                        </button>
                                    )}
                                </div>
                                {couponError && <p className="text-red-500 text-[10px] font-bold mt-2 pr-2">{couponError}</p>}
                                {discountPercent > 0 && (
                                    <div className="flex items-center gap-1 mt-2 pr-2 text-green-600 animate-in fade-in slide-in-from-top-1">
                                        <CheckCircle className="w-3 h-3" />
                                        <span className="text-[10px] font-bold">تم تطبيق خصم بقيمة {discountPercent}% للكود ({couponCode})</span>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-gray-500 font-bold">
                                    <span>المجموع الفرعي</span>
                                    <span>{subtotal.toLocaleString("ar-IQ")} د.ع</span>
                                </div>

                                {discountPercent > 0 && (
                                    <div className="flex justify-between text-green-600 font-bold">
                                        <span>خصم الكوبون ({discountPercent}%)</span>
                                        <span dir="ltr">-{(subtotal * (discountPercent / 100)).toLocaleString("ar-IQ")} د.ع</span>
                                    </div>
                                )}

                                <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center text-navy dark:text-cream">
                                    <span className="text-lg font-black">الإجمالي النهائي</span>
                                    <span className="text-3xl font-black text-gold">
                                        {cartTotal.toLocaleString("ar-IQ")} د.ع
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => router.push("/checkout")}
                                className="w-full bg-navy text-white py-5 rounded-2xl font-black text-xl hover:bg-gold transition-all shadow-xl shadow-navy/20 active:scale-[0.98] flex items-center justify-center gap-3"
                            >
                                إتمام الطلب
                                <ArrowRight className="w-6 h-6 rotate-180" />
                            </button>

                            <p className="text-center text-[10px] text-gray-400 mt-6 leading-relaxed">
                                من خلال إتمام الطلب، أنت توافق على شروط الخدمة وسياسة الخصوصية الخاصة بمكتبة تسواهن.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
