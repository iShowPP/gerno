import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { query } from '@/lib/db';

// ── GET /api/entries/[id] — single entry ─────────────────
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const user = await verifyToken(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

    try {
        const entries = await query<Record<string, unknown>>(
            `SELECT e.*, u.name AS author_name, u.avatar_url AS author_avatar
             FROM entries e JOIN users u ON u.id = e.user_id
             WHERE e.id = $1`,
            [params.id]
        );
        if (!entries.length) return NextResponse.json({ error: 'Entry not found.' }, { status: 404 });
        const entry = entries[0];

        const membership = await query(
            'SELECT 1 FROM circle_members WHERE circle_id = $1 AND user_id = $2',
            [entry.circle_id, user.id]
        );
        if (!membership.length) return NextResponse.json({ error: 'Not a member of this circle.' }, { status: 403 });

        if (entry.is_draft && entry.user_id !== user.id) {
            return NextResponse.json({ error: 'This entry is a draft and not yet visible.' }, { status: 403 });
        }

        return NextResponse.json({ entry });
    } catch (err) {
        console.error('[entries/:id GET]', err);
        return NextResponse.json({ error: 'Server error.' }, { status: 500 });
    }
}
