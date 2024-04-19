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
        const today = new Date().toISOString().slice(0, 10); // Format today's date to YYYY-MM-DD
        const salesQuery = 'SELECT * FROM sales_transactions WHERE DATE(purchase_time) = $1 ORDER BY purchase_time DESC';
        const result = await pool.query(salesQuery, [today]);
        await pool.end();
        return result.rows;
    } catch (err) {
        console.error('Failed to fetch sales data for today', err);
        return [];
    }
}



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