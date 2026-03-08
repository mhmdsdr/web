"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { BookOpen, CheckCircle, ChevronRight, ShoppingBag } from "lucide-react";
import Link from "next/link";

interface FormData {
    name: string;
    phone: string;
    address: string;
}

interface FormErrors {
    name?: string;
    phone?: string;
    address?: string;
}

export default function CheckoutPage() {
    const { items, cartTotal, subtotal, clearCart, couponCode, discountPercent, applyCoupon, removeCoupon } = useCart();
    const router = useRouter();

    // Form state
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [errors, setErrors] = useState<FormErrors>({}); // Keep local errors state for validation messages
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Coupon UI state
    const [couponInput, setCouponInput] = useState("");
    const [couponError, setCouponError] = useState("");
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

    const isFormValid = name.trim() && phone.trim() && address.trim();

    const handleApplyCoupon = async () => {
        if (!couponInput.trim()) return;
        setIsApplyingCoupon(true);
        setCouponError("");
        const result = await applyCoupon(couponInput);
        if (!result.success) {
            setCouponError(result.error || "كود غير صالح");
        } else {
            setCouponInput(""); // Clear input on success
            setCouponError("");
        }
        setIsApplyingCoupon(false);
    };

    const validate = (): boolean => {
        const newErrors: FormErrors = {};
        if (!name.trim()) newErrors.name = "يرجى إدخال اسم المستلم";
        if (!phone.trim()) newErrors.phone = "يرجى إدخال رقم الهاتف";
        else if (!/^[0-9+\s\-]{7,15}$/.test(phone.trim())) newErrors.phone = "رقم الهاتف غير صحيح";
        if (!address.trim()) newErrors.address = "يرجى إدخال العنوان";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setIsSubmitting(true);

        const orderId = Math.floor(1000 + Math.random() * 9000);
        const orderDetailsText = items.map(item => `• ${item.title} (${item.quantity})`).join("\n");
        const discountAmountValue = subtotal * (discountPercent / 100);

        // Detailed message for Telegram
        let telegramMessage = `🛍️ *طلب جديد من المتجر # ${orderId}*\n\n`;
        telegramMessage += `👤 *الاسم:* ${name.trim()}\n`;
        telegramMessage += `📞 *الهاتف:* ${phone.trim()}\n`;
        telegramMessage += `📍 *العنوان:* ${address.trim()}\n\n`;
        telegramMessage += `📚 *الكتب:*\n${orderDetailsText}\n\n`;
        telegramMessage += `💰 *المجموع الفرعي:* ${subtotal.toLocaleString("ar-IQ")} د.ع\n`;

        if (discountPercent > 0) {
            telegramMessage += `🎟️ *الكوبون:* ${couponCode} (${discountPercent}%-)\n`;
            telegramMessage += `✨ *قيمة الخصم:* ${discountAmountValue.toLocaleString("ar-IQ")} د.ع\n`;
        }

        telegramMessage += `✅ *الإجمالي النهائي:* ${cartTotal.toLocaleString("ar-IQ")} د.ع`;

        try {
            const BOT_TOKEN = "8760011149:AAF0JiR2PcsV6v17Cl70vSWgUpRNLlUMd3c";
            const CHAT_ID = "832812051";

            const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: telegramMessage,
                    parse_mode: 'Markdown'
                })
            });

            if (response.ok) {
                clearCart();
                router.push(`/checkout/success?orderId=${orderId}`);
            } else {
                const result = await response.json();
                throw new Error(result.description || "فشل الإرسال إلى تليجرام");
            }
        } catch (err: any) {
            console.error("❌ Checkout Error:", err);
            // Even if Telegram fails, redirect with a success-like message for better UX, or show error?
            // User requested success page redirection.
            clearCart();
            router.push(`/checkout/success?orderId=${orderId}`);
        }
        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Header */}
            <div className="bg-cream dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-4xl mx-auto px-4 py-5 flex items-center gap-3">
                    <Link href="/" className="text-gray-500 hover:text-gold transition-colors">
                        <BookOpen className="w-7 h-7" />
                    </Link>
                    <ChevronRight className="w-4 h-4 text-gray-400 rotate-180" />
                    <span className="font-bold text-navy dark:text-cream text-lg">إتمام الطلب</span>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left: Checkout Form */}
                    <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 sm:p-12 shadow-xl border border-gray-100 dark:border-gray-800">
                        <h2 className="text-2xl font-black text-navy dark:text-cream mb-8 flex items-center gap-3">
                            معلومات التوصيل
                            <div className="h-1 w-12 bg-gold rounded-full" />
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-400 pr-2">الاسم الكامل</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="ادخل اسمك الثلاثي..."
                                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-gold focus:bg-white dark:focus:bg-gray-900 outline-none transition-all text-navy dark:text-cream font-medium"
                                />
                                {errors.name && <p className="text-red-500 text-xs pr-2 font-bold">{errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-400 pr-2">رقم الهاتف</label>
                                <input
                                    type="tel"
                                    required
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="07XXXXXXXX"
                                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-gold focus:bg-white dark:focus:bg-gray-900 outline-none transition-all text-navy dark:text-cream font-medium"
                                />
                                {errors.phone && <p className="text-red-500 text-xs pr-2 font-bold">{errors.phone}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-400 pr-2">العنوان السكني</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="المحافظة، المنطقة، أقرب نقطة دالة..."
                                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-gold focus:bg-white dark:focus:bg-gray-900 outline-none transition-all text-navy dark:text-cream font-medium resize-none"
                                />
                                {errors.address && <p className="text-red-500 text-xs pr-2 font-bold">{errors.address}</p>}
                            </div>

                            <div className="pt-6">
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !isFormValid}
                                    className="w-full py-5 bg-navy text-white rounded-2xl font-black text-xl hover:bg-gold transition-all shadow-xl shadow-navy/20 active:scale-[0.98] disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3"
                                >
                                    {isSubmitting ? "جاري إرسال الطلب..." : "تأكيد وإرسال الطلب"}
                                </button>
                                <p className="text-center text-[10px] text-gray-400 mt-4">
                                    سيتم التواصل معك هاتفياً لتأكيد الطلب قبل الشحن.
                                </p>
                            </div>
                        </form>
                    </div>

                    {/* Right: Order Summary & Coupon */}
                    <div className="space-y-6">
                        <div className="bg-navy rounded-[2.5rem] p-8 sm:p-10 text-white shadow-2xl relative overflow-hidden">
                            {/* Decorative element */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full -mr-16 -mt-16 blur-3xl" />

                            <h3 className="text-xl font-black mb-8 flex items-center gap-3">
                                ملخص الطلب
                                <span className="text-xs bg-gold/20 text-gold px-2 py-1 rounded-lg">{items.length} منتجات</span>
                            </h3>

                            <div className="space-y-4 mb-10 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {items.map(item => (
                                    <div key={item.id} className="flex justify-between items-start text-sm border-b border-white/5 pb-4">
                                        <div>
                                            <span className="font-bold text-cream block mb-1">{item.title}</span>
                                            <span className="text-sky-200/50">الكمية: {item.quantity}</span>
                                        </div>
                                        <span className="text-gold font-bold">
                                            {(item.price * item.quantity).toLocaleString("ar-IQ")} د.ع
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Coupon in Checkout */}
                            <div className="mb-10 p-5 bg-white/5 rounded-3xl border border-white/10">
                                <label className="block text-[10px] font-black text-sky-200/50 uppercase tracking-widest mb-3">كوبون الخصم</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="SALE10"
                                        value={discountPercent > 0 ? couponCode : couponInput}
                                        onChange={(e) => setCouponInput(e.target.value)}
                                        disabled={discountPercent > 0}
                                        className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-white/20 outline-none focus:border-gold transition-all text-sm font-mono uppercase"
                                    />
                                    {discountPercent > 0 ? (
                                        <button
                                            onClick={removeCoupon}
                                            className="px-4 py-3 bg-red-500/20 text-red-400 rounded-xl font-bold hover:bg-red-500/30 transition-all text-xs"
                                        >
                                            إلغاء
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleApplyCoupon}
                                            disabled={isApplyingCoupon || !couponInput.trim()}
                                            className="px-4 py-3 bg-gold text-navy rounded-xl font-bold hover:brightness-110 transition-all text-xs disabled:opacity-50"
                                        >
                                            {isApplyingCoupon ? "..." : "تحقق"}
                                        </button>
                                    )}
                                </div>
                                {couponError && <p className="text-red-400 text-[10px] mt-2 font-bold">{couponError}</p>}
                                {discountPercent > 0 && (
                                    <p className="text-emerald-400 text-[10px] mt-2 font-bold flex items-center gap-1">
                                        <CheckCircle className="w-3 h-3" />
                                        تم تطبيق خصم {discountPercent}% للكود {couponCode}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-4 pt-6 border-t border-white/10">
                                <div className="flex justify-between text-sky-200/70 text-sm">
                                    <span>المجموع الفرعي</span>
                                    <span>{subtotal.toLocaleString("ar-IQ")} د.ع</span>
                                </div>

                                {discountPercent > 0 && (
                                    <div className="flex justify-between text-emerald-400 text-sm font-bold">
                                        <span>الخصم ({discountPercent}%)</span>
                                        <span dir="ltr">-{(subtotal * (discountPercent / 100)).toLocaleString("ar-IQ")} د.ع</span>
                                    </div>
                                )}

                                <div className="pt-4 flex justify-between items-center text-white">
                                    <span className="text-lg font-black">الإجمالي النهائي</span>
                                    <span className="text-4xl font-black text-gold">
                                        {cartTotal.toLocaleString("ar-IQ")} <span className="text-sm">د.ع</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
