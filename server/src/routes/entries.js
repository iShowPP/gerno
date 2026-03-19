const express = require('express');
const { body, validationResult } = require('express-validator');
const { query } = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// ── Helper: Verify today's assigned writer ──────────────
const verifyTodayWriter = async (circleId, userId) => {
    const circleResult = await query('SELECT * FROM circles WHERE id = $1', [circleId]);
    if (!circleResult.rows.length) return { error: 'Circle not found.', status: 404 };
    const circle = circleResult.rows[0];

    const membersResult = await query(
        'SELECT user_id FROM circle_members WHERE circle_id = $1 ORDER BY join_order ASC',
        [circleId]
    );
    const members = membersResult.rows;
    if (!members.length) return { error: 'No members in circle.', status: 400 };

    const start = new Date(circle.start_date);
    const now = new Date();
    start.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    const dayNumber = Math.floor((now - start) / (1000 * 60 * 60 * 24)) + 1;

    const todayWriterId = members[(dayNumber - 1) % members.length].user_id;
    if (todayWriterId !== userId) return { error: "It's not your turn to write today.", status: 403 };

    return { circle, dayNumber };
};

// ── POST /api/entries — Save/update a draft ─────────────
router.post(
    '/',
    requireAuth,
    [
        body('circle_id').isUUID().withMessage('Valid circle_id required.'),
        body('title').optional().trim(),
        body('body').optional().trim(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { circle_id, title, body: entryBody, photo_url } = req.body;

        const check = await verifyTodayWriter(circle_id, req.user.id);
        if (check.error) return res.status(check.status).json({ error: check.error });
        const { dayNumber } = check;

        const wordCount = entryBody ? entryBody.trim().split(/\s+/).filter(Boolean).length : 0;

        try {
            // Upsert: if a draft already exists for today, update it; otherwise create
            const result = await query(
                `INSERT INTO entries (circle_id, user_id, day_number, title, body, photo_url, word_count, is_draft)
         VALUES ($1, $2, $3, $4, $5, $6, $7, TRUE)
         ON CONFLICT (circle_id, day_number)
         DO UPDATE SET title = EXCLUDED.title, body = EXCLUDED.body, photo_url = EXCLUDED.photo_url, word_count = EXCLUDED.word_count
         WHERE entries.is_draft = TRUE
         RETURNING *`,
                [circle_id, req.user.id, dayNumber, title || null, entryBody || null, photo_url || null, wordCount]
            );

            if (!result.rows.length) {
                return res.status(409).json({ error: 'Entry for today has already been submitted and cannot be edited.' });
            }
            res.json({ entry: result.rows[0] });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error saving draft.' });
        }
    }
);

// ── POST /api/entries/:id/submit — Submit (lock) an entry
router.post('/:id/submit', requireAuth, async (req, res) => {
    const { id } = req.params;
    try {
        // Only the entry author can submit
        const entryResult = await query('SELECT * FROM entries WHERE id = $1', [id]);
        if (!entryResult.rows.length) return res.status(404).json({ error: 'Entry not found.' });
        const entry = entryResult.rows[0];

        if (entry.user_id !== req.user.id) return res.status(403).json({ error: 'Not your entry.' });
        if (!entry.is_draft) return res.status(409).json({ error: 'Entry already submitted.' });
        if (!entry.body || entry.body.trim().length === 0) {
            return res.status(400).json({ error: 'Cannot submit an empty entry.' });
        }

        const result = await query(
            'UPDATE entries SET is_draft = FALSE, submitted_at = NOW() WHERE id = $1 RETURNING *',
            [id]
        );
        res.json({ entry: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error submitting entry.' });
    }
});

// ── GET /api/entries/circle/:circleId — Timeline view ───
router.get('/circle/:circleId', requireAuth, async (req, res) => {
    const { circleId } = req.params;
    try {
        // Membership check
        const memberCheck = await query(
            'SELECT 1 FROM circle_members WHERE circle_id = $1 AND user_id = $2',
            [circleId, req.user.id]
        );
        if (!memberCheck.rows.length) return res.status(403).json({ error: 'Not a member of this circle.' });

        const result = await query(
            `SELECT e.*, u.name AS author_name, u.avatar_url AS author_avatar
       FROM entries e
       JOIN users u ON u.id = e.user_id
       WHERE e.circle_id = $1
       ORDER BY e.day_number ASC`,
            [circleId]
        );
        res.json({ entries: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error fetching entries.' });
    }
});

// ── GET /api/entries/:id — Single entry ─────────────────
router.get('/:id', requireAuth, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await query(
            `SELECT e.*, u.name AS author_name, u.avatar_url AS author_avatar
       FROM entries e
       JOIN users u ON u.id = e.user_id
       WHERE e.id = $1`,
            [id]
        );
        if (!result.rows.length) return res.status(404).json({ error: 'Entry not found.' });
        const entry = result.rows[0];

        // Only members can read entries
        const memberCheck = await query(
            'SELECT 1 FROM circle_members WHERE circle_id = $1 AND user_id = $2',
            [entry.circle_id, req.user.id]
        );
        if (!memberCheck.rows.length) return res.status(403).json({ error: 'Not a member of this circle.' });

        // Drafts are only visible to their author
        if (entry.is_draft && entry.user_id !== req.user.id) {
            return res.status(403).json({ error: 'This entry is a draft and not yet visible.' });
        }

        res.json({ entry });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error fetching entry.' });
    }
});

module.exports = router;
