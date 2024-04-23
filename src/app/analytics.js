'use server'
import { Pool } from 'pg';

class metadata {
    constructor(menuItems, inventory, firstSale, lastSale, lastRestock) {
        this.menuItems = menuItems;
        this.inventory = inventory;
        this.firstSale = firstSale;
        this.lastSale = lastSale;
        this.lastRestock = lastRestock;
    }
}

export async function fetchData() {
    const pool = new Pool({
        user: process.env.DATABASE_USER,
        host: process.env.DATABASE_HOST,
        database: process.env.DATABASE_NAME,
        password: process.env.DATABASE_PASSWORD,
        port: 5432,
    });

    try {
        // const queryResult = await pool.query('SELECT * FROM sales_transactions ORDER BY id;');
        const firstSaleResult = await pool.query('SELECT purchase_time FROM sales_transactions ORDER BY purchase_time LIMIT 1;');
        const lastSaleResult = await pool.query('SELECT purchase_time FROM sales_transactions ORDER BY purchase_time DESC LIMIT 1;');
        const lastRestockResult = await pool.query('SELECT transaction_date FROM inventory_transactions ORDER BY transaction_date DESC LIMIT 1;');
        const menuItemsResult = await pool.query('SELECT * FROM menu_items;');
        const inventoryResult = await pool.query('SELECT * FROM inventory_items;');
        
        await pool.end();
        return {
          firstSale: firstSaleResult.rows[0].purchase_time,
          lastSale: lastSaleResult.rows[0]?.purchase_time,
          lastRestock: lastRestockResult.rows[0]?.transaction_date,
          menuItems: menuItemsResult.rows,
          inventory: inventoryResult.rows
        };
    } catch (err) {
        console.error('Failed to fetch order data', err);
        return null;
    }
}

export async function fetchSalesData() {
    const pool = new Pool({
        user: process.env.DATABASE_USER,
        host: process.env.DATABASE_HOST,
        database: process.env.DATABASE_NAME,
        password: process.env.DATABASE_PASSWORD,
        port: 5432,
    });

    try {
        const today = new Date().toISOString().split('T')[0]; // Format today's date to YYYY-MM-DD
        const query = `
            SELECT st.id, st.cost, st.employee_id, st.purchase_time, 
                   e.name, e.shift_start, e.shift_end, e.manager, e.salary
            FROM sales_transactions AS st
            JOIN employees AS e ON st.employee_id = e.id
            WHERE DATE(st.purchase_time) = $1
            ORDER BY st.purchase_time DESC;
        `;
        const result = await pool.query(query, [today]);
        return result.rows;
    } catch (err) {
        console.error('Failed to fetch sales data for today', err);
        return [];
    }
}

export async function fetchIngredientsUsedToday(){
    const pool = new Pool({
        user: process.env.DATABASE_USER,
        host: process.env.DATABASE_HOST,
        database: process.env.DATABASE_NAME,
        password: process.env.DATABASE_PASSWORD,
        port: 5432,
    });

    try {
        const today = new Date().toISOString().split('T')[0]; 
        const query = `
        SELECT inventory_items.item_name, COUNT(inventory_items.item_name) AS count FROM sales_transactions 
        JOIN sales_items ON sales_transactions.id = sales_items.sales_id
        JOIN menu_items on sales_items.menu_id = menu_items.id
        JOIN ingredients ON menu_items.id = ingredients.menu_id
        JOIN inventory_items ON ingredients.menu_id = inventory_items.id
        WHERE DATE(sales_transactions.purchase_time) = DATE($1)
        GROUP BY inventory_items.item_name;`;
        const result = await pool.query(query, [today]);
        return result.rows;
    } catch (err) {
        console.error('Failed to fetch ingredients used today', err);
        return [];
    }

}
/*

       SELECT inventory_items.item_name, COUNT(inventory_items.item_name) FROM sales_transactions 
            JOIN sales_items ON sales_transactions.id = sales_items.sales_id
            JOIN menu_items on sales_items.menu_id = menu_items.id
            JOIN ingredients ON menu_items.id = ingredients.menu_id
            JOIN inventory_items ON ingredients.menu_id = inventory_items.id
            WHERE DATE(sales_transactions.purchase_time) = DATE('2024-04-22')
            GROUP BY inventory_items.item_name;
*/





export async function fetchRestock(startTime,endTime) {
    const pool = new Pool({
        user: process.env.DATABASE_USER,
        host: process.env.DATABASE_HOST,
        database: process.env.DATABASE_NAME,
        password: process.env.DATABASE_PASSWORD,
        port: 5432,
    });
    
    try {
        const restock_reports = await pool.query('')
    } catch (err) {
        console.error('Failed to fetch restock data',err);
        return [];
    }
}

export async function fetchSales(startTime,endTime,menuId) {
    const pool = new Pool({
        user: process.env.DATABASE_USER,
        host: process.env.DATABASE_HOST,
        database: process.env.DATABASE_NAME,
        password: process.env.DATABASE_PASSWORD,
        port: 5432,
    });
    
    try {
        const sales_data = await pool.query("SELECT DATE_TRUNC('day', purchase_time) AS purchase_day,COUNT(*) as count "
        + "FROM sales_transactions JOIN sales_items ON sales_transactions.id = sales_items.sales_id "
        + "WHERE purchase_time > $1 AND purchase_time < $2 AND sales_items.menu_id = $3 "
        + "GROUP BY DATE_TRUNC('day',purchase_time) ORDER BY purchase_day;", [startTime,endTime,menuId]);
        const data = sales_data.rows.map((row) => {return [row.purchase_day.getTime(),parseInt(row.count)]})
        console.log(data)
        return data;
        //return sales_data.rows;
    } catch (err) {
        console.error('Failed to fetch sales data',err);
        return [];
    }
}