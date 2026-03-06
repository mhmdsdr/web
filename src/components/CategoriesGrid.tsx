"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Compass, Library, Heart } from "lucide-react";
import Link from "next/link";

const categories = [
    {
        title: "تطوير الذات",
        icon: Sparkles,
        color: "from-purple-500 to-indigo-600",
        shadow: "shadow-purple-200",
        href: "/category/self-development",
    },
    {
        title: "فلسفة",
        icon: Compass,
        color: "from-blue-500 to-cyan-600",
        shadow: "shadow-blue-200",
        href: "/category/philosophy",
    },
    {
        title: "ديني",
        icon: Library,
        color: "from-emerald-500 to-teal-600",
        shadow: "shadow-emerald-200",
        href: "/category/religious",
    },
    {
        title: "رواية",
        icon: Heart,
        color: "from-rose-500 to-pink-600",
        shadow: "shadow-rose-200",
        href: "/category/novel",
    },
];

export const CategoriesGrid = () => {
    return (
        <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                <div className="text-right">
                    <h2 className="text-3xl lg:text-5xl font-black mb-4" style={{ color: "#1A3550" }}>
                        الأقسام <span className="text-gold">المميزة</span>
                    </h2>
                    <p className="text-lg opacity-70 max-w-xl" style={{ color: "#2A6EA6" }}>
                        تصفح مكتبتنا حسب التصنيف الذي تفضله لتصل إلى كتابك القادم بسرعة وسهولة.
                    </p>
                </div>
                <Link href="/books">
                    <button className="text-navy font-bold hover:text-gold transition-colors flex items-center gap-2 group border-b-2 border-gold pb-1 px-2 cursor-pointer">
                        عرض جميع الأقسام
                        <span className="group-hover:translate-x-[-4px] transition-transform">←</span>
                    </button>
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {categories.map((cat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <Link href={cat.href}>
                            <motion.div
                                whileHover={{
                                    scale: 1.05,
                                    rotateY: 5,
                                    boxShadow: "0 20px 40px -10px rgba(0,0,0,0.1)"
                                }}
                                whileTap={{ scale: 0.95 }}
                                className={`group relative h-48 rounded-[2.5rem] overflow-hidden cursor-pointer p-8 flex flex-col items-center justify-center transition-all bg-gradient-to-br ${cat.color} ${cat.shadow} shadow-xl border border-white/20`}
                            >
                                {/* Glass overlay */}
                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />

                                {/* Animated background blobs */}
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />

                                <cat.icon className="w-16 h-16 text-white mb-4 drop-shadow-lg group-hover:scale-110 transition-transform duration-500" />

                                <h3 className="text-xl font-black text-white text-center drop-shadow-md">
                                    {cat.title}
                                </h3>

                                {/* Accent highlight */}
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-8 h-1 bg-white/40 rounded-full group-hover:w-16 transition-all duration-500" />
                            </motion.div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};
