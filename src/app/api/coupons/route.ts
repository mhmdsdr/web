import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export async function GET(req: NextRequest) {
    try {
        const code = req.nextUrl.searchParams.get("code");

        if (!isSupabaseConfigured()) {
            return NextResponse.json({ error: "Supabase data is not configured" }, { status: 500 });
        }

        if (code) {
            const { data, error } = await supabase
                .from("coupons")
                .select("discount_percent, is_active")
                .eq("code", code.toUpperCase())
                .single();

            if (error || !data) {
                return NextResponse.json({ error: "كود الخصم غير صحيح" }, { status: 404 });
            }

            if (!data.is_active) {
                return NextResponse.json({ error: "هذا الكود لم يعد فعالاً" }, { status: 403 });
            }

            return NextResponse.json({
                success: true,
                discount_percent: data.discount_percent
            });
        }

        // If no code, return all coupons (for Admin)
        const { data, error } = await supabase
            .from("coupons")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;
        return NextResponse.json(data);

    } catch (err: any) {
        console.error("Coupon GET Error:", err);
        return NextResponse.json({ error: err.message || "خطأ في الخادم" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        if (!body.code || !body.discount_percent) {
            return NextResponse.json({ error: "الكود والنسبة مطلوبان" }, { status: 400 });
        }

        const { data, error } = await supabase
            .from("coupons")
            .insert([{
                code: body.code.toUpperCase(),
                discount_percent: Number(body.discount_percent),
                is_active: body.is_active !== undefined ? body.is_active : true
            }])
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json(data, { status: 201 });
    } catch (err: any) {
        console.error("Coupon POST Error:", err);
        return NextResponse.json({ error: err.message || "فشل إضافة الكوبون" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json();
        if (!body.id) return NextResponse.json({ error: "id مطلوب" }, { status: 400 });

        const { id, ...updateData } = body;
        if (updateData.code) updateData.code = updateData.code.toUpperCase();

        const { data, error } = await supabase
            .from("coupons")
            .update(updateData)
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json(data);
    } catch (err: any) {
        console.error("Coupon PATCH Error:", err);
        return NextResponse.json({ error: err.message || "فشل تحديث الكوبون" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const id = req.nextUrl.searchParams.get("id");
        if (!id) return NextResponse.json({ error: "id مطلوب" }, { status: 400 });

        const { error } = await supabase
            .from("coupons")
            .delete()
            .eq("id", id);

        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error("Coupon DELETE Error:", err);
        return NextResponse.json({ error: err.message || "فشل حذف الكوبون" }, { status: 500 });
    }
}
