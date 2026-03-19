const express = require('express');
const { query } = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// ── GET /api/notifications — List user's notifications ──
router.get('/', requireAuth, async (req, res) => {
    try {
        const result = await query(
            `SELECT n.*, c.name AS circle_name
       FROM notifications n
       LEFT JOIN circles c ON c.id = n.circle_id
       WHERE n.user_id = $1
       ORDER BY n.created_at DESC
       LIMIT 50`,
            [req.user.id]
        );
        res.json({ notifications: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error fetching notifications.' });
    }
});

// ── PATCH /api/notifications/:id/read — Mark as read ────
router.patch('/:id/read', requireAuth, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await query(
            'UPDATE notifications SET is_read = TRUE WHERE id = $1 AND user_id = $2 RETURNING *',
            [id, req.user.id]
        );
        if (!result.rows.length) return res.status(404).json({ error: 'Notification not found.' });
        res.json({ notification: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error.' });
    }
});

// ── PATCH /api/notifications/read-all — Mark all as read
router.patch('/read-all', requireAuth, async (req, res) => {
    try {
        await query('UPDATE notifications SET is_read = TRUE WHERE user_id = $1', [req.user.id]);
        res.json({ message: 'All notifications marked as read.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error.' });
    }
});

module.exports = router;
