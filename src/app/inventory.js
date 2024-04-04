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

export async function addItem(newItem) {
    const pool = new Pool({
        user: process.env.DATABASE_USER,
        host: process.env.DATABASE_HOST,
        database: process.env.DATABASE_NAME,
        password: process.env.DATABASE_PASSWORD,
        port: 5432,
    });

    try {
        const idResult = await pool.query('SELECT MAX(id) as max_id FROM inventory_items;');
        let newId = idResult.rows[0].max_id ? idResult.rows[0].max_id + 1 : 1;

        const insertQuery = 'INSERT INTO inventory_items(id, item_name, max_stock, price, stock) VALUES($1, $2, $3, $4, $5) RETURNING *;';
        const values = [newId, newItem.item_name, newItem.max_stock, newItem.price, newItem.stock];
        const insertResult = await pool.query(insertQuery, values);

        await pool.end();
        return insertResult.rows[0];
    } catch (err) {
        console.error('Failed to add item', err);
        throw err;
    }
}