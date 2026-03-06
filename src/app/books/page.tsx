"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { CartSlideOver } from "@/components/layout/CartSlideOver";
import { BookCard } from "@/components/ui/BookCard";
import { Book } from "@/data/books";
import { ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";

export default function BooksPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);

    // Dark mode toggle
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
            document.documentElement.classList.remove("light");
        } else {
            document.documentElement.classList.remove("dark");
            document.documentElement.classList.add("light");
        }
    }, [isDarkMode]);

    // Fetch live books from the API
    useEffect(() => {
        fetch("/api/books")
            .then(r => r.json())
            .then((data: Book[]) => setBooks(data))
            .catch(() => setBooks([]))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
            <CartSlideOver />
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                isDarkMode={isDarkMode}
                toggleDarkMode={() => setIsDarkMode(d => !d)}
            />

            <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

            <main>
                {/* ── Header ── */}
                <header
                    className="py-16 md:py-24 border-b relative overflow-hidden"
                    style={{
                        background: "linear-gradient(135deg, #B8D9F0 0%, #E8F4FD 100%)",
                        borderColor: "#B8D9F0"
                    }}
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/30 rounded-full blur-3xl -mr-32 -mt-32" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold/10 rounded-full blur-3xl -ml-24 -mb-24" />

                    <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
                        <Link href="/" className="inline-flex items-center gap-2 text-navy font-bold mb-6 hover:text-gold transition-colors">
                            <ArrowRight className="w-5 h-5" />
                            العودة للرئيسية
                        </Link>
                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-black" style={{ color: "#1A3550" }}>
                            جميع <span className="text-gold">الكتب</span>
                        </h1>
                        <p className="text-lg md:text-xl mt-6 opacity-70" style={{ color: "#2A6EA6" }}>
                            استعرض مجموعتنا الكاملة من العناوين والإصدارات الحصرية.
                        </p>
                    </div>
                </header>

                {/* ── Books Grid ── */}
                <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {loading ? (
                        /* Skeleton loader */
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8">
                            {Array.from({ length: 12 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="rounded-2xl overflow-hidden animate-pulse"
                                    style={{ backgroundColor: "#daeef9" }}
                                >
                                    <div className="aspect-[3/4]" style={{ backgroundColor: "#B8D9F0" }} />
                                    <div className="p-4 space-y-2">
                                        <div className="h-3 rounded-full w-2/3" style={{ backgroundColor: "#B8D9F0" }} />
                                        <div className="h-4 rounded-full w-full" style={{ backgroundColor: "#B8D9F0" }} />
                                        <div className="h-3 rounded-full w-1/2" style={{ backgroundColor: "#B8D9F0" }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : books.length === 0 ? (
                        <div className="text-center py-24" style={{ color: "#2A6EA6" }}>
                            <p className="text-xl font-bold">لا توجد كتب حالياً</p>
                            <p className="text-sm mt-2">أضف كتباً من لوحة الإدارة لتظهر هنا.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8">
                            {books.map((book, index) => (
                                <BookCard key={book.id} book={book} index={index} />
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}
