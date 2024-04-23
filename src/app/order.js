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
export async function getMaxId(){
    const pool = new Pool({
        user: process.env.DATABASE_USER,
        host: process.env.DATABASE_HOST,
        database: process.env.DATABASE_NAME,
        password: process.env.DATABASE_PASSWORD,
        port: 5432,
    });
    try {
        const queryResult = await pool.query('SELECT MAX(id) as max_id FROM sales_transactions;');
        await pool.end();
        return queryResult.rows[0].max_id;
    } catch (err) {
        console.error('Failed to fetch categories', err);
        return [];
    }

}
export async function getItemInfo(itemId){
    const pool = new Pool({
        user: process.env.DATABASE_USER,
        host: process.env.DATABASE_HOST,
        database: process.env.DATABASE_NAME,
        password: process.env.DATABASE_PASSWORD,
        port: 5432,
    });
    try {
        const queryResult = await pool.query('SELECT * FROM menu_items WHERE id = $1;', [itemId]);
        await pool.end();
        return queryResult.rows[0];
    } catch (err) {
        console.error('Failed to fetch categories', err);
        return [];
    }
}
export async function getMenuItemIngredients(menuItemId){
    const pool = new Pool({
        user: process.env.DATABASE_USER,
        host: process.env.DATABASE_HOST,
        database: process.env.DATABASE_NAME,
        password: process.env.DATABASE_PASSWORD,
        port: 5432,
    });
    try {
        const queryResult = await pool.query('SELECT item_name FROM inventory_items WHERE id IN (SELECT item_id FROM ingredients WHERE menu_id = $1);', [menuItemId]);
        await pool.end();
        return queryResult.rows;
    } catch (err) {
        console.error('Failed to fetch categories', err);
        return [];
    }
}
export async function getMenuItemCalories(menuItemId){
    const pool = new Pool({
        user: process.env.DATABASE_USER,
        host: process.env.DATABASE_HOST,
        database: process.env.DATABASE_NAME,
        password: process.env.DATABASE_PASSWORD,
        port: 5432,
    });
    try {
        const queryResult = await pool.query('SELECT item_name FROM inventory_items WHERE id IN (SELECT item_id FROM ingredients WHERE menu_id = $1);', [menuItemId]);
        await pool.end();
        return queryResult.rows;
    } catch (err) {
        console.error('Failed to fetch categories', err);
        return [];
    }
}

export async function getIrremovableIngredients() {
    const pool = new Pool({
        user: process.env.DATABASE_USER,
        host: process.env.DATABASE_HOST,
        database: process.env.DATABASE_NAME,
        password: process.env.DATABASE_PASSWORD,
        port: 5432,
    });
    try {
        const queryResult = await pool.query('SELECT * FROM irremovable_ingredients');
        await pool.end();
        return queryResult.rows;
    } catch (err) {
        console.error('Failed to fetch irremovable ingredients', err);
        return [];
    }
}

export async function completeTransaction(cost,selectedItems) {
    const pool = new Pool({
        user: process.env.DATABASE_USER,
        host: process.env.DATABASE_HOST,
        database: process.env.DATABASE_NAME,
        password: process.env.DATABASE_PASSWORD,
        port: 5432,
    });
    const pool2 = new Pool({
        user: process.env.DATABASE_USER,
        host: process.env.DATABASE_HOST,
        database: process.env.DATABASE_NAME,
        password: process.env.DATABASE_PASSWORD,
        port: 5432,
    });
    
    const pool3 = new Pool({
        user: process.env.DATABASE_USER,
        host: process.env.DATABASE_HOST,
        database: process.env.DATABASE_NAME,
        password: process.env.DATABASE_PASSWORD,
        port: 5432,
    });
    
    console.log();
    selectedItems.map((item,index) => {console.log(item.id+item.name+item.price+item.quantity)})
    const currentTime = new Date();
    try {
        console.log(`Fetching id value from sales_transactions`); // Debugging
        const result = await pool.query('SELECT (MAX(id)+1)%1000 FROM sales_transactions;');
        console.log('here');
        await pool.end();
        var sales_id = result.rows[0].max_id;
        
        
        const queryText = 'INSERT INTO sales_transactions VALUES ((SELECT MAX(id) + 1 FROM sales_transactions),$1,1,$2);';
        await pool2.query(queryText, [cost,currentTime.toISOString()]);
        await pool2.end();
        
        const itemQueryText = 'INSERT INTO sales_items (id, sales_id, menu_id) VALUES ';
        var idx = 1;
        const params = selectedItems.map((item,index) => '('+`(SELECT MAX(id)+1+${index} FROM sales_items)`+',\n'+'(SELECT MAX(id) FROM sales_transactions), '+'\n'+item.id+');').join(',');
        console.log(itemQueryText + params)
        
        await pool3.query(itemQueryText+params);
        await pool3.end();
        return sales_id;
    } catch (err) {
        
        console.error(`Failed completeTransaction`,err);
    }
}