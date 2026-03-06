import { Search, Wallet, Truck } from "lucide-react";

const FEATURES = [
    {
        icon: <Search className="w-7 h-7" />,
        title: "نوفّر طلبك",
        description: "ابحث عن أي كتاب وسنوفّره لك في أسرع وقت ممكن من أفضل دور النشر.",
    },
    {
        icon: <Wallet className="w-7 h-7" />,
        title: "دفع عند الاستلام",
        description: "لا تحتاج لبطاقة بنكية — ادفع نقداً عند وصول طلبك إليك.",
    },
    {
        icon: <Truck className="w-7 h-7" />,
        title: "توصيل سريع",
        description: "نوصّل طلبك إلى باب بيتك في جميع محافظات العراق.",
    },
];

export function Features() {
    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {FEATURES.map((f, i) => (
                    <div
                        key={i}
                        className="flex flex-col items-center text-center gap-4 p-8 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                        style={{
                            backgroundColor: "#F0F8FF",
                            border: "1px solid #B8D9F0",
                        }}
                    >
                        {/* Icon bubble */}
                        <div
                            className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: "#B8D9F0", color: "#1A3550" }}
                        >
                            {f.icon}
                        </div>

                        {/* Gold divider line */}
                        <div
                            className="w-10 h-0.5 rounded-full"
                            style={{ backgroundColor: "#C5A880" }}
                        />

                        <div>
                            <h3 className="text-xl font-black mb-2" style={{ color: "#1A3550" }}>
                                {f.title}
                            </h3>
                            <p className="text-sm leading-relaxed" style={{ color: "#2A6EA6" }}>
                                {f.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
