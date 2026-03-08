import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { BookOpen } from "lucide-react";

export interface Book {
    id: string;
    title: string;
    author: string;
    price: number;
    category: string;
    image_url?: string;
    coverImage?: string;
    inStock?: boolean;
}

interface BookCardProps {
    book: Book;
    index?: number;
}

export function BookCard({ book, index = 0 }: BookCardProps) {
    const { addItem } = useCart();

    // Determine the image source safely (image_url is the new Supabase field)
    const displayImage = book.image_url || book.coverImage;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.45,
                delay: index * 0.07,
                ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{
                scale: 1.04,
                y: -4,
                transition: { type: "spring", stiffness: 300, damping: 20 },
            }}
            className="group flex flex-col rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border"
            style={{ backgroundColor: "#F0F8FF", borderColor: "#B8D9F0" }}
        >
            {/* Navigable Cover Area */}
            <Link href={`/book/${book.id}`} className="relative aspect-[3/4] overflow-hidden flex items-center justify-center bg-[#daeef9]">
                {displayImage ? (
                    <img src={displayImage} alt={book.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="flex flex-col items-center gap-2 text-[#2A6EA6]">
                        <BookOpen className="w-10 h-10 opacity-30" />
                        <span className="text-xs font-medium">غلاف الكتاب</span>
                    </div>
                )}

                {/* Stock Status Badge */}
                {book.inStock === false && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg z-10 animate-pulse">
                        نفذت الكمية
                    </div>
                )}

                {/* Hover overlay - Add to Cart button */}
                <div
                    className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center ${book.inStock === false ? "cursor-not-allowed" : ""
                        }`}
                    style={{ backgroundColor: "rgba(26,53,80,0.55)" }}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                >
                    <motion.button
                        onClick={(e) => {
                            if (book.inStock === false) return;
                            e.preventDefault();
                            e.stopPropagation();
                            addItem(book);
                        }}
                        whileTap={book.inStock !== false ? { scale: 0.93 } : {}}
                        className={`translate-y-4 group-hover:translate-y-0 transition-transform duration-300 text-white px-6 py-2 rounded-full font-bold flex items-center gap-2 shadow-lg ${book.inStock === false ? "opacity-50 grayscale cursor-not-allowed" : ""
                            }`}
                        style={{ backgroundColor: "#C5A880" }}
                        disabled={book.inStock === false}
                    >
                        {book.inStock === false ? "غير متوفر" : "إضافة للسلة"}
                    </motion.button>
                </div>
            </Link>

            {/* Info */}
            <div className="p-4 flex flex-col flex-1">
                <span className="text-xs font-medium text-gold mb-1">{book.category}</span>
                <Link href={`/book/${book.id}`}>
                    <h3
                        className="text-lg font-bold line-clamp-1 mb-1 hover:text-[#2A6EA6] transition-colors"
                        style={{ color: "#1A3550" }}
                    >
                        {book.title}
                    </h3>
                </Link>
                <p className="text-sm mb-4" style={{ color: "#2A6EA6" }}>{book.author}</p>
                <div className="mt-auto">
                    <span className="text-lg font-bold" style={{ color: "#1A3550" }}>
                        {book.price.toLocaleString("ar-IQ")}{" "}
                        <span className="text-sm font-normal">د.ع</span>
                    </span>
                </div>
            </div>
        </motion.div>
    );
}
