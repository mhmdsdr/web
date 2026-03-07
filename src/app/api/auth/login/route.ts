import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (email === adminEmail && password === adminPassword) {
            const response = NextResponse.json({ success: true });

            // Set a simple secure cookie (In production, use a real JWT)
            response.cookies.set("admin_token", adminPassword || "", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 60 * 60 * 24, // 24 hours
                path: "/",
            });

            return response;
        }

        return NextResponse.json({ success: false, message: "بيانات الدخول غير صحيحة" }, { status: 401 });
    } catch (error) {
        return NextResponse.json({ success: false, message: "حدث خطأ في الخادم" }, { status: 500 });
    }
}
