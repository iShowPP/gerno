import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { verifyToken } from '@/lib/auth';
import { query } from '@/lib/db';

// ─ Helper: verify today's assigned writer ────────────────
async function verifyTodayWriter(circleId: string, userId: string) {
    const circles = await query<Record<string, unknown>>('SELECT * FROM circles WHERE id = $1', [circleId]);
    if (!circles.length) return { error: 'Circle not found.', status: 404 };
    const circle = circles[0];

    const members = await query<{ user_id: string }>(
        'SELECT user_id FROM circle_members WHERE circle_id = $1 ORDER BY join_order ASC',
        [circleId]
    );
    if (!members.length) return { error: 'No members in circle.', status: 400 };

    const start = new Date(circle.start_date as string);
    const now = new Date();
    start.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    const dayNumber = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const todayWriterId = members[(dayNumber - 1) % members.length].user_id;
    if (todayWriterId !== userId) return { error: "It's not your turn to write today.", status: 403 };

    return { circle, dayNumber };
}

// ── GET /api/entries — fetch today's draft/entry ──────────
export async function GET(req: NextRequest) {
    const user = await verifyToken(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const circleId = searchParams.get('circle_id');
    if (!circleId) return NextResponse.json({ error: 'circle_id is required.' }, { status: 400 });

    try {
        const check = await verifyTodayWriter(circleId, user.id);
        if ('error' in check) return NextResponse.json({ error: check.error }, { status: check.status });
        const { dayNumber } = check as { dayNumber: number };

        const entries = await query<Record<string, unknown>>(
            'SELECT * FROM entries WHERE circle_id = $1 AND day_number = $2 AND user_id = $3',
            [circleId, dayNumber, user.id]
        );

        return NextResponse.json({ entry: entries[0] || null, dayNumber });
    } catch (err) {
        console.error('[entries GET today]', err);
        return NextResponse.json({ error: 'Server error fetching draft.' }, { status: 500 });
    }
}

// ── POST /api/entries — save/upsert draft ────────────────
export async function POST(req: NextRequest) {
    const user = await verifyToken(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

    try {
        const { circle_id, title, body: entryBody, photo_url } = await req.json();
        if (!circle_id) return NextResponse.json({ error: 'circle_id is required.' }, { status: 400 });

        const check = await verifyTodayWriter(circle_id, user.id);
        if ('error' in check) return NextResponse.json({ error: check.error }, { status: check.status });
        const { dayNumber } = check as { dayNumber: number };

        const wordCount = entryBody ? entryBody.trim().split(/\s+/).filter(Boolean).length : 0;
        const id = uuidv4();

        const entries = await query<Record<string, unknown>>(
            `INSERT INTO entries (id, circle_id, user_id, day_number, title, body, photo_url, word_count, is_draft)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, TRUE)
             ON CONFLICT (circle_id, day_number)
             DO UPDATE SET 
               title = EXCLUDED.title, 
               body = EXCLUDED.body, 
               photo_url = EXCLUDED.photo_url, 
               word_count = EXCLUDED.word_count
             WHERE entries.is_draft = TRUE
             RETURNING *`,
            [id, circle_id, user.id, dayNumber, title || null, entryBody || null, photo_url || null, wordCount]
        );

        if (!entries.length) {
            return NextResponse.json({ error: 'Entry already submitted and locked.' }, { status: 409 });
        }

        return NextResponse.json({ entry: entries[0] });
    } catch (err) {
        console.error('[entries POST]', err);
        return NextResponse.json({ error: 'Server error saving draft.' }, { status: 500 });
    }
}
