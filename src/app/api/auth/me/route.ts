import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET(req: NextRequest) {
    const user = await verifyToken(req);
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    try {
        const rows = await query<{ id: string; name: string; email: string; avatar_url: string; created_at: string }>(
            'SELECT id, name, email, avatar_url, created_at FROM users WHERE id = $1',
            [user.id]
        );
        if (!rows.length) return NextResponse.json({ error: 'User not found.' }, { status: 404 });
        return NextResponse.json({ user: rows[0] });
    } catch (err) {
        console.error('[me]', err);
        return NextResponse.json({ error: 'Server error.' }, { status: 500 });
    }
}
