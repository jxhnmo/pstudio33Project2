'use server'
import { Pool } from 'pg';

export async function fetchCategories() {
    const pool = new Pool({
        user: process.env.DATABASE_USER,
        host: process.env.DATABASE_HOST,
        database: process.env.DATABASE_NAME,
        password: process.env.DATABASE_PASSWORD,
        port: 5432,
    });

    try {
        const queryResult = await pool.query('SELECT category FROM menu_items GROUP BY category ORDER BY category ASC;');
        await pool.end();
        return queryResult.rows; // Assuming this returns the categories
    } catch (err) {
        console.error('Failed to fetch categories', err);
        return [];
    }
}

export async function fetchItems(categoryName) {
    const pool = new Pool({
        user: process.env.DATABASE_USER,
        host: process.env.DATABASE_HOST,
        database: process.env.DATABASE_NAME,
        password: process.env.DATABASE_PASSWORD,
        port: 5432,
    });

    try {
        const queryText = 'SELECT * FROM menu_items WHERE category = $1 ORDER BY name ASC;';
        console.log(`Fetching items for category: ${categoryName}`); // Debugging
        const queryResult = await pool.query(queryText, [categoryName]);
        console.log(`Query result: `, queryResult.rows); // Debugging
        await pool.end();
        return queryResult.rows;
    } catch (err) {
        console.error(`Failed to fetch items for category ${categoryName}`, err);
        return [];
    }
}