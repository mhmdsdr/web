"use client";

import { useState, useEffect } from "react";
import { Book } from "@/data/books";
import { AddBookForm } from "@/components/admin/AddBookForm";
import { Trash2, Plus, BookOpen, Search, RefreshCw, CheckCircle2, CircleOff } from "lucide-react";

export default function AdminBooksPage() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [search, setSearch] = useState("");
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [editingBook, setEditingBook] = useState<Book | null>(null);
    const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

    // Fetch books from API
    const fetchBooks = () => {
        setLoading(true);
        fetch("/api/books")
            .then(r => r.json())
            .then((data: Book[]) => setBooks(data))
            .catch(() => setBooks([]))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchBooks();
        // Open add-form if navigated with ?action=add
        if (typeof window !== "undefined") {
            const p = new URLSearchParams(window.location.search);
            if (p.get("action") === "add") setShowForm(true);
        }
    }, []);

    // Auto-dismiss toast
    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(() => setToast(null), 3000);
        return () => clearTimeout(t);
    }, [toast]);

    const filtered = books.filter(b =>
        b.title.includes(search) || b.author.includes(search) || b.category.includes(search)
    );

    // Add or Update via API then update local state
    const handleSave = async (data: Omit<Book, "id">, id?: string) => {
        const isUpdate = !!id;
        const res = await fetch("/api/books", {
            method: isUpdate ? "PATCH" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(isUpdate ? { ...data, id } : data),
        });

        if (res.ok) {
            const savedBook: Book = await res.json();
            if (isUpdate) {
                setBooks(prev => prev.map(b => b.id === id ? savedBook : b));
                setEditingBook(null);
            } else {
                setBooks(prev => [savedBook, ...prev]);
                setShowForm(false);
            }
            setToast({ msg: isUpdate ? `تم تحديث "${savedBook.title}"` : `تمت إضافة "${savedBook.title}" بنجاح`, type: "success" });
        } else {
            setToast({ msg: isUpdate ? "فشل في تحديث الكتاب" : "فشل في إضافة الكتاب", type: "error" });
        }
    };

    // Toggle stock status
    const handleToggleStock = async (id: string, currentStatus: boolean) => {
        const res = await fetch("/api/books", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, inStock: !currentStatus }),
        });
        if (res.ok) {
            setBooks(prev => prev.map(b => b.id === id ? { ...b, inStock: !currentStatus } : b));
            setToast({ msg: "تم تحديث حالة التوفر", type: "success" });
        } else {
            setToast({ msg: "فشل في تحديث الحالة", type: "error" });
        }
    };

    // Delete via API then update local state
    const handleDelete = async (id: string) => {
        const title = books.find(b => b.id === id)?.title;
        const res = await fetch(`/api/books?id=${id}`, { method: "DELETE" });
        setDeleteConfirm(null);
        if (res.ok) {
            setBooks(prev => prev.filter(b => b.id !== id));
            setToast({ msg: `تم حذف "${title}"`, type: "error" });
        } else {
            setToast({ msg: "فشل في حذف الكتاب", type: "error" });
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
                        <p className="text-sm mb-6" style={{ color: "#2A6EA6" }}>هل أنت متأكد؟ لا يمكن التراجع.</p>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={() => handleDelete(deleteConfirm)}
                                className="px-6 py-2.5 rounded-xl font-bold text-white hover:opacity-80"
                                style={{ backgroundColor: "#e05252" }}
                            >حذف</button>
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-6 py-2.5 rounded-xl font-bold hover:opacity-70"
                                style={{ backgroundColor: "#B8D9F0", color: "#1A3550" }}
                            >إلغاء</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Page header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black" style={{ color: "#1A3550" }}>إدارة الكتب</h2>
                    <p className="text-sm mt-0.5" style={{ color: "#2A6EA6" }}>{books.length} كتاب في المكتبة</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={fetchBooks}
                        className="p-2.5 rounded-full transition-opacity hover:opacity-70"
                        style={{ backgroundColor: "#B8D9F0", color: "#1A3550" }}
                        title="تحديث"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                    </button>
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-white hover:opacity-80 shadow-md"
                        style={{ backgroundColor: "#C5A880" }}
                    >
                        <Plus className="w-4 h-4" />
                        إضافة كتاب جديد
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="relative max-w-xs">
                <Search className="absolute inset-y-0 my-auto right-3 w-4 h-4 pointer-events-none" style={{ color: "#2A6EA6" }} />
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="ابحث في الكتب..."
                    className="w-full pr-9 pl-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
                    style={{ borderColor: "#B8D9F0", backgroundColor: "white", color: "#1A3550" }}
                />
            </div>

            {/* Table */}
            <div className="rounded-2xl overflow-hidden shadow-sm" style={{ border: "1px solid #B8D9F0" }}>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr style={{ backgroundColor: "#B8D9F0" }}>
                                {["الغلاف", "عنوان الكتاب", "المؤلف", "التصنيف", "السعر", "الحالة", "إجراءات"].map(h => (
                                    <th key={h} className="px-5 py-3 text-right font-bold" style={{ color: "#1A3550" }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array.from({ length: 4 }).map((_, i) => (
                                    <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#F0F8FF" : "#E8F4FD" }}>
                                        {Array.from({ length: 6 }).map((__, j) => (
                                            <td key={j} className="px-5 py-4">
                                                <div className="h-4 rounded-full animate-pulse" style={{ backgroundColor: "#B8D9F0", width: j === 0 ? "40px" : "70%" }} />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-12" style={{ color: "#2A6EA6", backgroundColor: "#F0F8FF" }}>
                                        لا توجد نتائج مطابقة
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((book, i) => (
                                    <tr key={book.id} className="border-t hover:brightness-95 transition-all"
                                        style={{ borderColor: "#daeef9", backgroundColor: i % 2 === 0 ? "#F0F8FF" : "#E8F4FD" }}
                                    >
                                        <td className="px-5 py-3">
                                            <div className="w-10 h-14 rounded-lg overflow-hidden flex items-center justify-center" style={{ backgroundColor: "#B8D9F0" }}>
                                                {(book.image_url || book.coverImage)
                                                    ? <img src={book.image_url || book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                                                    : <BookOpen className="w-5 h-5" style={{ color: "#2A6EA6" }} />}
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 max-w-[180px]">
                                            <p className="font-bold line-clamp-1" style={{ color: "#1A3550" }}>{book.title}</p>
                                            {book.description && <p className="text-xs line-clamp-1 mt-0.5" style={{ color: "#2A6EA6" }}>{book.description}</p>}
                                        </td>
                                        <td className="px-5 py-3" style={{ color: "#2A6EA6" }}>{book.author}</td>
                                        <td className="px-5 py-3">
                                            <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: "#B8D9F0", color: "#1A3550" }}>
                                                {book.category}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 font-bold" style={{ color: "#C5A880" }}>
                                            {book.price.toLocaleString("ar-IQ")} د.ع
                                        </td>
                                        <td className="px-5 py-3">
                                            <button
                                                onClick={() => handleToggleStock(book.id, book.inStock !== false)}
                                                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${book.inStock !== false
                                                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                                                    : "bg-red-100 text-red-700 hover:bg-red-200"
                                                    }`}
                                            >
                                                {book.inStock !== false ? (
                                                    <><CheckCircle2 className="w-3.5 h-3.5" /> متوفر</>
                                                ) : (
                                                    <><CircleOff className="w-3.5 h-3.5" /> نفذت</>
                                                )}
                                            </button>
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex gap-2 justify-end">
                                                <button
                                                    onClick={() => setEditingBook(book)}
                                                    className="p-2 rounded-lg hover:opacity-80 transition-opacity"
                                                    style={{ backgroundColor: "#e8f4fd", color: "#2A6EA6" }}
                                                >
                                                    <BookOpen className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirm(book.id)}
                                                    className="p-2 rounded-lg hover:opacity-80 transition-opacity"
                                                    style={{ backgroundColor: "#fde8e8", color: "#e05252" }}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showForm && <AddBookForm onSave={handleSave} onClose={() => setShowForm(false)} />}
            {editingBook && <AddBookForm initialData={editingBook} onSave={handleSave} onClose={() => setEditingBook(null)} />}
        </div>
    );
}
