import { redirect } from "next/navigation";
import { checkAuth } from "@/lib/actions/auth";
import AdminLayoutClient from "@/components/layout/AdminLayoutClient";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const isAuth = await checkAuth();

    if (!isAuth) {
        redirect("/login");
    }

    return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
