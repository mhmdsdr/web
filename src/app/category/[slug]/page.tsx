"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { CartSlideOver } from "@/components/layout/CartSlideOver";
import { BookCard } from "@/components/ui/BookCard";
import { Book } from "@/data/books";
import { ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";

const CATEGORY_MAP: Record<string, string> = {
    "self-development": "تطوير ذات",
    "philosophy": "فلسفة",
    "religious": "ديني",
    "novel": "رواية",
};

export default function CategoryPage() {
    const params = useParams();
    const slug = params.slug as string;
    const arabicCategory = CATEGORY_MAP[slug] || "قسم";

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/books")
            .then(r => r.json())
            .then((data: Book[]) => {
                const filtered = data.filter(b => {
                    if (slug === "novel") {
                        return b.category?.includes("رواية");
                    }
                    return b.category === arabicCategory;
                });
                setBooks(filtered);
            })
            .catch(() => setBooks([]))
            .finally(() => setLoading(false));
    }, [slug, arabicCategory]);

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
            <CartSlideOver />
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                isDarkMode={false}
                toggleDarkMode={() => { }}
            />

            <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

            <main className="pb-20">
                {/* ── Category Header ── */}
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
                            قسم <span className="text-gold">{arabicCategory}</span>
                        </h1>
                        <p className="text-lg md:text-xl mt-6 opacity-70" style={{ color: "#2A6EA6" }}>
                            تصفح مجموعة مختارة من أفضل كتب {arabicCategory} المتوفرة في مكتبتنا.
                        </p>
                    </div>
                </header>

                {/* ── Filtered Books Grid ── */}
                <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="rounded-2xl overflow-hidden animate-pulse bg-sky-50">
                                    <div className="aspect-[3/4] bg-sky-100" />
                                    <div className="p-4 space-y-2">
                                        <div className="h-4 bg-sky-100 rounded w-full" />
                                        <div className="h-4 bg-sky-100 rounded w-2/3" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : books.length === 0 ? (
                        <div className="text-center py-24 bg-sky-50/50 rounded-[3rem] border-2 border-dashed border-sky-100">
                            <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-20 text-navy" />
                            <p className="text-2xl font-bold" style={{ color: "#1A3550" }}>لا توجد كتب في هذا القسم حالياً</p>
                            <p className="mt-2" style={{ color: "#2A6EA6" }}>يمكنك إضافة المزيد من الكتب عبر لوحة الإدارة.</p>
                            <Link href="/books">
                                <button className="mt-8 px-8 py-3 bg-navy text-white rounded-full font-bold hover:bg-gold transition-colors">
                                    تصفح جميع الكتب
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8">
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
