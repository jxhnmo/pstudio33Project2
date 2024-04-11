'use server';
import { Pool } from 'pg';

export async function addIngredient(ingredient) {
    const pool = new Pool({
        user: process.env.DATABASE_USER,
        host: process.env.DATABASE_HOST,
        database: process.env.DATABASE_NAME,
        password: process.env.DATABASE_PASSWORD,
        port: 5432,
    });

    try {
        const insertQuery = 'INSERT INTO ingredients(item_id, menu_id, num) VALUES($1, $2, $3) RETURNING *;';
        const values = [ingredient.item_id, ingredient.menu_id, ingredient.num];
        const insertResult = await pool.query(insertQuery, values);

        await pool.end();
        return insertResult.rows[0];
    } catch (err) {
        console.error('Failed to add ingredient', err);
        throw err;
    }
}

export async function fetchIngredientsByMenuItem(menuId) {
    const pool = new Pool({
        user: process.env.DATABASE_USER,
        host: process.env.DATABASE_HOST,
        database: process.env.DATABASE_NAME,
        password: process.env.DATABASE_PASSWORD,
        port: 5432,
    });

    try {
        const queryResult = await pool.query('SELECT * FROM ingredients WHERE menu_id = $1;', [menuId]);
        await pool.end();
        return queryResult.rows;
    } catch (err) {
        console.error('Failed to fetch ingredients', err);
        return [];
    }
}

export async function updateIngredientQuantity(ingredientId, newQuantity) {
    const pool = new Pool({
        user: process.env.DATABASE_USER,
        host: process.env.DATABASE_HOST,
        database: process.env.DATABASE_NAME,
        password: process.env.DATABASE_PASSWORD,
        port: 5432,
    });

    try {
        const queryText = 'UPDATE ingredients SET num = $1 WHERE id = $2;';
        const values = [newQuantity, ingredientId];
        await pool.query(queryText, values);
        await pool.end();
    } catch (err) {
        console.error('Failed to update ingredient quantity', err);
    }
}
