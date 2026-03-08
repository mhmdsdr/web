"use client";

import { useState, useRef, useCallback } from "react";
import { CATEGORIES } from "@/data/books";
import { Book } from "@/data/books";
import { X, Upload, ImageIcon } from "lucide-react";

// ─── Helpers at module scope (NOT inside the component) ───────────────────────
// If these were defined inside AddBookForm, React would treat them as new
// component types on every render and unmount/remount them — losing focus.

interface FieldProps {
    label: string;
    id: string;
    required?: boolean;
    error?: string;
    children: React.ReactNode;
}

function Field({ label, id, required = false, error, children }: FieldProps) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-semibold mb-1" style={{ color: "#1A3550" }}>
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            {children}
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}

function inputClass(hasError: boolean) {
    return `w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-colors ${hasError ? "border-red-400 focus:ring-red-200" : "focus:ring-sky-300"
        }`;
}
// ──────────────────────────────────────────────────────────────────────────────

interface AddBookFormProps {
    onAdd: (book: Omit<Book, "id">) => Promise<void>;
    onClose: () => void;
}

export function AddBookForm({ onAdd, onClose }: AddBookFormProps) {
    const [form, setForm] = useState({
        title: "",
        author: "",
        price: "",
        category: CATEGORIES[0],
        description: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);

    // File upload state
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const set = (key: string, val: string) =>
        setForm(f => ({ ...f, [key]: val }));

    const processFile = (file: File) => {
        setUploadError(null);
        const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        if (!allowed.includes(file.type)) {
            setUploadError("يُسمح فقط بملفات JPG, PNG, WEBP");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setUploadError("حجم الملف يتجاوز الحد الأقصى (5 ميغابايت)");
            return;
        }
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) processFile(file);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
        setUploadError(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const validate = () => {
        const e: Record<string, string> = {};
        if (!form.title.trim()) e.title = "العنوان مطلوب";
        if (!form.author.trim()) e.author = "اسم المؤلف مطلوب";
        if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
            e.price = "أدخل سعراً صحيحاً";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setSubmitting(true);

        let image_url: string | undefined;

        if (imageFile) {
            setUploading(true);
            try {
                const fd = new FormData();
                fd.append("file", imageFile);
                const res = await fetch("/api/upload", { method: "POST", body: fd });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "فشل رفع الصورة");
                image_url = data.url;
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : "فشل رفع الصورة";
                setUploadError(message);
                setSubmitting(false);
                setUploading(false);
                return;
            }
            setUploading(false);
        }

        try {
            await onAdd({
                title: form.title.trim(),
                author: form.author.trim(),
                price: Number(form.price),
                category: form.category,
                image_url,
                description: form.description.trim() || undefined,
            });
        } catch (err: unknown) {
            console.error("Add book error:", err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(26,53,80,0.6)", backdropFilter: "blur(4px)" }}
        >
            <div
                className="w-full max-w-lg rounded-2xl sm:rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[92vh] sm:max-h-[85vh] flex flex-col mx-2 sm:mx-0"
                style={{ backgroundColor: "#F0F8FF" }}
            >
                {/* Header */}
                <div
                    className="flex items-center justify-between px-6 py-4 flex-shrink-0"
                    style={{ backgroundColor: "#B8D9F0" }}
                >
                    <h2 className="text-lg font-black" style={{ color: "#1A3550" }}>إضافة كتاب جديد</h2>
                    <button onClick={onClose} className="p-1 rounded-lg hover:opacity-70 transition-opacity">
                        <X className="w-5 h-5" style={{ color: "#1A3550" }} />
                    </button>
                </div>

                {/* Scrollable Form */}
                <form onSubmit={handleSubmit} className="p-4 sm:p-8 space-y-4 sm:space-y-6 overflow-y-auto flex-1 text-right" noValidate>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="عنوان الكتاب" id="title" required error={errors.title}>
                            <input
                                id="title"
                                value={form.title}
                                onChange={e => set("title", e.target.value)}
                                placeholder="مثال: صاحب الظل الطويل"
                                className={inputClass(!!errors.title)}
                                style={{ borderColor: "#B8D9F0", backgroundColor: "white", color: "#1A3550" }}
                            />
                        </Field>

                        <Field label="اسم المؤلف" id="author" required error={errors.author}>
                            <input
                                id="author"
                                value={form.author}
                                onChange={e => set("author", e.target.value)}
                                placeholder="مثال: جين ويبستر"
                                className={inputClass(!!errors.author)}
                                style={{ borderColor: "#B8D9F0", backgroundColor: "white", color: "#1A3550" }}
                            />
                        </Field>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="السعر (د.ع)" id="price" required error={errors.price}>
                            <input
                                id="price"
                                type="number"
                                min="1"
                                value={form.price}
                                onChange={e => set("price", e.target.value)}
                                placeholder="مثال: 8000"
                                className={inputClass(!!errors.price)}
                                style={{ borderColor: "#B8D9F0", backgroundColor: "white", color: "#1A3550" }}
                                dir="ltr"
                            />
                        </Field>

                        <Field label="التصنيف" id="category">
                            <select
                                id="category"
                                value={form.category}
                                onChange={e => set("category", e.target.value)}
                                className={inputClass(false)}
                                style={{ borderColor: "#B8D9F0", backgroundColor: "white", color: "#1A3550" }}
                            >
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </Field>
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-semibold mb-2" style={{ color: "#1A3550" }}>
                            صورة الغلاف
                        </label>

                        {imagePreview ? (
                            <div className="relative w-full h-48 rounded-xl overflow-hidden border-2"
                                style={{ borderColor: "#B8D9F0" }}
                            >
                                <img
                                    src={imagePreview}
                                    alt="معاينة الغلاف"
                                    className="w-full h-full object-contain"
                                    style={{ backgroundColor: "#E8F4FD" }}
                                />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute top-2 left-2 p-1.5 rounded-full text-white shadow-md hover:opacity-80"
                                    style={{ backgroundColor: "#e05252" }}
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                <div
                                    className="absolute bottom-2 right-2 px-3 py-1 rounded-full text-xs font-medium"
                                    style={{ backgroundColor: "rgba(26,53,80,0.75)", color: "white" }}
                                >
                                    {imageFile?.name}
                                </div>
                            </div>
                        ) : (
                            <div
                                className="w-full h-40 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors"
                                style={{
                                    borderColor: dragOver ? "#2A6EA6" : "#B8D9F0",
                                    backgroundColor: dragOver ? "#daeef9" : "#E8F4FD",
                                }}
                                onClick={() => fileInputRef.current?.click()}
                                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={handleDrop}
                            >
                                <div className="w-12 h-12 rounded-full flex items-center justify-center"
                                    style={{ backgroundColor: "#B8D9F0" }}
                                >
                                    {dragOver
                                        ? <Upload className="w-6 h-6" style={{ color: "#2A6EA6" }} />
                                        : <ImageIcon className="w-6 h-6" style={{ color: "#2A6EA6" }} />}
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-semibold" style={{ color: "#1A3550" }}>
                                        اسحب الصورة هنا أو <span style={{ color: "#2A6EA6" }}>اختر ملفاً</span>
                                    </p>
                                    <p className="text-xs mt-0.5" style={{ color: "#2A6EA6" }}>
                                        JPG, PNG, WEBP — حتى 5 ميغابايت
                                    </p>
                                </div>
                            </div>
                        )}

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        {uploadError && <p className="text-red-500 text-xs mt-1">{uploadError}</p>}
                    </div>

                    {/* Description */}
                    <Field label="الوصف" id="description">
                        <textarea
                            id="description"
                            value={form.description}
                            onChange={e => set("description", e.target.value)}
                            placeholder="وصف مختصر للكتاب..."
                            rows={3}
                            className={`${inputClass(false)} resize-none`}
                            style={{ borderColor: "#B8D9F0", backgroundColor: "white", color: "#1A3550" }}
                        />
                    </Field>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={submitting || uploading}
                            className="flex-1 py-3 rounded-xl font-bold text-white disabled:opacity-60 flex items-center justify-center gap-2"
                            style={{ backgroundColor: "#2A6EA6" }}
                        >
                            {(submitting || uploading) ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    {uploading ? "جاري رفع الصورة..." : "جاري الحفظ..."}
                                </>
                            ) : "حفظ الكتاب"}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 rounded-xl font-bold hover:opacity-70"
                            style={{ backgroundColor: "#B8D9F0", color: "#1A3550" }}
                        >
                            إلغاء
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
