import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { verifyToken } from '@/lib/auth';
import { query } from '@/lib/db';

// ── POST /api/circles/join/[code] ────────────────────────
export async function POST(req: NextRequest, { params }: { params: { code: string } }) {
    const user = await verifyToken(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

    const { code } = params;
    try {
        const circles = await query<Record<string, unknown>>(
            'SELECT * FROM circles WHERE invite_code = $1',
            [code.toUpperCase()]
        );
        if (!circles.length) return NextResponse.json({ error: 'Invalid invite code.' }, { status: 404 });
        const circle = circles[0];

        // Already a member?
        const existing = await query(
            'SELECT 1 FROM circle_members WHERE circle_id = $1 AND user_id = $2',
            [circle.id, user.id]
        );
        if (existing.length) return NextResponse.json({ error: 'You are already a member of this circle.' }, { status: 409 });

        // Next join_order
        const orderRows = await query<{ next_order: number }>(
            'SELECT COALESCE(MAX(join_order), -1) + 1 AS next_order FROM circle_members WHERE circle_id = $1',
            [circle.id]
        );
        const join_order = orderRows[0].next_order;

        await query(
            'INSERT INTO circle_members (id, circle_id, user_id, join_order) VALUES ($1, $2, $3, $4)',
            [uuidv4(), circle.id, user.id, join_order]
        );

        return NextResponse.json({ message: 'Joined circle successfully.', circle }, { status: 201 });
    } catch (err) {
        console.error('[join]', err);
        return NextResponse.json({ error: 'Server error joining circle.' }, { status: 500 });
    }
}
