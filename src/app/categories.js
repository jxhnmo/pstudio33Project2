'use server'
import { Pool } from 'pg';

// This is just an example function, adjust it to your actual logic and return format
export async function fetchCategories() {
    const pool = new Pool({
        user: process.env.DATABASE_USER,
        host: process.env.DATABASE_HOST,
        database: process.env.DATABASE_NAME,
        password: process.env.DATABASE_PASSWORD,
        port: 5432,
    });

    try {
        const queryResult = await pool.query('SELECT category FROM menu_items GROUP BY category;');
        await pool.end();
        return queryResult.rows; // Assuming this returns the categories
    } catch (err) {
        console.error('Failed to fetch categories', err);
        return [];
    }
}
// export default function handler(req, res) {
//     res.status(200).json({ message: 'Success' });
// }