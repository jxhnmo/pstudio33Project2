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
        const result = await pool.query('SELECT MAX(id)+1 AS max_id FROM sales_transactions;');
        const result2 = await pool.query('SELECT MAX(id)+1 AS max_id FROM sales_items;');
        await pool.end();
        const sales_id = result.rows[0].max_id;
        var sales_item_id = result2.rows[0].max_id
        console.log(`${sales_id}`);
        
        
        
        const queryText = 'INSERT INTO sales_transactions VALUES ($1,$2,0,$3);';
        await pool2.query(queryText, [sales_id,cost,currentTime.toISOString()]);
        await pool2.end();
        
        const itemQueryText = 'INSERT INTO sales_items VALUES ';
        var idx = 1;
        const params = selectedItems.map((item,index) => '('+sales_item_id+index+','+sales_id+','+item.id+')').join(',');
        console.log(params)
        
        await pool3.query(itemQueryText+params);
        await pool3.end();
    } catch (err) {
        console.error(`Failed`,err);
    }
    
    
    /*
    try {
        const queryText = 'INSERT INTO sales_transactions VALUES ((SELECT MAX(id)+1 FROM SALES_TRANSACTIONS),$1,0,$2);';
        await pool.query(queryText, [cost,currentTime.toISOString()]);
        await pool.end();
    
    } catch (err) {
        console.error(`Failed to fetch items for category`, err);
    }*/
}