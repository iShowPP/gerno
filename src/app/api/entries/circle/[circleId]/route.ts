import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { query } from '@/lib/db';

// ── GET /api/entries/circle/[circleId] — timeline ────────
export async function GET(req: NextRequest, { params }: { params: { circleId: string } }) {
    const user = await verifyToken(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

    const { circleId } = params;
    try {
        const membership = await query(
            'SELECT 1 FROM circle_members WHERE circle_id = $1 AND user_id = $2',
            [circleId, user.id]
        );
        if (!membership.length) return NextResponse.json({ error: 'Not a member of this circle.' }, { status: 403 });

        const entries = await query<Record<string, unknown>>(
            `SELECT e.*, u.name AS author_name, u.avatar_url AS author_avatar
             FROM entries e
             JOIN users u ON u.id = e.user_id
             WHERE e.circle_id = $1 AND e.is_draft = FALSE
             ORDER BY e.day_number ASC`,
            [circleId]
        );
        return NextResponse.json({ entries });
    } catch (err) {
        console.error('[entries/circle/:circleId]', err);
        return NextResponse.json({ error: 'Server error fetching timeline.' }, { status: 500 });
    }
}
