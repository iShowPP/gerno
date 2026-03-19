import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { query } from '@/lib/db';

// ── POST /api/entries/[id]/submit — lock entry ───────────
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    const user = await verifyToken(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

    try {
        const entries = await query<Record<string, unknown>>('SELECT * FROM entries WHERE id = $1', [params.id]);
        if (!entries.length) return NextResponse.json({ error: 'Entry not found.' }, { status: 404 });
        const entry = entries[0];

        if (entry.user_id !== user.id) return NextResponse.json({ error: 'Not your entry.' }, { status: 403 });
        if (!entry.is_draft) return NextResponse.json({ error: 'Entry already submitted.' }, { status: 409 });
        if (!entry.body || (entry.body as string).trim().length === 0) {
            return NextResponse.json({ error: 'Cannot submit an empty entry.' }, { status: 400 });
        }

        const updated = await query<Record<string, unknown>>(
            'UPDATE entries SET is_draft = FALSE, submitted_at = NOW() WHERE id = $1 RETURNING *',
            [params.id]
        );
        return NextResponse.json({ entry: updated[0] });
    } catch (err) {
        console.error('[entries/:id/submit]', err);
        return NextResponse.json({ error: 'Server error submitting entry.' }, { status: 500 });
    }
}
