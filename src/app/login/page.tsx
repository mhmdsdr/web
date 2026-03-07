"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Lock, Mail, Loader2 } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (data.success) {
                router.push("/admin");
                router.refresh();
            } else {
                setError(data.message || "خطأ في تسجيل الدخول");
            }
        } catch (err) {
            setError("حدث خطأ ما، يرجى المحاولة لاحقاً");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-sky-50 p-4 rtl" dir="rtl">
            <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-sky-100">
                {/* Header */}
                <div className="bg-navy p-10 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-16 h-16 bg-white/10 rounded-2xl backdrop-blur-md flex items-center justify-center mb-4 border border-white/20">
                            <BookOpen className="w-8 h-8 text-gold" />
                        </div>
                        <h1 className="text-white text-2xl font-black">تسجيل دخول الإدارة</h1>
                        <p className="text-sky-200 text-sm mt-2 opacity-70">مكتبة تسواهن - ميسان</p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-10 space-y-6">
                    {error && (
                        <div className="bg-red-50 text-red-500 p-4 rounded-2xl text-sm font-bold border border-red-100 animate-shake">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="relative">
                            <label className="text-xs font-bold text-navy mb-1.5 block pr-2">البريد الإلكتروني</label>
                            <div className="relative">
                                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sky-300" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@example.com"
                                    className="w-full bg-sky-50/50 border border-sky-100 rounded-2xl py-4 pr-12 pl-4 text-sm focus:outline-none focus:ring-2 focus:ring-navy/10 focus:border-navy/20 transition-all text-navy"
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <label className="text-xs font-bold text-navy mb-1.5 block pr-2">كلمة السر</label>
                            <div className="relative">
                                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sky-300" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-sky-50/50 border border-sky-100 rounded-2xl py-4 pr-12 pl-4 text-sm focus:outline-none focus:ring-2 focus:ring-navy/10 focus:border-navy/20 transition-all text-navy"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-navy text-white py-4 rounded-2xl font-black shadow-lg shadow-navy/20 hover:bg-gold transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            "تسجيل الدخول"
                        )}
                    </button>

                    <Link href="/" className="block text-center text-xs text-sky-600 font-bold hover:text-navy transition-colors">
                        العودة للمتجر
                    </Link>
                </form>
            </div>
        </div>
    );
}
