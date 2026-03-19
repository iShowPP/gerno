import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { query } from '@/lib/db';

// ── GET /api/circles/[id]/invite ─────────────────────────
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const user = await verifyToken(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

    try {
        const rows = await query<{ invite_code: string }>(
            'SELECT invite_code FROM circles WHERE id = $1 AND created_by = $2',
            [params.id, user.id]
        );
        if (!rows.length) return NextResponse.json({ error: 'Circle not found or you are not the creator.' }, { status: 404 });

        const { invite_code } = rows[0];
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const invite_link = `${baseUrl}/join/${invite_code}`;

        return NextResponse.json({ invite_code, invite_link });
    } catch (err) {
        console.error('[circles/:id/invite]', err);
        return NextResponse.json({ error: 'Server error.' }, { status: 500 });
    }
}
