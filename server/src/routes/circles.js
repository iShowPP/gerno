const express = require('express');
const { body, param, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const { query } = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// ── Helper: Get circle day-number ───────────────────────
const getDayNumber = (startDate) => {
    const start = new Date(startDate);
    const now = new Date();
    start.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    const diff = Math.floor((now - start) / (1000 * 60 * 60 * 24));
    return diff + 1; // 1-indexed
};

// ── Helper: Get today's writer ──────────────────────────
// current_writer = members[ (dayNumber - 1) % total_members ]
const getTodayWriter = async (circleId, dayNumber) => {
    const membersResult = await query(
        'SELECT cm.user_id, u.name, u.email, u.avatar_url FROM circle_members cm JOIN users u ON u.id = cm.user_id WHERE cm.circle_id = $1 ORDER BY cm.join_order ASC',
        [circleId]
    );
    const members = membersResult.rows;
    if (!members.length) return null;
    const idx = (dayNumber - 1) % members.length;
    return members[idx];
};

// ── POST /api/circles — Create a new circle ─────────────
router.post(
    '/',
    requireAuth,
    [
        body('name').trim().notEmpty().withMessage('Circle name is required.'),
        body('total_days').isInt({ min: 1 }).withMessage('Total days must be a positive integer.'),
        body('start_date').optional().isISO8601(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { name, total_days, start_date } = req.body;
        const invite_code = uuidv4().split('-')[0].toUpperCase(); // e.g. A3F9B2E1
        const startDate = start_date || new Date().toISOString().split('T')[0];

        try {
            // Create the circle
            const circleResult = await query(
                'INSERT INTO circles (name, total_days, start_date, created_by, invite_code) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [name, total_days, startDate, req.user.id, invite_code]
            );
            const circle = circleResult.rows[0];

            // Auto-add the creator as the first member (join_order = 0)
            await query(
                'INSERT INTO circle_members (circle_id, user_id, join_order) VALUES ($1, $2, 0)',
                [circle.id, req.user.id]
            );

            res.status(201).json({ circle, invite_code });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error creating circle.' });
        }
    }
);

// ── GET /api/circles — List my circles ──────────────────
router.get('/', requireAuth, async (req, res) => {
    try {
        const result = await query(
            `SELECT c.*, 
         (SELECT COUNT(*) FROM circle_members WHERE circle_id = c.id) AS member_count
       FROM circles c
       JOIN circle_members cm ON cm.circle_id = c.id
       WHERE cm.user_id = $1
       ORDER BY c.created_at DESC`,
            [req.user.id]
        );
        // Enrich each circle with day number and today's writer
        const circles = await Promise.all(
            result.rows.map(async (circle) => {
                const dayNumber = getDayNumber(circle.start_date);
                const todayWriter = await getTodayWriter(circle.id, dayNumber);
                return { ...circle, day_number: dayNumber, today_writer: todayWriter };
            })
        );
        res.json({ circles });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error fetching circles.' });
    }
});

// ── GET /api/circles/:id — Circle details + schedule ────
router.get('/:id', requireAuth, async (req, res) => {
    const { id } = req.params;
    try {
        // Check membership
        const memberCheck = await query(
            'SELECT 1 FROM circle_members WHERE circle_id = $1 AND user_id = $2',
            [id, req.user.id]
        );
        if (!memberCheck.rows.length) return res.status(403).json({ error: 'You are not a member of this circle.' });

        // Circle info
        const circleResult = await query('SELECT * FROM circles WHERE id = $1', [id]);
        if (!circleResult.rows.length) return res.status(404).json({ error: 'Circle not found.' });
        const circle = circleResult.rows[0];

        // Members in rotation order
        const membersResult = await query(
            'SELECT cm.user_id, cm.join_order, u.name, u.email, u.avatar_url FROM circle_members cm JOIN users u ON u.id = cm.user_id WHERE cm.circle_id = $1 ORDER BY cm.join_order ASC',
            [id]
        );
        const members = membersResult.rows;

        // Day number + today's writer
        const dayNumber = getDayNumber(circle.start_date);
        const todayWriter = members.length > 0 ? members[(dayNumber - 1) % members.length] : null;

        // Build the full schedule (who writes on which days)
        const schedule = [];
        for (let day = 1; day <= circle.total_days; day++) {
            schedule.push({
                day,
                writer: members.length > 0 ? members[(day - 1) % members.length] : null,
            });
        }

        res.json({ circle, members, day_number: dayNumber, today_writer: todayWriter, schedule });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error fetching circle.' });
    }
});

// ── POST /api/circles/join/:code — Join via invite code ─
router.post('/join/:code', requireAuth, async (req, res) => {
    const { code } = req.params;
    try {
        const circleResult = await query('SELECT * FROM circles WHERE invite_code = $1', [code]);
        if (!circleResult.rows.length) return res.status(404).json({ error: 'Invalid invite code.' });
        const circle = circleResult.rows[0];

        // Check already a member
        const existing = await query(
            'SELECT 1 FROM circle_members WHERE circle_id = $1 AND user_id = $2',
            [circle.id, req.user.id]
        );
        if (existing.rows.length) return res.status(409).json({ error: 'You are already a member of this circle.' });

        // Get next join_order
        const orderResult = await query(
            'SELECT COALESCE(MAX(join_order), -1) + 1 AS next_order FROM circle_members WHERE circle_id = $1',
            [circle.id]
        );
        const join_order = orderResult.rows[0].next_order;

        await query(
            'INSERT INTO circle_members (circle_id, user_id, join_order) VALUES ($1, $2, $3)',
            [circle.id, req.user.id, join_order]
        );

        res.status(201).json({ message: 'Joined circle successfully.', circle });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error joining circle.' });
    }
});

// ── GET /api/circles/:id/invite — Get invite link ───────
router.get('/:id/invite', requireAuth, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await query('SELECT invite_code FROM circles WHERE id = $1 AND created_by = $2', [id, req.user.id]);
        if (!result.rows.length) return res.status(404).json({ error: 'Circle not found or you are not the creator.' });
        const { invite_code } = result.rows[0];
        const link = `${process.env.FRONTEND_URL}/join/${invite_code}`;
        res.json({ invite_code, invite_link: link });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error.' });
    }
});

module.exports = router;
