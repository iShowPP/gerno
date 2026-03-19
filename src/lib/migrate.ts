import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function migrate() {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
        console.error('❌ Error: DATABASE_URL not found in .env.local');
        process.exit(1);
    }

    const sql = neon(dbUrl);
    const schemaPath = path.join(process.cwd(), 'server/src/schema.sql');
    
    try {
        console.log('🌱 Starting database migration...');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        // Split by semicolon and filter out empty lines/comments to execute one by one
        // Note: Simple split might fail on complex SQL, but for this schema it's fine.
        const statements = schema
            .split(';')
            .map(s => s.trim())
            .filter(s => s && !s.startsWith('--'));

        for (const statement of statements) {
            await sql(statement);
        }

        console.log('✅ Migration successful! Your database is ready.');
    } catch (err) {
        console.error('❌ Migration failed:', err);
        process.exit(1);
    }
}

migrate();
