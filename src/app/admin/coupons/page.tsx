"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Ticket, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

interface Coupon {
    id: string;
    code: string;
    discount_percent: number;
    is_active: boolean;
    created_at: string;
}

export default function AdminCouponsPage() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

    // Form states
    const [code, setCode] = useState("");
    const [discount, setDiscount] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        setLoading(true);
        try {
            const resp = await fetch("/api/coupons");
            const data = await resp.json();
            setCoupons(Array.isArray(data) ? data : []);
        } catch (err) {
            toast.error("فشل جلب الكوبونات");
        }
        setLoading(false);
    };

    const handleEdit = (coupon: Coupon) => {
        setEditingCoupon(coupon);
        setCode(coupon.code);
        setDiscount(coupon.discount_percent.toString());
        setIsActive(coupon.is_active);
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("هل أنت متأكد من حذف هذا الكوبون؟")) return;
        try {
            const resp = await fetch(`/api/coupons?id=${id}`, { method: "DELETE" });
            if (resp.ok) {
                toast.success("تم الحذف بنجاح");
                fetchCoupons();
            } else {
                toast.error("فشل الحذف");
            }
        } catch (err) {
            toast.error("خطأ في الخادم");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const payload = {
            code: code.trim().toUpperCase(),
            discount_percent: Number(discount),
            is_active: isActive
        };

        try {
            const method = editingCoupon ? "PATCH" : "POST";
            const url = "/api/coupons";
            const body = editingCoupon ? { ...payload, id: editingCoupon.id } : payload;

            const resp = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            if (resp.ok) {
                toast.success(editingCoupon ? "تم التحديث" : "تمت الإضافة");
                setIsFormOpen(false);
                setEditingCoupon(null);
                setCode("");
                setDiscount("");
                setIsActive(true);
                fetchCoupons();
            } else {
                const data = await resp.json();
                toast.error(data.error || "فشل الطلب");
            }
        } catch (err) {
            toast.error("خطأ في الخادم");
        }
        setIsSubmitting(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-black text-navy">إدارة الكوبونات</h2>
                    <p className="text-sm text-gray-500">قم بإنشاء وإدارة أكواد الخصم لعملائك</p>
                </div>
                <button
                    onClick={() => {
                        setEditingCoupon(null);
                        setCode("");
                        setDiscount("");
                        setIsActive(true);
                        setIsFormOpen(true);
                    }}
                    className="flex items-center gap-2 bg-navy text-white px-5 py-2.5 rounded-xl font-bold hover:bg-gold transition-all"
                >
                    <Plus className="w-5 h-5" />
                    إضافة كوبون جديد
                </button>
            </div>

            {/* Coupons List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-12 flex justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-navy" />
                    </div>
                ) : coupons.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">
                        <Ticket className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>لا توجد كوبونات حالياً</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-right border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-sm font-bold text-navy">الكود</th>
                                    <th className="px-6 py-4 text-sm font-bold text-navy">نسبة الخصم</th>
                                    <th className="px-6 py-4 text-sm font-bold text-navy">الحالة</th>
                                    <th className="px-6 py-4 text-sm font-bold text-navy text-left">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {coupons.map((coupon) => (
                                    <tr key={coupon.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="font-mono font-black text-navy bg-sky-50 px-3 py-1 rounded-lg">
                                                {coupon.code}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gold">
                                            {coupon.discount_percent}%
                                        </td>
                                        <td className="px-6 py-4">
                                            {coupon.is_active ? (
                                                <span className="flex items-center gap-1.5 text-green-600 text-xs font-bold">
                                                    <CheckCircle className="w-4 h-4" />
                                                    فعال
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1.5 text-red-500 text-xs font-bold">
                                                    <XCircle className="w-4 h-4" />
                                                    متوقف
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-left">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(coupon)}
                                                    className="p-2 text-navy hover:bg-navy/5 rounded-lg transition-colors"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(coupon.id)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            {isFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/40 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                        <h3 className="text-xl font-black text-navy mb-6">
                            {editingCoupon ? "تعديل الكوبون" : "إضافة كوبون جديد"}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-navy mb-2">كود الخصم</label>
                                <input
                                    type="text"
                                    required
                                    value={code}
                                    onChange={e => setCode(e.target.value)}
                                    placeholder="مثال: SAVE20"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gold font-mono uppercase"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-navy mb-2">نسبة الخصم (%)</label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    max="100"
                                    value={discount}
                                    onChange={e => setDiscount(e.target.value)}
                                    placeholder="مثال: 10"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gold"
                                />
                            </div>
                            <div className="flex items-center gap-3 py-2">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    checked={isActive}
                                    onChange={e => setIsActive(e.target.checked)}
                                    className="w-5 h-5 rounded border-gray-300 text-navy focus:ring-gold"
                                />
                                <label htmlFor="is_active" className="text-sm font-bold text-navy">تفعيل الكود</label>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 bg-navy text-white py-3 rounded-xl font-bold hover:bg-gold transition-all disabled:opacity-50"
                                >
                                    {isSubmitting ? "جاري الحفظ..." : "حفظ الكوبون"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsFormOpen(false)}
                                    className="px-6 py-3 rounded-xl font-bold border border-gray-200 hover:bg-gray-50 transition-all"
                                >
                                    إلغاء
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
