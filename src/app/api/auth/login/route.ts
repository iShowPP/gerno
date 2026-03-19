import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query } from '@/lib/db';
import { signToken } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const users = await query<{ id: string; name: string; email: string; password_hash: string }>(
            'SELECT * FROM users WHERE email = $1',
            [normalizedEmail]
        );
        const user = users[0];

        if (!user || !user.password_hash) {
            return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
        }

        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) {
            return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
        }

        const token = await signToken({ id: user.id, name: user.name, email: user.email });
        const response = NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } });

        response.cookies.set('gerno_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
        });

        return response;
    } catch (err) {
        console.error('[login]', err);
        return NextResponse.json({ error: 'Server error during login.' }, { status: 500 });
    }
}
