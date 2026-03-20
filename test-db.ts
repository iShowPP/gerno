import { query } from './src/lib/db';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function test() {
    try {
        console.log('🔍 Testing DB connection...');
        const users = await query('SELECT count(*) FROM users');
        console.log('✅ Connection successful. User count:', users[0].count);
        process.exit(0);
    } catch (err) {
        console.error('❌ DB Test failed:', err);
        process.exit(1);
    }
}

test();
