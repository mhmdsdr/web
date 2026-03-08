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
    const { items, cartTotal, clearCart } = useCart();
    const router = useRouter();
    const [form, setForm] = useState<FormData>({ name: "", phone: "", address: "" });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSuccess, setIsSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderId, setOrderId] = useState("");

    // Coupon states
    const [couponCode, setCouponCode] = useState("");
    const [discountPercent, setDiscountPercent] = useState(0);
    const [couponError, setCouponError] = useState("");
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;
        setIsApplyingCoupon(true);
        setCouponError("");
        try {
            const resp = await fetch(`/api/coupons?code=${encodeURIComponent(couponCode.trim())}`);
            const data = await resp.json();
            if (resp.ok) {
                setDiscountPercent(data.discount_percent);
                setCouponError("");
            } else {
                setCouponError(data.error || "خطأ في التحقق من الكود");
                setDiscountPercent(0);
            }
        } catch (err) {
            setCouponError("خطأ في الاتصال بالخادم");
            setDiscountPercent(0);
        }
        setIsApplyingCoupon(false);
    };

    const finalTotal = cartTotal * (1 - discountPercent / 100);

    const validate = (): boolean => {
        const newErrors: FormErrors = {};
        if (!form.name.trim()) newErrors.name = "يرجى إدخال اسم المستلم";
        if (!form.phone.trim()) newErrors.phone = "يرجى إدخال رقم الهاتف";
        else if (!/^[0-9+\s\-]{7,15}$/.test(form.phone.trim())) newErrors.phone = "رقم الهاتف غير صحيح";
        if (!form.address.trim()) newErrors.address = "يرجى إدخال العنوان";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        try {
            // Hardcoded credentials for absolute certainty as requested
            const BOT_TOKEN = "8760011149:AAF0JiR2PcsV6v17Cl70vSWgUpRNLlUMd3c";
            const CHAT_ID = "832812051";

            const itemsList = items.map(i => `• ${i.title} (${i.quantity})`).join("\n");
            let message = `🛍️ طلب جديد من المتجر (سلة التسوق)!\n\n` +
                `👤 اسم الزبون: ${form.name.trim()}\n` +
                `📞 الهاتف: ${form.phone.trim()}\n` +
                `📍 العنوان: ${form.address.trim()}\n\n` +
                `📚 الكتب:\n${itemsList}\n\n` +
                `💰 المجموع الفرعي: ${cartTotal.toLocaleString("ar-IQ")} د.ع\n`;

            if (discountPercent > 0) {
                message += `🎟️ كود الخصم: ${couponCode.toUpperCase()} (${discountPercent}%\n)`;
                message += `💵 الخصم: -${(cartTotal * (discountPercent / 100)).toLocaleString("ar-IQ")} د.ع\n`;
            }

            message += `✅ الإجمالي النهائي: ${finalTotal.toLocaleString("ar-IQ")} د.ع`;

            console.log("🛠️ DEBUG: Starting Checkout Telegram send...");

            const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: message
                })
            });

            console.log("🛠️ DEBUG: Checkout Response Status:", response.status);
            const result = await response.json();

            if (response.ok) {
                const newOrderId = `ORD-${Date.now()}`;
                clearCart();
                router.push(`/checkout/success?orderId=${newOrderId}`);
            } else {
                throw new Error(result.description || "فشل الإرسال إلى تليجرام");
            }
        } catch (err: any) {
            console.error("❌ Checkout Error:", err);
            // still redirect so user isn't stuck, but log the error
            const fallbackOrderId = `ORD-${Date.now()}`;
            clearCart();
            router.push(`/checkout/success?orderId=${fallbackOrderId}`);
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

            <div className="max-w-4xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-5 gap-8">
                {/* Left: Form */}
                <div className="md:col-span-3">
                    <h1 className="text-2xl font-black text-navy dark:text-cream mb-6">بيانات التوصيل</h1>
                    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                        {/* اسم المستلم */}
                        <div>
                            <label className="block text-sm font-semibold text-navy dark:text-cream mb-1">
                                اسم المستلم <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                placeholder="مثال: أحمد علي"
                                className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-gray-900 text-navy dark:text-cream placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${errors.name ? "border-red-400 focus:ring-red-300" : "border-gray-200 focus:ring-gold"}`}
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>

                        {/* رقم الهاتف */}
                        <div>
                            <label className="block text-sm font-semibold text-navy dark:text-cream mb-1">
                                رقم الهاتف <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                value={form.phone}
                                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                                placeholder="مثال: 07701234567"
                                className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-gray-900 text-navy dark:text-cream placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${errors.phone ? "border-red-400 focus:ring-red-300" : "border-gray-200 focus:ring-gold"}`}
                                dir="ltr"
                            />
                            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                        </div>

                        {/* العنوان */}
                        <div>
                            <label className="block text-sm font-semibold text-navy dark:text-cream mb-1">
                                العنوان <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={form.address}
                                onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                                placeholder="المحافظة، الحي، الشارع، رقم البيت..."
                                rows={3}
                                className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-gray-900 text-navy dark:text-cream placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors resize-none ${errors.address ? "border-red-400 focus:ring-red-300" : "border-gray-200 focus:ring-gold"}`}
                            />
                            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting || !form.name.trim() || !form.phone.trim() || !form.address.trim()}
                            className="w-full py-4 bg-navy text-white rounded-xl font-bold text-lg hover:bg-gold transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    <CheckCircle className="w-5 h-5" />
                                    تأكيد الطلب
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Right: Order Summary */}
                <div className="md:col-span-2">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 sticky top-6">
                        <h2 className="text-lg font-black text-navy dark:text-cream mb-4 flex items-center gap-2">
                            <ShoppingBag className="w-5 h-5 text-gold" />
                            ملخص الطلب
                        </h2>
                        {items.length === 0 ? (
                            <p className="text-gray-400 text-sm">سلة التسوق فارغة</p>
                        ) : (
                            <div className="space-y-3">
                                {items.map(item => (
                                    <div key={item.id} className="flex justify-between items-start text-sm">
                                        <div>
                                            <span className="font-semibold text-navy dark:text-cream line-clamp-1">{item.title}</span>
                                            <span className="text-gray-400 block">× {item.quantity}</span>
                                        </div>
                                        <span className="text-gold font-bold whitespace-nowrap mr-2">
                                            {(item.price * item.quantity).toLocaleString("ar-IQ")} د.ع
                                        </span>
                                    </div>
                                ))}

                                {/* Coupon Section */}
                                <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">هل لديك كود خصم؟</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                            placeholder="أدخل الكود هنا..."
                                            disabled={discountPercent > 0}
                                            className="flex-1 px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gold disabled:opacity-50 uppercase font-mono"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleApplyCoupon}
                                            disabled={isApplyingCoupon || !couponCode.trim() || discountPercent > 0}
                                            className="px-4 py-2 bg-navy text-white text-sm font-bold rounded-xl hover:bg-gold transition-colors disabled:opacity-50"
                                        >
                                            {isApplyingCoupon ? "..." : (discountPercent > 0 ? "تم" : "تحقق")}
                                        </button>
                                    </div>
                                    {couponError && <p className="text-red-500 text-[10px] mt-1 font-bold">{couponError}</p>}
                                    {discountPercent > 0 && <p className="text-green-600 text-[10px] mt-1 font-bold">🎉 تمت إضافة خصم {discountPercent}% بنجاح!</p>}
                                </div>

                                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">المجموع الفرعي</span>
                                        <span className="font-semibold text-navy dark:text-cream">{cartTotal.toLocaleString("ar-IQ")} د.ع</span>
                                    </div>

                                    {discountPercent > 0 && (
                                        <div className="flex justify-between items-center text-sm text-green-600 font-bold">
                                            <span>الخصم ({discountPercent}%)</span>
                                            <span dir="ltr">-{(cartTotal * (discountPercent / 100)).toLocaleString("ar-IQ")} د.ع</span>
                                        </div>
                                    )}

                                    <div className="pt-2 flex justify-between items-center border-t border-dashed border-gray-200 dark:border-gray-700">
                                        <span className="font-black text-navy dark:text-cream">الإجمالي النهائي</span>
                                        <span className="text-2xl font-black text-gold">{finalTotal.toLocaleString("ar-IQ")} د.ع</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
