'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const SESSION_COOKIE = 'admin_session';

export async function loginAction(formData: FormData) {
    const password = formData.get('password') as string;
    const adminPassword = process.env.ADMIN_PASSWORD;

    console.log("🛠️ DEBUG AUTH: Attempting login...");
    console.log("🛠️ DEBUG AUTH: ADMIN_PASSWORD from env is:", adminPassword ? "Defined (length: " + adminPassword.length + ")" : "UNDEFINED ❌");
    console.log("🛠️ DEBUG AUTH: Password provided by user matches env:", password === adminPassword);

    if (password === adminPassword) {
        const cookieStore = await cookies();
        cookieStore.set(SESSION_COOKIE, 'authenticated', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
        });
        return { success: true };
    }

    return { success: false, error: 'كلمة السر غير صحيحة' };
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE);
    redirect('/login');
}

export async function checkAuth() {
    const cookieStore = await cookies();
    const session = cookieStore.get(SESSION_COOKIE);
    return !!session;
}
