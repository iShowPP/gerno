import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { verifyToken } from '@/lib/auth';
import { query } from '@/lib/db';

// ── GET /api/circles — list my circles ───────────────────
export async function GET(req: NextRequest) {
    const user = await verifyToken(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

    try {
        const circles = await query<Record<string, unknown>>(
            `SELECT c.*,
                (SELECT COUNT(*) FROM circle_members WHERE circle_id = c.id)::int AS member_count
             FROM circles c
             JOIN circle_members cm ON cm.circle_id = c.id
             WHERE cm.user_id = $1
             ORDER BY c.created_at DESC`,
            [user.id]
        );

        // Enrich with day_number
        const enriched = circles.map((c) => {
            const start = new Date(c.start_date as string);
            const now = new Date();
            start.setHours(0, 0, 0, 0);
            now.setHours(0, 0, 0, 0);
            const day_number = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
            return { ...c, day_number };
        });

        return NextResponse.json({ circles: enriched });
    } catch (err) {
        console.error('[circles GET]', err);
        return NextResponse.json({ error: 'Server error fetching circles.' }, { status: 500 });
    }
}

// ── POST /api/circles — create circle ────────────────────
export async function POST(req: NextRequest) {
    const user = await verifyToken(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

    try {
        const { name, total_days, start_date } = await req.json();

        if (!name?.trim()) return NextResponse.json({ error: 'Circle name is required.' }, { status: 400 });
        if (!total_days || total_days < 1) return NextResponse.json({ error: 'total_days must be a positive number.' }, { status: 400 });

        const invite_code = uuidv4().split('-')[0].toUpperCase();
        const startDate = start_date || new Date().toISOString().split('T')[0];
        const id = uuidv4();

        const circles = await query<Record<string, unknown>>(
            'INSERT INTO circles (id, name, total_days, start_date, created_by, invite_code) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [id, name.trim(), total_days, startDate, user.id, invite_code]
        );
        const circle = circles[0];

        // Auto-add creator as first member
        await query(
            'INSERT INTO circle_members (id, circle_id, user_id, join_order) VALUES ($1, $2, $3, 0)',
            [uuidv4(), circle.id, user.id]
        );

        return NextResponse.json({ circle, invite_code }, { status: 201 });
    } catch (err) {
        console.error('[circles POST]', err);
        return NextResponse.json({ error: 'Server error creating circle.' }, { status: 500 });
    }
}
