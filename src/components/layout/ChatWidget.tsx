"use client";

import React, { useState, useRef, useEffect } from "react";
import { useChat } from "ai/react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Minimize2, Maximize2 } from "lucide-react";

export const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();

    // Auto-scroll to bottom
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <>
            {/* Floating Toggle Button */}
            {!isOpen && (
                <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 z-[9999] w-16 h-16 bg-navy text-white rounded-full shadow-2xl flex items-center justify-center border-2 border-gold/30 backdrop-blur-md"
                >
                    <MessageCircle className="w-8 h-8" />
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-gold"></span>
                    </span>
                </motion.button>
            )}

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.9 }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            height: isMinimized ? "64px" : "600px"
                        }}
                        exit={{ opacity: 0, y: 100, scale: 0.9 }}
                        className="fixed bottom-6 right-6 z-[9999] w-[90vw] md:w-96 bg-white rounded-3xl shadow-2xl overflow-hidden border border-sky-100 flex flex-col transition-all duration-300"
                    >
                        {/* Header */}
                        <div className="bg-navy p-4 flex items-center justify-between text-white">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center border border-gold/50">
                                    <Bot className="w-5 h-5 text-gold" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">مساعد تسواهن الذكي</h3>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                        <span className="text-[10px] opacity-70">متصل الآن</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setIsMinimized(!isMinimized)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                                    {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                                </button>
                                <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {!isMinimized && (
                            <>
                                {/* Messages Area */}
                                <div
                                    ref={chatContainerRef}
                                    className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-sky-50/50 to-white"
                                >
                                    {messages.length === 0 && (
                                        <div className="text-center py-6 space-y-3">
                                            <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto">
                                                <Bot className="w-8 h-8 text-navy opacity-40" />
                                            </div>
                                            <p className="text-sm text-sky-600 font-medium px-4">
                                                مرحباً بك في مكتبة تسواهن! أنا هنا لمساعدتك في العثور على كتابك المفضل. ماذا تحب أن تقرأ اليوم؟
                                            </p>
                                        </div>
                                    )}

                                    {messages.map((m) => (
                                        <div
                                            key={m.id}
                                            className={`flex ${m.role === "user" ? "justify-start" : "justify-end"}`}
                                        >
                                            <div className={`flex gap-2 max-w-[85%] ${m.role === "user" ? "flex-row" : "flex-row-reverse"}`}>
                                                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center border ${m.role === "user" ? "bg-sky-100 border-sky-200" : "bg-gold/10 border-gold/30"
                                                    }`}>
                                                    {m.role === "user" ? <User className="w-4 h-4 text-navy" /> : <Bot className="w-4 h-4 text-gold" />}
                                                </div>
                                                <div className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${m.role === "user"
                                                        ? "bg-sky-100 text-navy rounded-tr-none"
                                                        : "bg-white border border-sky-100 text-slate-700 rounded-tl-none"
                                                    }`}>
                                                    {m.content}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {isLoading && (
                                        <div className="flex justify-end">
                                            <div className="bg-white border border-sky-100 p-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                                                <div className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce" />
                                                <div className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce [animation-delay:0.2s]" />
                                                <div className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce [animation-delay:0.4s]" />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Input Area */}
                                <form onSubmit={handleSubmit} className="p-4 border-t border-sky-100 bg-white">
                                    <div className="relative">
                                        <input
                                            value={input}
                                            onChange={handleInputChange}
                                            placeholder="اكتب رسالتك هنا..."
                                            className="w-full bg-sky-50/50 border border-sky-100 rounded-2xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-navy/10 focus:border-navy/20 transition-all"
                                        />
                                        <button
                                            type="submit"
                                            disabled={!input.trim() || isLoading}
                                            className="absolute left-2 top-1.5 bg-navy text-white p-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gold transition-colors"
                                        >
                                            <Send className="w-4 h-4 rotate-180" />
                                        </button>
                                    </div>
                                    <p className="text-[9px] text-center mt-2 text-slate-400">
                                        مدعوم بالذكاء الاصطناعي - خبير مكتبة تسواهن
                                    </p>
                                </form>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
