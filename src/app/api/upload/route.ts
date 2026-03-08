import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ error: "لم يتم إرسال أي ملف" }, { status: 400 });
        }

        // Validate file type
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: "نوع الملف غير مدعوم. يُسمح فقط بـ JPG, PNG, WEBP" },
                { status: 400 }
            );
        }

        // Validate file size (5 MB max)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json(
                { error: "حجم الملف يتجاوز 5 ميغابايت" },
                { status: 400 }
            );
        }

        // Create a unique filename
        const ext = file.name.split(".").pop() ?? "jpg";
        const filename = `book-${Date.now()}.${ext}`;

        if (!supabase) {
            console.error("❌ Supabase client is not initialized. Check your environment variables.");
            return NextResponse.json({ error: "خطأ في تكوين الخادم (سوبابيس)" }, { status: 500 });
        }

        // Upload to Supabase Storage
        const { data, error: uploadError } = await supabase.storage
            .from("book-images")
            .upload(filename, file, {
                cacheControl: "3600",
                upsert: false
            });

        if (uploadError) {
            console.error("Supabase Upload Error:", uploadError);
            return NextResponse.json({ error: "فشل رفع الصورة إلى سوبابيس" }, { status: 500 });
        }

        // Get Public URL
        const { data: { publicUrl } } = supabase.storage
            .from("book-images")
            .getPublicUrl(filename);

        return NextResponse.json({ url: publicUrl });
    } catch (err) {
        console.error("Upload error:", err);
        return NextResponse.json({ error: "حدث خطأ أثناء رفع الملف" }, { status: 500 });
    }
}
