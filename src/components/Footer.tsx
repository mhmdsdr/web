"use client";

import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Instagram, Send, Phone, MapPin, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const Footer = () => {
    return (
        <section className="relative w-full py-20 overflow-hidden">
            {/* Background Image with Blur */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 hover:scale-105"
                style={{
                    backgroundImage: "url('/library_shelf_bg_1772809391684.png')",
                    filter: "brightness(0.35) contrast(1.1)"
                }}
            />

            {/* Overlay Gradient */}
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#1A3550] via-transparent to-transparent opacity-80" />

            <div className="relative z-20 max-w-4xl mx-auto px-4 flex flex-col items-center text-center space-y-12">

                {/* Main Pill Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <Link href="/">
                        <motion.button
                            whileHover={{ scale: 1.03, boxShadow: "0 0 25px rgba(197, 168, 128, 0.4)" }}
                            whileTap={{ scale: 0.97 }}
                            className="group relative flex items-center gap-3 px-10 py-5 rounded-full border border-gold/40 backdrop-blur-xl bg-white/10 text-white font-bold text-xl shadow-2xl transition-all"
                        >
                            <BookOpen className="w-6 h-6 text-gold group-hover:rotate-12 transition-transform" />
                            <span>تصفح جميع الكتب</span>
                            <ArrowLeft className="w-5 h-5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                        </motion.button>
                    </Link>
                </motion.div>

                {/* Social & Location Group */}
                <div className="flex flex-col md:flex-row items-center gap-6">

                    {/* Social Icons */}
                    <div className="flex items-center gap-4">
                        {[
                            { icon: Phone, href: "tel:07739118013", label: "Phone" },
                            { icon: Instagram, href: "#", label: "Instagram" },
                            { icon: Send, href: "#", label: "Telegram" }
                        ].map((social, idx) => (
                            <motion.a
                                key={idx}
                                href={social.href}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 * idx }}
                                whileHover={{
                                    scale: 1.15,
                                    borderColor: "rgba(197, 168, 128, 0.8)",
                                    boxShadow: "0 0 15px rgba(197, 168, 128, 0.3)"
                                }}
                                className="w-14 h-14 rounded-full border border-white/20 backdrop-blur-lg bg-white/5 flex items-center justify-center text-white transition-all cursor-pointer"
                            >
                                <social.icon className="w-6 h-6" />
                            </motion.a>
                        ))}
                    </div>

                    {/* Location Pill */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-3 px-8 py-4 rounded-full border border-white/20 backdrop-blur-lg bg-white/5 text-white/90 font-medium shadow-xl cursor-default"
                    >
                        <MapPin className="w-5 h-5 text-gold" />
                        <span className="text-lg">ميسان، العمارة</span>
                    </motion.div>
                </div>

                {/* Simple Copyright */}
                <p className="text-white/40 text-sm font-medium pt-8 tracking-widest">
                    © ٢٠٢٤ مكتبة تسواهن. جميع الحقوق محفوظة
                </p>
            </div>
        </section>
    );
};
