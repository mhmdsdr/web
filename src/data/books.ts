export interface Book {
    id: string;
    title: string;
    author: string;
    price: number;
    category: string;
    coverImage?: string;
    description?: string;
    inStock?: boolean;
}

export const BOOKS: Book[] = [
    { id: "1", title: "صاحب الظل الطويل", author: "جين ويبستر", price: 8000, category: "رواية مترجمة", description: "رواية مراسلات كلاسيكية رائعة." },
    { id: "2", title: "11:11", author: "يوسف فضل", price: 6000, category: "تطوير ذات", description: "كتاب في التأمل الذاتي." },
    { id: "3", title: "أبابيل", author: "أحمد آل حمدان", price: 10000, category: "خيال", description: "رواية خيال علمي عربية." },
    { id: "4", title: "الجساسة", author: "أحمد آل حمدان", price: 10000, category: "خيال", description: "جزء ثانٍ من سلسلة أبابيل." },
    { id: "5", title: "لأنك الله", author: "علي بن جابر الفيفي", price: 5000, category: "ديني", description: "كتاب روحاني مؤثر." },
    { id: "6", title: "الخيميائي", author: "باولو كويلو", price: 7000, category: "رواية مترجمة", description: "رحلة البطل سانتياغو نحو الكنز." },
];

export const CATEGORIES = ["رواية مترجمة", "تطوير ذات", "خيال", "ديني", "تاريخ", "علوم", "أدب عربي"];
