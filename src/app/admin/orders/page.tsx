"use client";

import { useState, useEffect } from "react";
import { Clock, CheckCircle, Trash2, RefreshCw, ShoppingBag, MessageSquare, Copy } from "lucide-react";

interface OrderItem {
    bookTitle: string;
    price: number;
    quantity: number;
}

interface Order {
    orderId: string;
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    items: OrderItem[];
    total: number;
    status: "pending" | "completed";
    createdAt: string;
}

const STATUS_LABEL: Record<Order["status"], string> = {
    pending: "قيد الانتظار",
    completed: "مكتمل",
};

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
    const [expanded, setExpanded] = useState<string | null>(null);

    const fetchOrders = () => {
        setLoading(true);
        fetch("/api/orders")
            .then(r => r.json())
            .then((data: Order[]) => setOrders(data))
            .catch(() => setOrders([]))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchOrders(); }, []);

    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(() => setToast(null), 3000);
        return () => clearTimeout(t);
    }, [toast]);

    const handleStatusToggle = async (order: Order) => {
        const newStatus: Order["status"] = order.status === "pending" ? "completed" : "pending";
        const res = await fetch(`/api/orders?id=${order.orderId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus }),
        });
        if (res.ok) {
            setOrders(prev => prev.map(o => o.orderId === order.orderId ? { ...o, status: newStatus } : o));
            setToast({ msg: `تم تحديث حالة الطلب إلى "${STATUS_LABEL[newStatus]}"`, type: "success" });
        }
    };

    const handleWhatsAppClick = (order: Order) => {
        const bookNames = order.items.map(i => i.bookTitle).join(" و ");
        const message = `مرحباً ${order.customerName}، يسعدنا إبلاغك أن طلبك لـ (${bookNames}) قد اكتمل وجاهز للتوصيل. شكراً لاختيارك مكتبة تسواهن.`;
        const encodedMsg = encodeURIComponent(message);
        const url = `https://wa.me/${order.customerPhone.replace(/\s+/g, '')}?text=${encodedMsg}`;
        window.open(url, "_blank");
    };

    const handleCopyDetails = (order: Order) => {
        const bookNames = order.items.map(i => i.bookTitle).join(", ");
        const text = `رقم الطلب: ${order.orderId}\nالزبون: ${order.customerName}\nالكتب: ${bookNames}\nالمبلغ: ${order.total.toLocaleString("ar-IQ")} د.ع`;
        navigator.clipboard.writeText(text).then(() => {
            setToast({ msg: "تم نسخ تفاصيل الطلب للحافظة", type: "success" });
        });
    };

    const handleDelete = async (id: string) => {
        const res = await fetch(`/api/orders?id=${id}`, { method: "DELETE" });
        setDeleteConfirm(null);
        if (res.ok) {
            setOrders(prev => prev.filter(o => o.orderId !== id));
            setToast({ msg: "تم حذف الطلب", type: "error" });
        }
    };

    return (
        <div className="space-y-6">
            {/* Toast */}
            {toast && (
                <div
                    className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full shadow-xl text-white font-bold text-sm"
                    style={{ backgroundColor: toast.type === "success" ? "#2A6EA6" : "#e05252" }}
                >
                    {toast.msg}
                </div>
            )}

            {/* Delete confirmation */}
            {deleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center"
                    style={{ backgroundColor: "rgba(26,53,80,0.6)", backdropFilter: "blur(4px)" }}
                >
                    <div className="rounded-2xl p-6 w-80 text-center shadow-2xl" style={{ backgroundColor: "#F0F8FF" }}>
                        <p className="font-bold text-lg mb-2" style={{ color: "#1A3550" }}>تأكيد الحذف</p>
                        <p className="text-sm mb-6" style={{ color: "#2A6EA6" }}>هل أنت متأكد من حذف هذا الطلب؟</p>
                        <div className="flex gap-3 justify-center">
                            <button onClick={() => handleDelete(deleteConfirm!)}
                                className="px-6 py-2.5 rounded-xl font-bold text-white" style={{ backgroundColor: "#e05252" }}>حذف</button>
                            <button onClick={() => setDeleteConfirm(null)}
                                className="px-6 py-2.5 rounded-xl font-bold" style={{ backgroundColor: "#B8D9F0", color: "#1A3550" }}>إلغاء</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black" style={{ color: "#1A3550" }}>إدارة الطلبات</h2>
                    <p className="text-sm mt-0.5" style={{ color: "#2A6EA6" }}>{orders.length} طلب إجمالاً</p>
                </div>
                <button onClick={fetchOrders}
                    className="p-2.5 rounded-full hover:opacity-70 transition-opacity"
                    style={{ backgroundColor: "#B8D9F0", color: "#1A3550" }}
                    title="تحديث"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                </button>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-4">
                {[
                    {
                        label: "قيد الانتظار",
                        value: orders.filter(o => o.status === "pending").length,
                        icon: <Clock className="w-5 h-5" />, color: "#C5A880",
                    },
                    {
                        label: "مكتملة",
                        value: orders.filter(o => o.status === "completed").length,
                        icon: <CheckCircle className="w-5 h-5" />, color: "#2A6EA6",
                    },
                ].map(s => (
                    <div key={s.label} className="rounded-2xl p-5 flex items-center gap-4 shadow-sm"
                        style={{ backgroundColor: "#F0F8FF", border: "1px solid #B8D9F0" }}
                    >
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                            style={{ backgroundColor: s.color }}>
                            {s.icon}
                        </div>
                        <div>
                            <p className="text-2xl font-black" style={{ color: "#1A3550" }}>{s.value}</p>
                            <p className="text-xs" style={{ color: "#2A6EA6" }}>{s.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Orders list */}
            {loading ? (
                <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-20 rounded-2xl animate-pulse" style={{ backgroundColor: "#daeef9" }} />
                    ))}
                </div>
            ) : orders.length === 0 ? (
                <div className="text-center py-20 rounded-2xl"
                    style={{ backgroundColor: "#F0F8FF", border: "1px solid #B8D9F0" }}
                >
                    <ShoppingBag className="w-12 h-12 mx-auto mb-3" style={{ color: "#B8D9F0" }} />
                    <p className="font-bold" style={{ color: "#1A3550" }}>لا توجد طلبات حتى الآن</p>
                    <p className="text-sm mt-1" style={{ color: "#2A6EA6" }}>ستظهر هنا عند إتمام العملاء لطلباتهم</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {orders.map(order => (
                        <div key={order.orderId}
                            className="rounded-2xl overflow-hidden shadow-sm"
                            style={{ border: "1px solid #B8D9F0" }}
                        >
                            {/* Row */}
                            <div
                                className="px-5 py-4 flex flex-wrap gap-4 items-center cursor-pointer hover:brightness-95 transition-all"
                                style={{ backgroundColor: "#F0F8FF" }}
                                onClick={() => setExpanded(expanded === order.orderId ? null : order.orderId)}
                            >
                                {/* Order ID + date */}
                                <div className="flex-1 min-w-[140px]">
                                    <p className="font-bold text-sm" style={{ color: "#1A3550" }}>{order.orderId}</p>
                                    <p className="text-xs mt-0.5" style={{ color: "#2A6EA6" }}>
                                        {new Date(order.createdAt).toLocaleDateString("ar-IQ", {
                                            year: "numeric", month: "short", day: "numeric",
                                            hour: "2-digit", minute: "2-digit",
                                        })}
                                    </p>
                                </div>

                                {/* Customer */}
                                <div className="flex-1 min-w-[120px] group relative">
                                    <p className="font-semibold text-sm" style={{ color: "#1A3550" }}>{order.customerName}</p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-xs" style={{ color: "#2A6EA6" }} dir="ltr">{order.customerPhone}</p>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleWhatsAppClick(order); }}
                                                className="p-1 rounded-md hover:bg-[#dcfce7] transition-colors"
                                                title="مراسلة واتساب"
                                            >
                                                <MessageSquare className="w-3.5 h-3.5 text-[#25d366]" />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleCopyDetails(order); }}
                                                className="p-1 rounded-md hover:bg-sky-100 transition-colors"
                                                title="نسخ التفاصيل"
                                            >
                                                <Copy className="w-3.5 h-3.5 text-navy opacity-60" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Total */}
                                <span className="font-bold" style={{ color: "#C5A880" }}>
                                    {order.total.toLocaleString("ar-IQ")} د.ع
                                </span>

                                {/* Status badge */}
                                <span
                                    className="px-3 py-1 rounded-full text-xs font-bold"
                                    style={{
                                        backgroundColor: order.status === "completed" ? "#d1fae5" : "#fef3c7",
                                        color: order.status === "completed" ? "#065f46" : "#92400e",
                                    }}
                                >
                                    {STATUS_LABEL[order.status]}
                                </span>

                                {/* Actions */}
                                <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                                    <button
                                        onClick={() => handleStatusToggle(order)}
                                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-white transition-opacity hover:opacity-80"
                                        style={{ backgroundColor: order.status === "pending" ? "#2A6EA6" : "#C5A880" }}
                                    >
                                        {order.status === "pending" ? "تحديد كمكتمل" : "إعادة للانتظار"}
                                    </button>
                                    <button
                                        onClick={() => setDeleteConfirm(order.orderId)}
                                        className="p-1.5 rounded-xl transition-opacity hover:opacity-80"
                                        style={{ backgroundColor: "#fde8e8", color: "#e05252" }}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Expanded details */}
                            {expanded === order.orderId && (
                                <div className="px-5 py-4 border-t text-sm space-y-3"
                                    style={{ borderColor: "#B8D9F0", backgroundColor: "#E8F4FD" }}
                                >
                                    <p style={{ color: "#1A3550" }}>
                                        <span className="font-bold">العنوان: </span>{order.customerAddress}
                                    </p>
                                    <div>
                                        <p className="font-bold mb-1" style={{ color: "#1A3550" }}>الكتب المطلوبة:</p>
                                        <ul className="space-y-1">
                                            {order.items.map((item, i) => (
                                                <li key={i} className="flex justify-between">
                                                    <span style={{ color: "#2A6EA6" }}>{item.bookTitle} × {item.quantity}</span>
                                                    <span className="font-bold" style={{ color: "#C5A880" }}>
                                                        {(item.price * item.quantity).toLocaleString("ar-IQ")} د.ع
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
