/**
 * Migration script — runs the schema.sql against your Neon database.
 * Usage: npm run migrate
 */
const fs = require('fs');
const path = require('path');
const { pool } = require('./db');

async function migrate() {
    const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
    try {
        await pool.query(sql);
        console.log('✓ Migration complete — all tables created.');
    } catch (err) {
        console.error('✗ Migration failed:\n', err.message);
    } finally {
        await pool.end();
    }
}

migrate();
