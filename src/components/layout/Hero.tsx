"use client";

import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Instagram, Send, Phone, MapPin, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const Hero = () => {
    return (
        <section className="relative w-full h-[80vh] md:h-[90vh] flex items-center justify-center overflow-hidden">
            {/* Background Image with Parallax-like scale */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: "url('/library_shelf_bg_1772809391684.png')",
                    filter: "brightness(0.4) contrast(1.1)"
                }}
            />

            {/* Dark/Blue Overlay for depth */}
            <div className="absolute inset-0 z-10 bg-gradient-to-b from-navy/30 via-transparent to-navy/80" />

            <div className="relative z-20 max-w-5xl mx-auto px-4 flex flex-col items-center text-center">

                {/* Brand / Logo floating */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="mb-12"
                >
                    <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md px-8 py-3 rounded-full border border-white/10 shadow-2xl">
                        <BookOpen className="w-8 h-8 text-gold" />
                        <span className="text-3xl font-black text-white tracking-widest">تسواهن</span>
                    </div>
                </motion.div>

                {/* Catchphrase */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight drop-shadow-2xl"
                >
                    اكتشف عالمك <span className="text-gold underline decoration-white/20 underline-offset-8">الجديد</span>
                </motion.h1>

                {/* Main Action Group */}
                <div className="flex flex-col items-center gap-10 mt-8">

                    {/* Primary Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Link href="/books">
                            <motion.button
                                whileHover={{ scale: 1.04, boxShadow: "0 0 35px rgba(197, 168, 128, 0.5)" }}
                                whileTap={{ scale: 0.98 }}
                                className="group flex items-center gap-4 px-12 py-6 rounded-full border-2 border-gold/40 backdrop-blur-2xl bg-white/10 text-white font-black text-2xl shadow-2xl transition-all cursor-pointer"
                            >
                                <BookOpen className="w-7 h-7 text-gold group-hover:rotate-12 transition-transform" />
                                <span>تصفح جميع الكتب</span>
                                <ArrowLeft className="w-6 h-6 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                            </motion.button>
                        </Link>
                    </motion.div>

                    {/* Meta Group (Location + Social) */}
                    <div className="flex flex-col md:flex-row items-center gap-6 p-2 rounded-[3rem]">

                        {/* Location Pill */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center gap-3 px-8 py-4 rounded-full border border-white/15 backdrop-blur-xl bg-white/5 text-white/90 font-bold shadow-xl cursor-default select-none"
                        >
                            <MapPin className="w-5 h-5 text-gold" />
                            <span className="text-lg">ميسان، العمارة</span>
                        </motion.div>

                        {/* Social Icons Group */}
                        <div className="flex items-center gap-4">
                            {[
                                { icon: Phone, href: "tel:07739118013", label: "اتصال" },
                                { icon: Instagram, href: "#", label: "إنستغرام" },
                                { icon: Send, href: "#", label: "تليغرام" }
                            ].map((social, idx) => (
                                <motion.a
                                    key={idx}
                                    href={social.href}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.7 + (idx * 0.1) }}
                                    whileHover={{
                                        scale: 1.2,
                                        borderColor: "rgba(197, 168, 128, 0.8)",
                                        boxShadow: "0 0 20px rgba(197, 168, 128, 0.4)"
                                    }}
                                    className="w-14 h-14 rounded-full border border-white/15 backdrop-blur-xl bg-white/5 flex items-center justify-center text-white transition-all shadow-lg"
                                    title={social.label}
                                >
                                    <social.icon className="w-6 h-6" />
                                </motion.a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
            >
                <div className="w-1 h-12 rounded-full bg-gradient-to-b from-gold/50 to-transparent" />
            </motion.div>
        </section>
    );
};
