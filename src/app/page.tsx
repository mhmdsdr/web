"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { CartSlideOver } from "@/components/layout/CartSlideOver";
import { BookCard } from "@/components/ui/BookCard";
import { Book, CATEGORIES } from "@/data/books";
import { FeaturesGrid } from "@/components/FeaturesGrid";
import { CategoriesGrid } from "@/components/CategoriesGrid";
import { Hero } from "@/components/layout/Hero";
import Link from "next/link";


export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("الكل");

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

  // Fetch live books from the API (with search and category support)
  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      let url = "/api/books?";
      if (search) url += `search=${encodeURIComponent(search)}&`;
      if (selectedCategory !== "الكل") url += `category=${encodeURIComponent(selectedCategory)}`;

      fetch(url)
        .then(r => r.json())
        .then((data: Book[]) => setBooks(data))
        .catch(() => setBooks([]))
        .finally(() => setLoading(false));
    }, search ? 400 : 0);

    return () => clearTimeout(delayDebounceFn);
  }, [search, selectedCategory]);

  const categories = ["الكل", ...CATEGORIES];

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
          <div className="flex flex-col gap-10 mb-12">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <h2
                className="text-3xl lg:text-4xl font-black"
                style={{ color: "#1A3550" }}
              >
                {search ? 'نتائج البحث' : (selectedCategory !== "الكل" ? `كتب التصنيف: ${selectedCategory}` : 'أحدث الإصدارات')}
              </h2>

              {/* Search Input */}
              <div className="relative w-full md:w-96 group">
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-[#2A6EA6] group-focus-within:text-gold transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="ابحث عن كتابك المفضل..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-14 pr-12 pl-6 rounded-2xl border-2 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-4 focus:ring-sky-100 transition-all font-bold text-lg"
                  style={{ borderColor: "#B8D9F0", color: "#1A3550" }}
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute inset-y-0 left-0 pl-4 flex items-center text-[#2A6EA6] hover:text-red-500 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Category Chips */}
            <div className="flex flex-wrap items-center justify-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCategory(c)}
                  className={`px-6 py-2.5 rounded-full font-bold transition-all whitespace-nowrap border-2 ${selectedCategory === c
                    ? "shadow-lg scale-105"
                    : "hover:bg-sky-50"
                    }`}
                  style={{
                    backgroundColor: selectedCategory === c ? "#C5A880" : "transparent",
                    color: selectedCategory === c ? "white" : "#1A3550",
                    borderColor: selectedCategory === c ? "#C5A880" : "#B8D9F0"
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
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
              <p className="text-xl font-bold">{search ? 'لم نجد أي كتاب بهذا العنوان' : 'لا توجد كتب حالياً'}</p>
              <p className="text-sm mt-2">{search ? 'جرب البحث بكلمات أخرى' : 'أضف كتباً من لوحة الإدارة لتظهر هنا.'}</p>
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
