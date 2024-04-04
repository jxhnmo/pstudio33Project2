'use server'
import { Pool } from 'pg';

export async function fetchInventory() {
    const pool = new Pool({
        user: process.env.DATABASE_USER,
        host: process.env.DATABASE_HOST,
        database: process.env.DATABASE_NAME,
        password: process.env.DATABASE_PASSWORD,
        port: 5432,
    });

    try {
        const queryResult = await pool.query('SELECT * FROM inventory_items ORDER BY item_name ASC;');
        await pool.end();
        return queryResult.rows;
    } catch (err) {
        console.error('Failed to fetch inventory', err);
        return [];
    }
}