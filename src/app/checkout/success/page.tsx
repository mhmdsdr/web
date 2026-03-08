"use client";

import { useSearchParams } from "next/navigation";
import { CheckCircle, BookOpen, Home, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

function SuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId");

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <div className="flex justify-center mb-6">
                    <CheckCircle className="w-24 h-24 text-green-500 animate-bounce" />
                </div>
                <h1 className="text-3xl font-black text-navy dark:text-cream mb-3">تم استلام طلبك بنجاح!</h1>

                {orderId && (
                    <div className="mb-6">
                        <p className="text-sm font-mono mb-2 px-4 py-2 rounded-xl inline-block"
                            style={{ backgroundColor: "#E8F4FD", color: "#2A6EA6" }}>
                            رقم الطلب: <span className="font-bold">{orderId}</span>
                        </p>
                    </div>
                )}

                <p className="text-gray-500 mb-8 mt-2 leading-relaxed">
                    شكراً لتسوقك من <span className="font-bold text-navy">مكتبة تسواهن</span>. <br />
                    سيتواصل معك فريقنا قريباً لتأكيد الطلب وترتيب التوصيل.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 bg-navy text-white px-8 py-3 rounded-xl font-bold hover:bg-gold transition-colors shadow-lg"
                    >
                        <Home className="w-5 h-5" />
                        العودة للرئيسية
                    </Link>
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 bg-cream text-navy px-8 py-3 rounded-xl font-bold border border-navy/10 hover:border-gold transition-colors"
                    >
                        <ShoppingBag className="w-5 h-5" />
                        تصفح المزيد
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-navy border-t-transparent rounded-full animate-spin"></div>
            </div>
        }>
            <SuccessContent />
        </Suspense>
    );
}
