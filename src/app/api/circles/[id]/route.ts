import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { query } from '@/lib/db';

// ── GET /api/circles/[id] — circle detail ────────────────
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const user = await verifyToken(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

    const { id } = params;
    try {
        // Membership check
        const membership = await query(
            'SELECT 1 FROM circle_members WHERE circle_id = $1 AND user_id = $2',
            [id, user.id]
        );
        if (!membership.length) return NextResponse.json({ error: 'You are not a member of this circle.' }, { status: 403 });

        const circles = await query<Record<string, unknown>>('SELECT * FROM circles WHERE id = $1', [id]);
        if (!circles.length) return NextResponse.json({ error: 'Circle not found.' }, { status: 404 });
        const circle = circles[0];

        const members = await query<Record<string, unknown>>(
            `SELECT cm.user_id, cm.join_order, u.name, u.email, u.avatar_url
             FROM circle_members cm
             JOIN users u ON u.id = cm.user_id
             WHERE cm.circle_id = $1
             ORDER BY cm.join_order ASC`,
            [id]
        );

        const start = new Date(circle.start_date as string);
        const now = new Date();
        start.setHours(0, 0, 0, 0);
        now.setHours(0, 0, 0, 0);
        const day_number = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

        const today_writer = members.length > 0 ? members[(day_number - 1) % members.length] : null;

        // Build full schedule
        const schedule = Array.from({ length: circle.total_days as number }, (_, i) => ({
            day: i + 1,
            writer: members.length > 0 ? members[i % members.length] : null,
        }));

        return NextResponse.json({ circle, members, day_number, today_writer, schedule });
    } catch (err) {
        console.error('[circles/:id GET]', err);
        return NextResponse.json({ error: 'Server error.' }, { status: 500 });
    }
}
