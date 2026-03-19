require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Routes
const authRoutes = require('./src/routes/auth');
const circleRoutes = require('./src/routes/circles');
const entryRoutes = require('./src/routes/entries');
const daylockRoutes = require('./src/routes/daylocks');
const notificationRoutes = require('./src/routes/notifications');

const app = express();
const PORT = process.env.PORT || 4000;

// ── Middleware ──────────────────────────────────────────
app.use(cors({
    origin: [
        'http://localhost:3000',
        process.env.FRONTEND_URL,
    ].filter(Boolean),
    credentials: true,
}));
app.use(express.json({ limit: '5mb' }));

// ── Health Check ────────────────────────────────────────
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'gerno-api', timestamp: new Date().toISOString() });
});

// ── API Routes ──────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/circles', circleRoutes);
app.use('/api/entries', entryRoutes);
app.use('/api/daylocks', daylockRoutes);
app.use('/api/notifications', notificationRoutes);

// ── 404 Handler ─────────────────────────────────────────
app.use((_req, res) => {
    res.status(404).json({ error: 'Route not found.' });
});

// ── Global Error Handler ────────────────────────────────
app.use((err, _req, res, _next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error.' });
});

// ── Start ───────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`\n🌿 Gerno API running at http://localhost:${PORT}`);
    console.log(`   Health check: http://localhost:${PORT}/health\n`);
});

module.exports = app;
