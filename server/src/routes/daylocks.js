const express = require('express');
const { body, validationResult } = require('express-validator');
const { query } = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

/**
 * POST /api/daylocks
 * Triggers a day lock resolution for a missed day.
 * body: { circle_id, day_number, action: 'skip' | 'delay' | 'pass' }
 *
 * skip  — marks the day as missed, schedule advances normally
 * delay — pushes the deadline 24h (increments circle's current day expectation)
 * pass  — assigns today's turn to the next participant
 */
router.post(
    '/',
    requireAuth,
    [
        body('circle_id').isUUID(),
        body('day_number').isInt({ min: 1 }),
        body('action').isIn(['skip', 'delay', 'pass']).withMessage("action must be 'skip', 'delay', or 'pass'."),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { circle_id, day_number, action } = req.body;

        try {
            // Only members can trigger a day lock resolution
            const memberCheck = await query(
                'SELECT 1 FROM circle_members WHERE circle_id = $1 AND user_id = $2',
                [circle_id, req.user.id]
            );
            if (!memberCheck.rows.length) return res.status(403).json({ error: 'Not a member of this circle.' });

            // Check the day isn't already resolved
            const existing = await query(
                'SELECT id FROM day_locks WHERE circle_id = $1 AND day_number = $2',
                [circle_id, day_number]
            );
            if (existing.rows.length) {
                return res.status(409).json({ error: 'A lock action has already been applied to this day.' });
            }

            // Check an entry doesn't already exist for that day (would mean someone wrote it)
            const entryCheck = await query(
                'SELECT id FROM entries WHERE circle_id = $1 AND day_number = $2 AND is_draft = FALSE',
                [circle_id, day_number]
            );
            if (entryCheck.rows.length) {
                return res.status(409).json({ error: 'An entry was submitted for this day — no lock needed.' });
            }

            // Handle 'skip' — insert a placeholder entry marked as skipped
            if (action === 'skip') {
                // Insert an entry with the assigned writer but empty body, immutable
                const membersResult = await query(
                    'SELECT user_id FROM circle_members WHERE circle_id = $1 ORDER BY join_order ASC',
                    [circle_id]
                );
                const members = membersResult.rows;
                const writerId = members.length > 0 ? members[(day_number - 1) % members.length].user_id : req.user.id;

                await query(
                    `INSERT INTO entries (circle_id, user_id, day_number, title, body, is_draft, submitted_at)
           VALUES ($1, $2, $3, 'Entry skipped', NULL, FALSE, NOW())
           ON CONFLICT (circle_id, day_number) DO NOTHING`,
                    [circle_id, writerId, day_number]
                );
            }

            // For 'delay' and 'pass': just record the intent; the schedule logic in circles.js
            // will pick it up dynamically when computing the writer for a given day.
            // A more complex implementation would recalculate future assignments in the DB.

            // Record the lock action
            const lockResult = await query(
                'INSERT INTO day_locks (circle_id, day_number, action, triggered_by) VALUES ($1, $2, $3, $4) RETURNING *',
                [circle_id, day_number, action, req.user.id]
            );

            // Notify all circle members about the lock action
            const membersResult = await query(
                'SELECT user_id FROM circle_members WHERE circle_id = $1',
                [circle_id]
            );
            const circleResult = await query('SELECT name FROM circles WHERE id = $1', [circle_id]);
            const circleName = circleResult.rows[0]?.name || 'your circle';
            const messages = {
                skip: `Day ${day_number} in "${circleName}" was skipped.`,
                delay: `Day ${day_number} in "${circleName}" has been delayed by 24 hours.`,
                pass: `Day ${day_number} in "${circleName}" has been passed to the next writer.`,
            };
            const notifPromises = membersResult.rows.map((m) =>
                query(
                    'INSERT INTO notifications (user_id, circle_id, type, message) VALUES ($1, $2, $3, $4)',
                    [m.user_id, circle_id, `day_lock_${action}`, messages[action]]
                )
            );
            await Promise.all(notifPromises);

            res.status(201).json({ day_lock: lockResult.rows[0] });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error applying day lock.' });
        }
    }
);

// ── GET /api/daylocks/circle/:circleId — List day locks for a circle
router.get('/circle/:circleId', requireAuth, async (req, res) => {
    const { circleId } = req.params;
    try {
        const memberCheck = await query(
            'SELECT 1 FROM circle_members WHERE circle_id = $1 AND user_id = $2',
            [circleId, req.user.id]
        );
        if (!memberCheck.rows.length) return res.status(403).json({ error: 'Not a member.' });

        const result = await query(
            'SELECT * FROM day_locks WHERE circle_id = $1 ORDER BY day_number ASC',
            [circleId]
        );
        res.json({ day_locks: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error.' });
    }
});

module.exports = router;
