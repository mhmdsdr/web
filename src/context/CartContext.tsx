"use client";

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";

export interface CartItem {
    id: string;
    title: string;
    author: string;
    price: number;
    quantity: number;
    coverImage?: string;
}

interface CartContextType {
    items: CartItem[];
    isCartOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    addItem: (item: Omit<CartItem, "quantity">) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    cartItemCount: number;
    subtotal: number;
    cartTotal: number; // Final total after discount
    couponCode: string;
    discountPercent: number;
    applyCoupon: (code: string) => Promise<{ success: boolean; error?: string }>;
    removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [couponCode, setCouponCode] = useState("");
    const [discountPercent, setDiscountPercent] = useState(0);

    // Load from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem("tswah-cart");
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to parse cart from localStorage", e);
            }
        }

        const savedCoupon = localStorage.getItem("tswah-coupon");
        if (savedCoupon) {
            try {
                const { code, percent } = JSON.parse(savedCoupon);
                setCouponCode(code);
                setDiscountPercent(percent);
            } catch (e) { }
        }
    }, []);

    // Save to localStorage on change
    useEffect(() => {
        localStorage.setItem("tswah-cart", JSON.stringify(items));
    }, [items]);

    useEffect(() => {
        if (couponCode && discountPercent) {
            localStorage.setItem("tswah-coupon", JSON.stringify({ code: couponCode, percent: discountPercent }));
        } else {
            localStorage.removeItem("tswah-coupon");
        }
    }, [couponCode, discountPercent]);

    const openCart = useCallback(() => setIsCartOpen(true), []);
    const closeCart = useCallback(() => setIsCartOpen(false), []);

    const addItem = useCallback((newItem: Omit<CartItem, "quantity">) => {
        setItems(prev => {
            const existing = prev.find(item => item.id === newItem.id);
            if (existing) {
                return prev.map(item =>
                    item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...newItem, quantity: 1 }];
        });
        setIsCartOpen(true);
    }, []);

    const removeItem = useCallback((id: string) => {
        setItems(prev => prev.filter(item => item.id !== id));
    }, []);

    const updateQuantity = useCallback((id: string, quantity: number) => {
        setItems(prev =>
            prev.map(item => (item.id === id ? { ...item, quantity } : item))
        );
    }, []);

    const clearCart = useCallback(() => {
        setItems([]);
        setCouponCode("");
        setDiscountPercent(0);
        setIsCartOpen(false);
    }, []);

    const applyCoupon = async (code: string) => {
        try {
            const resp = await fetch(`/api/coupons?code=${encodeURIComponent(code.trim())}`);
            const data = await resp.json();
            if (resp.ok) {
                setCouponCode(code.trim().toUpperCase());
                setDiscountPercent(data.discount_percent);
                return { success: true };
            } else {
                return { success: false, error: data.error };
            }
        } catch (err) {
            return { success: false, error: "خطأ في الاتصال بالسيرفر" };
        }
    };

    const removeCoupon = useCallback(() => {
        setCouponCode("");
        setDiscountPercent(0);
    }, []);

    const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const cartTotal = subtotal * (1 - discountPercent / 100);

    return (
        <CartContext.Provider
            value={{
                items,
                isCartOpen,
                openCart,
                closeCart,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                cartItemCount,
                subtotal,
                cartTotal,
                couponCode,
                discountPercent,
                applyCoupon,
                removeCoupon,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used inside a CartProvider");
    }
    return context;
}
