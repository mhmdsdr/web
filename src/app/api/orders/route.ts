import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "src", "data", "orders.json");

export interface Order {
    orderId: string;
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    items: { bookTitle: string; price: number; quantity: number }[];
    total: number;
    status: "pending" | "completed";
    createdAt: string;
}

async function readOrders(): Promise<Order[]> {
    try {
        const raw = await readFile(DATA_PATH, "utf-8");
        return JSON.parse(raw) as Order[];
    } catch {
        return [];
    }
}

async function writeOrders(orders: Order[]) {
    await writeFile(DATA_PATH, JSON.stringify(orders, null, 2), "utf-8");
}

// GET /api/orders
export async function GET() {
    const orders = await readOrders();
    return NextResponse.json(orders);
}

// POST /api/orders  — create a new order from checkout
export async function POST(req: NextRequest) {
    try {
        const body = await req.json() as Omit<Order, "orderId" | "createdAt" | "status">;
        if (!body.customerName || !body.customerPhone || !body.customerAddress || !body.items?.length) {
            return NextResponse.json({ error: "بيانات الطلب غير مكتملة" }, { status: 400 });
        }
        const orders = await readOrders();
        const newOrder: Order = {
            ...body,
            orderId: `ORD-${Date.now()}`,
            status: "pending",
            createdAt: new Date().toISOString(),
        };
        orders.unshift(newOrder);
        await writeOrders(orders);
        return NextResponse.json(newOrder, { status: 201 });
    } catch {
        return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
    }
}

// PATCH /api/orders?id=xxx  — toggle status
export async function PATCH(req: NextRequest) {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id مطلوب" }, { status: 400 });
    try {
        const { status } = await req.json() as { status: Order["status"] };
        const orders = await readOrders();
        const idx = orders.findIndex(o => o.orderId === id);
        if (idx === -1) return NextResponse.json({ error: "الطلب غير موجود" }, { status: 404 });
        orders[idx].status = status;
        await writeOrders(orders);
        return NextResponse.json(orders[idx]);
    } catch {
        return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
    }
}

// DELETE /api/orders?id=xxx
export async function DELETE(req: NextRequest) {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id مطلوب" }, { status: 400 });
    const orders = await readOrders();
    const filtered = orders.filter(o => o.orderId !== id);
    if (filtered.length === orders.length) {
        return NextResponse.json({ error: "الطلب غير موجود" }, { status: 404 });
    }
    await writeOrders(filtered);
    return NextResponse.json({ success: true });
}
