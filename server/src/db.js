const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

pool.on('error', (err) => {
    console.error('Unexpected database error', err);
    process.exit(-1);
});

/**
 * Execute a query against the Neon database.
 * @param {string} text - SQL query string
 * @param {Array} params - Query parameters
 */
const query = (text, params) => pool.query(text, params);

module.exports = { query, pool };
