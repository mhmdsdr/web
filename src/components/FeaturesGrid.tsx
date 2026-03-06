"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search, Truck, CreditCard, Headphones, LucideIcon } from "lucide-react";
import Link from "next/link";

interface FeatureItem {
    icon: LucideIcon;
    title: string;
    description: string;
    gradient: string;
    iconBg: string;
}

const features: FeatureItem[] = [
    {
        icon: Search,
        title: "تنوع الكتب",
        description: "آلاف الكتب في مختلف المجالات العلمية، الأدبية والتربوية.",
        gradient: "from-[#E0F2FE] to-[#BAE6FD]",
        iconBg: "bg-blue-500",
    },
    {
        icon: Truck,
        title: "توصيل سريع",
        description: "خدمة توصيل تغطي جميع محافظات العراق وبأسعار تنافسية.",
        gradient: "from-[#F0FDF4] to-[#DCFCE7]",
        iconBg: "bg-green-500",
    },
    {
        icon: CreditCard,
        title: "دفع آمن",
        description: "خيارات دفع متعددة تضمن لك الراحة، الدفع عند الاستلام.",
        gradient: "from-[#FFFBEB] to-[#FEF3C7]",
        iconBg: "bg-amber-500",
    },
    {
        icon: Headphones,
        title: "دعم فني",
        description: "فريق جاهز للرد على استفساراتكم وحل مشاكلكم على مدار الساعة.",
        gradient: "from-[#FAF5FF] to-[#F3E8FF]",
        iconBg: "bg-purple-500",
    },
];

export const FeaturesGrid = () => {
    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                    >
                        <Link href="/books">
                            <motion.div
                                whileHover={{
                                    scale: 1.05,
                                    translateY: -10,
                                    boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
                                }}
                                className={`relative p-8 rounded-[2.5rem] bg-gradient-to-br ${feature.gradient} border border-white/50 backdrop-blur-sm transition-all duration-300 group cursor-pointer h-full flex flex-col items-center text-center`}
                            >
                                {/* Icon Container */}
                                <div className={`mb-6 p-4 rounded-2xl ${feature.iconBg} text-white shadow-lg group-hover:rotate-12 transition-transform duration-300`}>
                                    <feature.icon size={32} strokeWidth={2.5} />
                                </div>

                                {/* Title */}
                                <h3 className="text-xl font-bold text-[#1A3550] mb-3">
                                    {feature.title}
                                </h3>

                                {/* Description */}
                                <p className="text-[#2A6EA6] text-sm leading-relaxed">
                                    {feature.description}
                                </p>

                                {/* Accent Circle */}
                                <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-white/30 rounded-full blur-xl pointer-events-none" />
                            </motion.div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};
