import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query } from '@/lib/db';
import { signToken, setAuthCookie } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        if (!name?.trim()) return NextResponse.json({ error: 'Name is required.' }, { status: 400 });
        if (!email || !/\S+@\S+\.\S+/.test(email)) return NextResponse.json({ error: 'Valid email is required.' }, { status: 400 });
        if (!password || password.length < 6) return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });

        const normalizedEmail = email.toLowerCase().trim();

        // Check if already exists
        const existing = await query<{ id: string }>(
            'SELECT id FROM users WHERE email = $1',
            [normalizedEmail]
        );
        if (existing.length > 0) {
            return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
        }

        const password_hash = await bcrypt.hash(password, 12);
        const id = uuidv4();

        const users = await query<{ id: string; name: string; email: string }>(
            'INSERT INTO users (id, name, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING id, name, email',
            [id, name.trim(), normalizedEmail, password_hash]
        );
        const user = users[0];

        const token = await signToken(user);
        const response = NextResponse.json(
            { user: { id: user.id, name: user.name, email: user.email } },
            { status: 201 }
        );

        // Set httpOnly cookie
        response.cookies.set('gerno_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
        });

        return response;
    } catch (err) {
        console.error('[signup]', err);
        return NextResponse.json({ error: 'Server error during signup.' }, { status: 500 });
    }
}
