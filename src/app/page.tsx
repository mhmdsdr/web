"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { CartSlideOver } from "@/components/layout/CartSlideOver";
import { BookCard } from "@/components/ui/BookCard";
import { Book } from "@/data/books";
import { FeaturesGrid } from "@/components/FeaturesGrid";
import { CategoriesGrid } from "@/components/CategoriesGrid";
import { Hero } from "@/components/layout/Hero";
import Link from "next/link";


export default function Home() {
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
        {/* ── Hero Section ── */}
        <Hero />


        {/* ── Features ── */}
        <FeaturesGrid />

        {/* ── Categories ── */}
        <CategoriesGrid />

        {/* ── Books Grid ── */}
        <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-10">
            <h2
              className="text-3xl lg:text-4xl font-black"
              style={{ color: "#1A3550" }}
            >
              أحدث الإصدارات
            </h2>
            <Link href="/books">
              <button className="font-medium transition-colors text-lg flex items-center gap-2 text-gold hover:opacity-75">
                عرض الكل <span className="text-xl">&larr;</span>
              </button>
            </Link>
          </div>

          {loading ? (
            /* Skeleton loader */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8">
              {books.map((book, index) => (
                <BookCard key={book.id} book={book} index={index} />
              ))}
            </div>
          )}
        </section>

        {/* ── Newsletter ── */}
        <section
          className="py-16 text-center rounded-t-[3rem] mt-10"
          style={{ backgroundColor: "#1A3550", color: "#E8F4FD" }}
        >
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-4">انضم إلى مجتمع تسواهن</h2>
            <p className="mb-8 max-w-xl mx-auto" style={{ color: "#B8D9F0" }}>
              اشترك في نشرتنا البريدية لتصلك أحدث الكتب والعروض الحصرية مباشرة إلى بريدك الإلكتروني.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="بريدك الإلكتروني"
                className="px-6 py-3 rounded-full flex-1 focus:outline-none focus:ring-2 focus:ring-gold"
                style={{ color: "#1A3550" }}
              />
              <button
                className="px-8 py-3 rounded-full font-bold transition-colors shadow-lg text-white"
                style={{ backgroundColor: "#C5A880" }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#E8F4FD")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#C5A880")}
              >
                اشتراك
              </button>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
