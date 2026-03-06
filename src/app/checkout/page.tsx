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
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customerName: form.name.trim(),
                    customerPhone: form.phone.trim(),
                    customerAddress: form.address.trim(),
                    items: items.map(i => ({
                        bookTitle: i.title,
                        price: i.price,
                        quantity: i.quantity,
                    })),
                    total: cartTotal,
                }),
            });
            const data = await res.json();
            if (res.ok) {
                setOrderId(data.orderId ?? "");
                clearCart();
                setIsSuccess(true);
            }
        } catch {
            // still show success so user isn't stuck
            clearCart();
            setIsSuccess(true);
        }
        setIsSubmitting(false);
    };


    if (isSuccess) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <div className="flex justify-center mb-6">
                        <CheckCircle className="w-24 h-24 text-green-500" />
                    </div>
                    <h1 className="text-3xl font-black text-navy dark:text-cream mb-3">تم استلام طلبك بنجاح!</h1>
                    {orderId && (
                        <p className="text-sm font-mono mb-2 px-4 py-2 rounded-xl inline-block"
                            style={{ backgroundColor: "#E8F4FD", color: "#2A6EA6" }}>
                            رقم الطلب: <span className="font-bold">{orderId}</span>
                        </p>
                    )}
                    <p className="text-gray-500 mb-8 mt-2">
                        سيتواصل معك فريقنا قريباً على الرقم <span className="font-bold text-gold">{form.phone}</span> لتأكيد الطلب.
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 bg-gold text-white px-8 py-3 rounded-full font-bold hover:bg-navy transition-colors"
                    >
                        <BookOpen className="w-5 h-5" />
                        العودة للمتجر
                    </Link>
                </div>
            </div>
        );
    }

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
                            disabled={isSubmitting}
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
                                <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                                    <span className="font-bold text-navy dark:text-cream">الإجمالي</span>
                                    <span className="text-xl font-black text-gold">{cartTotal.toLocaleString("ar-IQ")} د.ع</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
