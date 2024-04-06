'use server'
import { Pool } from 'pg';

export async function fetchData() {
    const pool = new Pool({
        user: process.env.DATABASE_USER,
        host: process.env.DATABASE_HOST,
        database: process.env.DATABASE_NAME,
        password: process.env.DATABASE_PASSWORD,
        port: 5432,
    });

    try {
        const queryResult = await pool.query('SELECT * FROM sales_transactions ORDER BY id ASC;');
        await pool.end();
        return queryResult.rows;
    } catch (err) {
        console.error('Failed to fetch order data', err);
        return [];
    }
}