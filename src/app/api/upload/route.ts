import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

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

        // Ensure uploads directory exists
        const uploadsDir = path.join(process.cwd(), "public", "uploads");
        await mkdir(uploadsDir, { recursive: true });

        // Create a unique filename
        const ext = file.name.split(".").pop() ?? "jpg";
        const filename = `book-${Date.now()}.${ext}`;
        const filepath = path.join(uploadsDir, filename);

        // Write file to disk
        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(filepath, buffer);

        return NextResponse.json({ url: `/uploads/${filename}` });
    } catch (err) {
        console.error("Upload error:", err);
        return NextResponse.json({ error: "حدث خطأ أثناء رفع الملف" }, { status: 500 });
    }
}
