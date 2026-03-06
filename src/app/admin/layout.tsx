"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, LayoutDashboard, BookMarked, ShoppingBag, LogOut } from "lucide-react";

const NAV = [
    { label: "لوحة التحكم", href: "/admin", icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: "إدارة الكتب", href: "/admin/books", icon: <BookMarked className="w-5 h-5" /> },
    { label: "الطلبات", href: "/admin/orders", icon: <ShoppingBag className="w-5 h-5" /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen flex" style={{ backgroundColor: "#E8F4FD", direction: "rtl" }}>

            {/* ── Sidebar ── */}
            <aside className="w-64 flex-shrink-0 flex flex-col shadow-lg" style={{ backgroundColor: "#1A3550" }}>
                {/* Logo */}
                <div className="flex items-center gap-3 px-6 py-5 border-b" style={{ borderColor: "#2A6EA6" }}>
                    <BookOpen className="w-8 h-8 text-gold" style={{ color: "#C5A880" }} />
                    <div>
                        <p className="text-white font-black text-lg leading-tight">تسواهن</p>
                        <p className="text-xs" style={{ color: "#B8D9F0" }}>لوحة الإدارة</p>
                    </div>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 px-3 py-4 space-y-1">
                    {NAV.map(item => {
                        const active = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all"
                                style={{
                                    backgroundColor: active ? "#2A6EA6" : "transparent",
                                    color: active ? "#ffffff" : "#B8D9F0",
                                }}
                            >
                                {item.icon}
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t" style={{ borderColor: "#2A6EA6" }}>
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm"
                        style={{ color: "#B8D9F0" }}
                    >
                        <LogOut className="w-4 h-4" />
                        العودة للمتجر
                    </Link>
                </div>
            </aside>

            {/* ── Main Content ── */}
            <main className="flex-1 overflow-auto">
                {/* Top bar */}
                <header className="px-8 py-4 border-b flex items-center justify-between sticky top-0 z-10"
                    style={{ backgroundColor: "#B8D9F0", borderColor: "#B8D9F0" }}
                >
                    <h1 className="text-lg font-bold" style={{ color: "#1A3550" }}>مكتبة تسواهن — لوحة الإدارة</h1>
                    <span className="text-sm px-3 py-1 rounded-full font-medium" style={{ backgroundColor: "#E8F4FD", color: "#2A6EA6" }}>
                        مدير النظام
                    </span>
                </header>

                <div className="p-8">
                    {children}
                </div>
            </main>

        </div>
    );
}
