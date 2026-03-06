"use client";

import { BOOKS } from "@/data/books";
import { BookMarked, ShoppingBag, TrendingUp, Users } from "lucide-react";
import Link from "next/link";

const STATS = [
    { label: "إجمالي الكتب", value: BOOKS.length, icon: <BookMarked className="w-6 h-6" />, color: "#2A6EA6" },
    { label: "الطلبات الكلية", value: 0, icon: <ShoppingBag className="w-6 h-6" />, color: "#C5A880" },
    { label: "المبيعات هذا الشهر", value: "—", icon: <TrendingUp className="w-6 h-6" />, color: "#2A6EA6" },
    { label: "المؤلفون", value: new Set(BOOKS.map(b => b.author)).size, icon: <Users className="w-6 h-6" />, color: "#C5A880" },
];

export default function AdminDashboardPage() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-black mb-1" style={{ color: "#1A3550" }}>مرحباً 👋</h2>
                <p className="text-sm" style={{ color: "#2A6EA6" }}>إليك ملخص سريع لمكتبتك اليوم</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {STATS.map((stat, i) => (
                    <div
                        key={i}
                        className="rounded-2xl p-6 shadow-sm flex items-center gap-4"
                        style={{ backgroundColor: "#F0F8FF", border: "1px solid #B8D9F0" }}
                    >
                        <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0"
                            style={{ backgroundColor: stat.color }}
                        >
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-2xl font-black" style={{ color: "#1A3550" }}>{stat.value}</p>
                            <p className="text-sm mt-0.5" style={{ color: "#2A6EA6" }}>{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Links */}
            <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: "#F0F8FF", border: "1px solid #B8D9F0" }}>
                <h3 className="text-lg font-bold mb-4" style={{ color: "#1A3550" }}>إجراءات سريعة</h3>
                <div className="flex flex-wrap gap-3">
                    <Link
                        href="/admin/books"
                        className="px-5 py-2.5 rounded-full font-bold text-sm text-white transition-opacity hover:opacity-80"
                        style={{ backgroundColor: "#2A6EA6" }}
                    >
                        إدارة الكتب
                    </Link>
                    <Link
                        href="/admin/books?action=add"
                        className="px-5 py-2.5 rounded-full font-bold text-sm text-white transition-opacity hover:opacity-80"
                        style={{ backgroundColor: "#C5A880" }}
                    >
                        + إضافة كتاب جديد
                    </Link>
                </div>
            </div>

            {/* Recent Books */}
            <div className="rounded-2xl shadow-sm overflow-hidden" style={{ border: "1px solid #B8D9F0" }}>
                <div className="px-6 py-4" style={{ backgroundColor: "#B8D9F0" }}>
                    <h3 className="font-bold" style={{ color: "#1A3550" }}>آخر الكتب المضافة</h3>
                </div>
                <div className="divide-y" style={{ backgroundColor: "#F0F8FF", borderColor: "#daeef9" }}>
                    {BOOKS.slice(0, 4).map(book => (
                        <div key={book.id} className="px-6 py-3 flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-sm" style={{ color: "#1A3550" }}>{book.title}</p>
                                <p className="text-xs" style={{ color: "#2A6EA6" }}>{book.author}</p>
                            </div>
                            <span className="text-sm font-bold" style={{ color: "#C5A880" }}>
                                {book.price.toLocaleString("ar-IQ")} د.ع
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
