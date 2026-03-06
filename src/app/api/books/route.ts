import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "src", "data", "books.json");

interface Book {
    id: string;
    title: string;
    author: string;
    price: number;
    category: string;
    coverImage?: string;
    description?: string;
}

async function readBooks(): Promise<Book[]> {
    try {
        const raw = await readFile(DATA_PATH, "utf-8");
        return JSON.parse(raw) as Book[];
    } catch {
        return [];
    }
}

async function writeBooks(books: Book[]) {
    await writeFile(DATA_PATH, JSON.stringify(books, null, 2), "utf-8");
}

// GET /api/books
export async function GET() {
    const books = await readBooks();
    return NextResponse.json(books);
}

// POST /api/books  — add a new book
export async function POST(req: NextRequest) {
    try {
        const body = await req.json() as Omit<Book, "id">;
        if (!body.title || !body.author || !body.price || !body.category) {
            return NextResponse.json({ error: "بيانات الكتاب غير مكتملة" }, { status: 400 });
        }
        const books = await readBooks();
        const newBook: Book = { ...body, id: Date.now().toString() };
        books.unshift(newBook);          // newest first
        await writeBooks(books);
        return NextResponse.json(newBook, { status: 201 });
    } catch {
        return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
    }
}

// DELETE /api/books?id=xxx
export async function DELETE(req: NextRequest) {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id مطلوب" }, { status: 400 });
    const books = await readBooks();
    const filtered = books.filter(b => b.id !== id);
    if (filtered.length === books.length) {
        return NextResponse.json({ error: "الكتاب غير موجود" }, { status: 404 });
    }
    await writeBooks(filtered);
    return NextResponse.json({ success: true });
}
