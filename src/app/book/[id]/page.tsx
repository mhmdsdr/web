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
    const router = useRouter();
    const { addItem, openCart } = useCart();

    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [added, setAdded] = useState(false);

    // Layout states
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Modal state
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [orderForm, setOrderForm] = useState({ name: "", phone: "", address: "" });
    const [isOrderSubmitting, setIsOrderSubmitting] = useState(false);
    const [isOrderSuccess, setIsOrderSuccess] = useState(false);
    const [orderError, setOrderError] = useState("");

    const [userRating, setUserRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewText, setReviewText] = useState("");

    useEffect(() => {
        fetch("/api/books")
            .then(r => r.json())
            .then((books: Book[]) => {
                const found = books.find(b => b.id === id);
                if (found) setBook(found);
                else setNotFound(true);
            })
            .catch(() => setNotFound(true))
            .finally(() => setLoading(false));
    }, [id]);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
            document.documentElement.classList.remove("light");
        } else {
            document.documentElement.classList.remove("dark");
            document.documentElement.classList.add("light");
        }
    }, [isDarkMode]);

    const handleAddToCart = () => {
        if (!book) return;
        addItem(book);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    const handleBuyNow = () => {
        setShowOrderModal(true);
    };

    const handleOrderSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderForm.name || !orderForm.phone || !orderForm.address) return;
        setIsOrderSubmitting(true);
        setOrderError("");

        try {
            // Hardcoded credentials for absolute certainty as requested
            const BOT_TOKEN = "8760011149:AAF0JiR2PcsV6v17Cl70vSWgUpRNLlUMd3c";
            const CHAT_ID = "832812051";

            const message = `طلب جديد من المتجر! \n` +
                `اسم الزبون: ${orderForm.name} \n` +
                `الهاتف: ${orderForm.phone} \n` +
                `العنوان: ${orderForm.address} \n` +
                `اسم الكتاب: ${book!.title}`;

            console.log("🛠️ DEBUG: Starting Telegram send...");
            console.log("🛠️ DEBUG: Payload:", { chat_id: CHAT_ID, text: message });

            const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: message
                })
            });

            console.log("🛠️ DEBUG: Response Status:", response.status);
            const result = await response.json();
            console.log("🛠️ DEBUG: Response Data:", result);

            if (!response.ok) {
                throw new Error(result.description || "فشل الإرسال إلى تليجرام");
            }

            // Success flow
            setIsOrderSuccess(true);
            setTimeout(() => {
                setIsOrderSuccess(false);
                setShowOrderModal(false);
                setOrderForm({ name: "", phone: "", address: "" });
            }, 4000);

        } catch (err: any) {
            console.error("❌ DEBUG ERROR:", err);
            setOrderError(`خطأ في الإرسال: ${err.message || "عطل في الاتصال"}`);
        } finally {
            setIsOrderSubmitting(false);
        }
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
                                className="w-56 h-80 sm:w-64 sm:h-96 rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center"
                                style={{ backgroundColor: "#B8D9F0" }}
                            >
                                {book!.coverImage ? (
                                    <img src={book!.coverImage} alt={book!.title} className="w-full h-full object-cover shadow-inner" />
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

                            {/* Rating summary */}
                            <div className="flex items-center gap-3">
                                <Stars rating={Math.round(avgRating)} size="lg" />
                                <span className="font-black text-2xl" style={{ color: "#C5A880" }}>{avgRating}</span>
                                <span className="text-sm opacity-70" style={{ color: "#2A6EA6" }}>({MOCK_REVIEWS.length} تقييمات)</span>
                            </div>

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
                                    style={{ backgroundColor: added ? "#2A6EA6" : "#C5A880" }}
                                >
                                    <ShoppingCart className="w-6 h-6" />
                                    {book!.inStock === false ? "غير متوفر حالياً" : (added ? "تمت الإضافة ✓" : "إضافة للسلة")}
                                </button>
                                <button
                                    onClick={handleBuyNow}
                                    disabled={book!.inStock === false}
                                    className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-lg transition-all border-2 hover:-translate-y-1 active:scale-95 ${book!.inStock === false ? "opacity-30 cursor-not-allowed border-dashed" : ""
                                        }`}
                                    style={{ borderColor: "#1A3550", color: "#1A3550", backgroundColor: "transparent" }}
                                    onMouseEnter={e => { if (book!.inStock !== false) { e.currentTarget.style.backgroundColor = "#1A3550"; e.currentTarget.style.color = "white"; } }}
                                    onMouseLeave={e => { if (book!.inStock !== false) { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#1A3550"; } }}
                                >
                                    اطلب الآن
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ── Reviews section ── */}
                    <div className="rounded-[2.5rem] overflow-hidden shadow-sm border border-[#B8D9F0]">
                        {/* Section header */}
                        <div className="px-8 py-6 bg-[#B8D9F0]">
                            <h2 className="text-2xl font-black" style={{ color: "#1A3550" }}>التقييمات والمراجعات</h2>
                        </div>

                        <div className="p-6 sm:p-10 space-y-10 bg-[#F0F8FF]">
                            {/* Rating overview */}
                            <div className="flex flex-col sm:flex-row items-center gap-8 lg:gap-16 pb-10 border-b border-[#B8D9F0]">
                                <div className="text-center sm:text-right">
                                    <p className="text-7xl font-black leading-none mb-2" style={{ color: "#C5A880" }}>{avgRating}</p>
                                    <div className="flex justify-center sm:justify-start">
                                        <Stars rating={Math.round(avgRating)} size="lg" />
                                    </div>
                                    <p className="text-sm mt-3 opacity-70" style={{ color: "#2A6EA6" }}>{MOCK_REVIEWS.length} مراجعات حقيقية</p>
                                </div>
                                {/* Bar graph */}
                                <div className="flex-1 w-full space-y-3">
                                    {[5, 4, 3, 2, 1].map(star => {
                                        const count = star === 5 ? 2 : star === 4 ? 1 : 0;
                                        const pct = Math.round((count / MOCK_REVIEWS.length) * 100);
                                        return (
                                            <div key={star} className="flex items-center gap-4 text-sm">
                                                <span className="w-2 font-bold" style={{ color: "#2A6EA6" }}>{star}</span>
                                                <Star className="w-4 h-4 flex-shrink-0" fill="#C5A880" stroke="#C5A880" />
                                                <div className="flex-1 h-3 rounded-full overflow-hidden bg-[#B8D9F0]">
                                                    <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${pct}%`, backgroundColor: "#C5A880" }} />
                                                </div>
                                                <span className="w-8 text-left font-medium opacity-60" style={{ color: "#2A6EA6" }}>{count}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Review cards */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {MOCK_REVIEWS.map((r, i) => (
                                    <div key={i} className="rounded-2xl p-6 bg-[#E8F4FD] border border-[#B8D9F0] hover:shadow-md transition-shadow">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-inner bg-[#2A6EA6]">
                                                <User className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex flex-wrap items-center justify-between gap-2">
                                                    <p className="font-bold text-base" style={{ color: "#1A3550" }}>{r.name}</p>
                                                    <Stars rating={r.rating} />
                                                </div>
                                                <p className="text-xs opacity-60 mt-0.5" style={{ color: "#2A6EA6" }}>{r.date}</p>
                                            </div>
                                        </div>
                                        <p className="text-sm sm:text-base leading-relaxed opacity-90" style={{ color: "#2A6EA6" }}>{r.comment}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Add review form */}
                            <div className="pt-8 border-t border-[#B8D9F0] space-y-6">
                                <h3 className="text-xl font-bold" style={{ color: "#1A3550" }}>شاركنا رأيك في هذا الكتاب</h3>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <p className="text-sm font-semibold opacity-70" style={{ color: "#1A3550" }}>تقييمك:</p>
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map(i => (
                                                <button
                                                    key={i}
                                                    type="button"
                                                    onClick={() => setUserRating(i)}
                                                    onMouseEnter={() => setHoverRating(i)}
                                                    onMouseLeave={() => setHoverRating(0)}
                                                    className="transition-transform hover:scale-125 focus:outline-none"
                                                >
                                                    <Star
                                                        className="w-8 h-8 cursor-pointer"
                                                        fill={(hoverRating || userRating) >= i ? "#C5A880" : "none"}
                                                        stroke={(hoverRating || userRating) >= i ? "#C5A880" : "#B8D9F0"}
                                                        strokeWidth={2}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <textarea
                                        value={reviewText}
                                        onChange={e => setReviewText(e.target.value)}
                                        placeholder="اكتب تعليقك هنا..."
                                        rows={4}
                                        className="w-full px-5 py-4 rounded-2xl border bg-white text-base resize-none focus:outline-none focus:ring-4 focus:ring-sky-200 transition-all shadow-inner"
                                        style={{ borderColor: "#B8D9F0", color: "#1A3550" }}
                                    />

                                    <button
                                        onClick={() => { setReviewText(""); setUserRating(0); }}
                                        disabled={!reviewText.trim() || !userRating}
                                        className="px-10 py-3.5 rounded-2xl font-bold text-white disabled:opacity-40 transition-all hover:shadow-lg active:scale-95 bg-[#2A6EA6]"
                                    >
                                        إرسال التقييم
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Order Modal ── */}
                {showOrderModal && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <div
                            className="absolute inset-0 bg-[#1A3550]/60 backdrop-blur-md"
                            onClick={() => setShowOrderModal(false)}
                        />
                        <div className="relative w-full max-w-sm bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                            <div className="px-8 py-6 border-b border-[#B8D9F0] bg-[#B8D9F0] flex items-center justify-between">
                                <h3 className="font-black text-xl" style={{ color: "#1A3550" }}>طلب سريع</h3>
                                <button onClick={() => setShowOrderModal(false)} className="p-1 hover:rotate-90 transition-transform">
                                    <X className="w-6 h-6" style={{ color: "#1A3550" }} />
                                </button>
                            </div>

                            <div className="p-8">
                                {isOrderSuccess ? (
                                    <div className="text-center py-6 animate-in slide-in-from-bottom duration-500">
                                        <div className="flex justify-center mb-6">
                                            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                                                <CheckCircle className="w-12 h-12 text-green-500" />
                                            </div>
                                        </div>
                                        <h4 className="text-2xl font-black mb-3" style={{ color: "#1A3550" }}>تم استلام طلبك!</h4>
                                        <p className="text-base leading-relaxed opacity-75" style={{ color: "#2A6EA6" }}>سنتواصل معك عبر الهاتف قريباً لتأكيد تفاصيل التوصيل.</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleOrderSubmit} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-bold px-1" style={{ color: "#1A3550" }}>الاسم الكامل</label>
                                            <input
                                                required
                                                type="text"
                                                value={orderForm.name}
                                                onChange={e => setOrderForm(f => ({ ...f, name: e.target.value }))}
                                                className="w-full px-5 py-3.5 rounded-2xl border bg-white focus:outline-none focus:ring-4 focus:ring-sky-100 transition-all"
                                                style={{ borderColor: "#B8D9F0", color: "#1A3550" }}
                                                placeholder="أدخل اسمك هنا"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-bold px-1" style={{ color: "#1A3550" }}>رقم الهاتف</label>
                                            <div className="relative">
                                                <input
                                                    required
                                                    type="tel"
                                                    value={orderForm.phone}
                                                    onChange={e => setOrderForm(f => ({ ...f, phone: e.target.value }))}
                                                    className="w-full px-5 py-3.5 rounded-2xl border bg-white focus:outline-none focus:ring-4 focus:ring-sky-100 transition-all text-left"
                                                    style={{ borderColor: "#B8D9F0", color: "#1A3550" }}
                                                    placeholder="07XX XXX XXXX"
                                                    dir="ltr"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-bold px-1" style={{ color: "#1A3550" }}>عنوان التوصيل</label>
                                            <div className="relative">
                                                <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-30" style={{ color: "#1A3550" }} />
                                                <input
                                                    required
                                                    type="text"
                                                    value={orderForm.address}
                                                    onChange={e => setOrderForm(f => ({ ...f, address: e.target.value }))}
                                                    className="w-full px-5 py-3.5 pr-12 rounded-2xl border bg-white focus:outline-none focus:ring-4 focus:ring-sky-100 transition-all"
                                                    style={{ borderColor: "#B8D9F0", color: "#1A3550" }}
                                                    placeholder="المنطقة، المعلم القريب..."
                                                />
                                            </div>
                                        </div>

                                        {orderError && (
                                            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-600 border border-red-100 text-xs font-bold animate-shake">
                                                <AlertCircle className="w-4 h-4 shrink-0" />
                                                <p>{orderError}</p>
                                            </div>
                                        )}

                                        <div className="pt-2">
                                            <button
                                                type="submit"
                                                disabled={isOrderSubmitting}
                                                className="w-full py-4 bg-[#1A3550] text-white rounded-2xl font-black text-lg hover:shadow-xl hover:bg-[#C5A880] transition-all disabled:opacity-60 flex items-center justify-center gap-3 shadow-lg active:scale-95"
                                            >
                                                {isOrderSubmitting ? (
                                                    <span className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                                                ) : (
                                                    "تأكيد الطلب ✓"
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
