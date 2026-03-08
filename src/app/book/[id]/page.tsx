"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { BookOpen, Star, ShoppingCart, ArrowRight, ChevronRight, User, X, CheckCircle, MapPin, AlertCircle } from "lucide-react";
// EmailJS removed, using Telegram Bot API via fetch
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { CartSlideOver } from "@/components/layout/CartSlideOver";

interface Book {
    id: string;
    title: string;
    author: string;
    price: number;
    category: string;
    image_url?: string;
    coverImage?: string;
    description?: string;
    inStock?: boolean;
}

// Static mock reviews (will show consistently per book)
const MOCK_REVIEWS = [
    { name: "أحمد السعد", rating: 5, comment: "كتاب رائع ويستحق القراءة، أنصح به بشدة!", date: "يناير 2025" },
    { name: "سارة محمد", rating: 4, comment: "قصة ممتعة جداً، الأسلوب سلس والحبكة مشوقة.", date: "فبراير 2025" },
    { name: "علي حسن", rating: 5, comment: "من أفضل ما قرأت هذا العام، شكراً مكتبة تسواهن.", date: "مارس 2025" },
];

function Stars({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
    const s = size === "lg" ? "w-6 h-6" : "w-4 h-4";
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(i => (
                <Star
                    key={i}
                    className={s}
                    fill={i <= rating ? "#C5A880" : "none"}
                    stroke={i <= rating ? "#C5A880" : "#B8D9F0"}
                />
            ))}
        </div>
    );
}

export default function BookDetailPage() {
    const { id } = useParams<{ id: string }>();
    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    // Layout states
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        fetch(`/api/books?id=${id}`)
            .then(async r => {
                if (!r.ok) throw new Error("Not found");
                return r.json();
            })
            .then((data: Book) => {
                setBook(data);
            })
            .catch(() => setNotFound(true))
            .finally(() => setLoading(false));
    }, [id]);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [isDarkMode]);

    const handleAddToCart = () => {
        alert("تمت الإضافة");
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#E8F4FD" }}>
            <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: "#B8D9F0", borderTopColor: "transparent" }} />
        </div>
    );

    if (notFound) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ backgroundColor: "#E8F4FD" }}>
            <BookOpen className="w-16 h-16" style={{ color: "#B8D9F0" }} />
            <h1 className="text-2xl font-black" style={{ color: "#1A3550" }}>الكتاب غير موجود</h1>
            <Link href="/" className="px-6 py-2.5 rounded-full font-bold text-white" style={{ backgroundColor: "#2A6EA6" }}>
                العودة للمكتبة
            </Link>
        </div>
    );

    const avgRating = 4.7;

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
                {/* ── Breadcrumb header ── */}
                <div className="border-b" style={{ backgroundColor: "#B8D9F0", borderColor: "#B8D9F0" }}>
                    <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-2 text-sm">
                        <Link href="/" className="font-bold hover:opacity-75 transition-opacity flex items-center gap-1"
                            style={{ color: "#1A3550" }}>
                            <ArrowRight className="w-4 h-4" />
                            المكتبة
                        </Link>
                        <ChevronRight className="w-4 h-4" style={{ color: "#2A6EA6" }} />
                        <span style={{ color: "#2A6EA6" }}>{book!.category}</span>
                        <ChevronRight className="w-4 h-4" style={{ color: "#2A6EA6" }} />
                        <span className="font-semibold line-clamp-1" style={{ color: "#1A3550" }}>{book!.title}</span>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10">
                    {/* ── Main: Cover + Info ── */}
                    <div className="flex flex-col md:flex-row gap-8 lg:gap-16 mb-14">
                        {/* Cover */}
                        <div className="flex-shrink-0 mx-auto md:mx-0">
                            <div
                                className="w-56 h-80 sm:w-64 sm:h-96 rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center relative"
                                style={{ backgroundColor: "#B8D9F0" }}
                            >
                                {(book!.image_url || book!.coverImage) ? (
                                    <img src={book!.image_url || book!.coverImage} alt={book!.title} className="w-full h-full object-cover shadow-inner" />
                                ) : (
                                    <div className="flex flex-col items-center gap-3" style={{ color: "#2A6EA6" }}>
                                        <BookOpen className="w-16 h-16 opacity-50" />
                                        <span className="text-xs font-medium">غلاف الكتاب</span>
                                    </div>
                                )}

                                {/* Stock Badge */}
                                {book!.inStock === false && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-[#1A3550]/40 backdrop-blur-[2px]">
                                        <div className="bg-red-500 text-white font-black px-6 py-2 rounded-full shadow-2xl animate-pulse scale-110">
                                            نفذت الكمية
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 flex flex-col gap-5">
                            {/* Category badge */}
                            <span
                                className="inline-block self-start px-5 py-1.5 rounded-full text-xs font-bold tracking-wide"
                                style={{ backgroundColor: "#B8D9F0", color: "#1A3550" }}
                            >
                                {book!.category}
                            </span>

                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight" style={{ color: "#1A3550" }}>
                                {book!.title}
                            </h1>

                            <p className="text-lg font-medium" style={{ color: "#2A6EA6" }}>
                                تأليف: <span className="font-bold underline decoration-gold/30">{book!.author}</span>
                            </p>

                            {/* Description */}
                            {book!.description && (
                                <p className="text-base sm:text-lg leading-relaxed max-w-2xl opacity-90" style={{ color: "#2A6EA6" }}>
                                    {book!.description}
                                </p>
                            )}

                            {/* Price */}
                            <div className="flex items-baseline gap-2 mt-2">
                                <span className="text-4xl sm:text-5xl font-black" style={{ color: "#C5A880" }}>
                                    {book!.price.toLocaleString("ar-IQ")}
                                </span>
                                <span className="text-lg font-bold" style={{ color: "#1A3550" }}>د.ع</span>
                            </div>

                            {/* CTA buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 mt-4">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={book!.inStock === false}
                                    className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-white text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95 ${book!.inStock === false ? "opacity-40 grayscale cursor-not-allowed transform-none shadow-none" : ""
                                        }`}
                                    style={{ backgroundColor: "#C5A880" }}
                                >
                                    <ShoppingCart className="w-6 h-6" />
                                    {book!.inStock === false ? "غير متوفر حالياً" : "إضافة للسلة"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
