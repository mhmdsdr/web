import { X, Moon, Sun, Home, Book, Layers, Users, Info, LayoutDashboard } from "lucide-react";
import Link from "next/link";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    isDarkMode: boolean;
    toggleDarkMode: () => void;
}

export function Sidebar({ isOpen, onClose, isDarkMode, toggleDarkMode }: SidebarProps) {
    const links = [
        { name: "الرئيسية", icon: <Home className="w-5 h-5" />, href: "/" },
        { name: "الكتب", icon: <Book className="w-5 h-5" />, href: "/" }, // Should point to /books if it exists
        { name: "التصنيفات", icon: <Layers className="w-5 h-5" />, href: "/" },
        { name: "لوحة الإدارة", icon: <LayoutDashboard className="w-5 h-5" />, href: "/admin" },
        { name: "من نحن", icon: <Info className="w-5 h-5" />, href: "#" },
    ];

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-navy/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                onClick={onClose}
                style={{ backgroundColor: "rgba(26,53,80,0.5)" }}
            />

            {/* Sidebar Panel */}
            <div
                className={`fixed inset-y-0 right-0 z-50 w-64 bg-background shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                    <span className="text-xl font-bold text-navy dark:text-cream">القائمة</span>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-500 hover:text-gold transition-colors focus:outline-none"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto py-4">
                    <ul className="space-y-2 px-2">
                        {links.map((link, idx) => (
                            <li key={idx}>
                                <Link
                                    href={link.href}
                                    onClick={onClose}
                                    className="flex items-center gap-3 px-4 py-3 text-navy dark:text-cream rounded-lg hover:bg-cream dark:hover:bg-gray-800 hover:text-gold transition-colors"
                                >
                                    <span className="text-gold">{link.icon}</span>
                                    <span className="font-medium">{link.name}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                    <button
                        onClick={toggleDarkMode}
                        className="flex items-center justify-between w-full px-4 py-3 text-navy dark:text-cream rounded-lg hover:bg-cream dark:hover:bg-gray-800 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            {isDarkMode ? <Sun className="w-5 h-5 text-gold" /> : <Moon className="w-5 h-5 text-gold" />}
                            <span className="font-medium">{isDarkMode ? "الوضع النهاري" : "الوضع الليلي"}</span>
                        </div>
                    </button>
                </div>
            </div>
        </>
    );
}
