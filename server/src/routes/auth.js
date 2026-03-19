const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { query } = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// ── Helper ──────────────────────────────────────────────
const signToken = (user) =>
    jwt.sign(
        { id: user.id, email: user.email, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

// ── POST /api/auth/signup ────────────────────────────────
router.post(
    '/signup',
    [
        body('name').trim().notEmpty().withMessage('Name is required.'),
        body('email').isEmail().withMessage('Valid email is required.').normalizeEmail(),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { name, email, password } = req.body;
        try {
            // Check if user already exists
            const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
            if (existing.rows.length) return res.status(409).json({ error: 'Email already in use.' });

            const password_hash = await bcrypt.hash(password, 12);
            const result = await query(
                'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
                [name, email, password_hash]
            );
            const user = result.rows[0];
            const token = signToken(user);
            res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error during signup.' });
        }
    }
);

// ── POST /api/auth/login ─────────────────────────────────
router.post(
    '/login',
    [
        body('email').isEmail().normalizeEmail(),
        body('password').notEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { email, password } = req.body;
        try {
            const result = await query('SELECT * FROM users WHERE email = $1', [email]);
            const user = result.rows[0];
            if (!user || !user.password_hash) {
                return res.status(401).json({ error: 'Invalid email or password.' });
            }
            const valid = await bcrypt.compare(password, user.password_hash);
            if (!valid) return res.status(401).json({ error: 'Invalid email or password.' });

            const token = signToken(user);
            res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error during login.' });
        }
    }
);

// ── POST /api/auth/google ─────────────────────────────────
// Expects a Google ID token from the frontend; verifies and upserts user.
router.post('/google', async (req, res) => {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ error: 'Google ID token required.' });

    try {
        // In production, verify with Google's tokeninfo endpoint or google-auth-library
        const googleRes = await fetch(
            `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`
        );
        const payload = await googleRes.json();
        if (payload.error || !payload.email) {
            return res.status(401).json({ error: 'Invalid Google token.' });
        }

        const { sub: google_id, email, name, picture } = payload;

        // Upsert user
        const result = await query(
            `INSERT INTO users (name, email, google_id, avatar_url)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO UPDATE SET google_id = EXCLUDED.google_id, avatar_url = EXCLUDED.avatar_url
       RETURNING id, name, email`,
            [name, email, google_id, picture]
        );
        const user = result.rows[0];
        const token = signToken(user);
        res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error during Google auth.' });
    }
});

// ── POST /api/auth/reset-password ────────────────────────
// Sends a password reset email (simplified — no token link, just a stub pattern)
router.post(
    '/reset-password',
    [body('email').isEmail().normalizeEmail()],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { email } = req.body;
        try {
            const result = await query('SELECT id FROM users WHERE email = $1', [email]);
            // Always respond 200 to avoid email enumeration
            if (!result.rows.length) return res.json({ message: 'If that email exists, a reset link has been sent.' });

            // In production, generate a reset token, store it, and email it.
            // See src/utils/email.js for the nodemailer setup.
            res.json({ message: 'If that email exists, a reset link has been sent.' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error.' });
        }
    }
);

// ── GET /api/auth/me ─────────────────────────────────────
router.get('/me', requireAuth, async (req, res) => {
    try {
        const result = await query('SELECT id, name, email, avatar_url, created_at FROM users WHERE id = $1', [req.user.id]);
        if (!result.rows.length) return res.status(404).json({ error: 'User not found.' });
        res.json({ user: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error.' });
    }
});

module.exports = router;
