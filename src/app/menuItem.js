'use server';
import { Pool } from 'pg';

export async function addMenuItem(menuItem) {
    console.log('received menu item', menuItem);
const pool = new Pool({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: 5432,
});

try {
    // Assuming menuItem object has properties for the menu_items table
    console.log('before insert query');
    const insertQuery = `
    INSERT INTO menu_items(
        name, 
        available, 
        price, 
        category, 
        description, 
        calories
    ) 
    VALUES($1, $2, $3, $4, $5, $6) 
    RETURNING *;
    `;
    console.log('after insert query');
    const values = [
    menuItem.name,
    menuItem.available, 
    parseFloat(menuItem.price), 
    menuItem.category,
    menuItem.description,
    menuItem.calories, 
    ];

    const insertResult = await pool.query(insertQuery, values);
    await pool.end();
    return insertResult.rows[0];
} catch (error) {
    console.error('Failed to add menu item', error);
    throw error;
}
}