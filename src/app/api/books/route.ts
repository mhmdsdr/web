import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface Book {
    id: string;
    title: string;
    author: string;
    price: number;
    category?: string;
    image_url?: string;
    description?: string;
}

// GET /api/books
export async function GET() {
    try {
        if (!isSupabaseConfigured()) {
            return NextResponse.json({ error: "Supabase data is not configured" }, { status: 500 });
        }

        const { data, error } = await supabase
            .from("books")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Supabase Fetch Error:", error.message);
            return NextResponse.json({ error: "فشل جلب الكتب" }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (err) {
        console.error("GET API Error:", err);
        return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
    }
}

// POST /api/books  — add a new book
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        if (!body.title || !body.author || !body.price) {
            return NextResponse.json({ error: "بيانات الكتاب غير مكتملة (العنوان، المؤلف، السعر)" }, { status: 400 });
        }

        if (!isSupabaseConfigured()) {
            return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 });
        }

        const { data, error } = await supabase
            .from("books")
            .insert([{
                title: body.title,
                author: body.author,
                price: Number(body.price),
                image_url: body.image_url || body.coverImage,
                description: body.description
            }])
            .select()
            .single();

        if (error) {
            console.error("Supabase Insert Error:", error.message);
            return NextResponse.json({ error: `فشل إضافة الكتاب: ${error.message}` }, { status: 500 });
        }

        return NextResponse.json(data, { status: 201 });
    } catch (err) {
        console.error("POST API Error:", err);
        return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
    }
}

// DELETE /api/books?id=xxx
export async function DELETE(req: NextRequest) {
    try {
        const id = req.nextUrl.searchParams.get("id");
        if (!id) return NextResponse.json({ error: "id مطلوب" }, { status: 400 });

        if (!isSupabaseConfigured()) {
            return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 });
        }

        const { error } = await supabase
            .from("books")
            .delete()
            .eq("id", id);

        if (error) {
            console.error("Supabase Delete Error:", error.message);
            return NextResponse.json({ error: "فشل حذف الكتاب" }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("DELETE API Error:", err);
        return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
    }
}

// PATCH /api/books  — update a book
export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json();
        if (!body.id) return NextResponse.json({ error: "id مطلوب" }, { status: 400 });

        if (!isSupabaseConfigured()) {
            return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 });
        }

        // Prepare update data (excluding id, mapping coverImage if present)
        const { id, coverImage, category, inStock, ...updateData } = body;
        if (coverImage || body.image_url) {
            updateData.image_url = coverImage || body.image_url;
        }

        const { data, error } = await supabase
            .from("books")
            .update(updateData)
            .eq("id", id)
            .select()
            .single();

        if (error) {
            console.error("Supabase Update Error:", error.message);
            return NextResponse.json({ error: "فشل تحديث الكتاب" }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (err) {
        console.error("PATCH API Error:", err);
        return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
    }
}
