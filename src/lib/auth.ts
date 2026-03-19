import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'fallback-dev-secret-change-in-prod'
);

export type JWTUser = {
    id: string;
    email: string;
    name: string;
};

// ── Sign a JWT (returns string) ─────────────────────────────
export async function signToken(user: JWTUser): Promise<string> {
    return new SignJWT({ id: user.id, email: user.email, name: user.name })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('7d')
        .setIssuedAt()
        .sign(SECRET);
}

// ── Verify JWT from cookie or Authorization header ──────────
export async function verifyToken(req: NextRequest): Promise<JWTUser | null> {
    try {
        // 1. Try httpOnly cookie
        const cookieStore = cookies();
        const cookieToken = cookieStore.get('gerno_token')?.value;

        // 2. Fallback: Authorization: Bearer <token>
        const authHeader = req.headers.get('Authorization');
        const headerToken = authHeader?.startsWith('Bearer ')
            ? authHeader.slice(7)
            : null;

        const token = cookieToken || headerToken;
        if (!token) return null;

        const { payload } = await jwtVerify(token, SECRET);
        return payload as unknown as JWTUser;
    } catch {
        return null;
    }
}

// ── Set the auth cookie (call on login/signup) ──────────────
export function setAuthCookie(token: string) {
    cookies().set('gerno_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
    });
}

// ── Clear the auth cookie (call on logout) ──────────────────
export function clearAuthCookie() {
    cookies().delete('gerno_token');
}
