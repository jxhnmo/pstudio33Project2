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
        SELECT inventory_items.item_name, COUNT(inventory_items.item_name) AS count FROM sales_items 
        LEFT JOIN sales_transactions ON sales_transactions.id = sales_items.sales_id
        LEFT JOIN menu_items ON sales_items.menu_id = menu_items.id
        LEFT JOIN ingredients ON menu_items.id = ingredients.menu_id
        LEFT JOIN inventory_items ON ingredients.item_id = inventory_items.id
        WHERE DATE(sales_transactions.purchase_time) = DATE($1)
        GROUP BY inventory_items.item_name;`;
        // RIGHT JOIN sales_items ON sales_transactions.id = sales_items.sales_id
        // LEFT JOIN menu_items on sales_items.menu_id = menu_items.id
        // JOIN ingredients ON menu_items.id = ingredients.menu_id
        // JOIN inventory_items ON ingredients.menu_id = inventory_items.id
        // WHERE DATE(sales_transactions.purchase_time) = DATE($1)
        // GROUP BY inventory_items.item_name;`;
        const result = await pool.query(query, [today]);
        return result.rows;
    } catch (err) {
        console.error('Failed to fetch ingredients used today', err);
        return [];
    }
}


export async function fetchXData() {
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
            SELECT st.id, st.takeout, st.cost, st.purchase_time, st.valid,
                e.name AS employee_name, e.shift_start, e.shift_end,
                array_agg(concat(mi_count, 'x ', mi_name) ORDER BY mi_name) AS items
            FROM (
                SELECT st.id AS transaction_id, mi.name AS mi_name, COUNT(mi.id) AS mi_count
                FROM sales_transactions st
                JOIN sales_items si ON si.sales_id = st.id
                JOIN menu_items mi ON si.menu_id = mi.id
                GROUP BY st.id, mi.id, mi.name
            ) AS subquery
            LEFT JOIN sales_transactions st ON st.id = subquery.transaction_id
            JOIN employees e ON st.employee_id = e.id
            WHERE DATE(st.purchase_time) = $1
            GROUP BY st.id, e.name, e.shift_start, e.shift_end, st.takeout
            ORDER BY st.id ASC;
        `;
        
        const result = await pool.query(query, [today]);
        return result.rows.map(row => ({
            id: row.id,
            takeout: row.takeout,
            cost: row.cost,
            purchase_time: row.purchase_time,
            name: row.employee_name,
            shift_start: row.shift_start,
            shift_end: row.shift_end,
            items: row.items.map(name => `${name}`), // Assuming each sales item has a quantity of 1
            valid: row.valid
        }));
    } catch (err) {
        console.error('Failed to fetch sales data for today', err);
        return [];
    }
}

export async function fetchZData(startDate, endDate) {
    const pool = new Pool({
      user: process.env.DATABASE_USER,
      host: process.env.DATABASE_HOST,
      database: process.env.DATABASE_NAME,
      password: process.env.DATABASE_PASSWORD,
      port: 5432,
    });
  
    try {
        const start = new Date(`${startDate}T00:00:00Z`);
        const end = new Date(`${endDate}T23:59:59Z`);
    
        const query = `
            SELECT st.id, st.takeout, st.cost, st.purchase_time, st.valid,
                e.name AS employee_name, e.shift_start, e.shift_end,
                array_agg(concat(mi_count, 'x ', mi_name) ORDER BY mi_name) AS items
            FROM (
                SELECT st.id AS transaction_id, mi.name AS mi_name, COUNT(mi.id) AS mi_count
                FROM sales_transactions st
                JOIN sales_items si ON si.sales_id = st.id
                JOIN menu_items mi ON si.menu_id = mi.id
                GROUP BY st.id, mi.id, mi.name
            ) AS subquery
            JOIN sales_transactions st ON st.id = subquery.transaction_id
            JOIN employees e ON st.employee_id = e.id
            WHERE st.purchase_time BETWEEN $1 AND $2
            GROUP BY st.id, e.name, e.shift_start, e.shift_end, st.takeout
            ORDER BY st.id ASC;
        `;

        const result = await pool.query(query, [
            start.toISOString(),
            end.toISOString()
        ]);
        return result.rows.map(row => ({
            id: row.id,
            takeout: row.takeout,
            cost: row.cost,
            purchase_time: row.purchase_time,
            name: row.employee_name,
            shift_start: row.shift_start,
            shift_end: row.shift_end,
            items: row.items.map(name => `${name}`),
            valid: row.valid
        }));
    } catch (err) {
      console.error('Failed to fetch sales data for the selected period', err);
      return [];
    }
}


export async function setSalesTransactionValid(id) {
    const pool = new Pool({
        user: process.env.DATABASE_USER,
        host: process.env.DATABASE_HOST,
        database: process.env.DATABASE_NAME,
        password: process.env.DATABASE_PASSWORD,
        port: 5432,
    });
    
    try {
        const query = `
            UPDATE sales_transactions
            SET valid = NOT valid
            WHERE id = $1;
        `;
        await pool.query(query, [id]);
        console.log(`Transaction ${id} validity toggled.`);
    } catch (err) {
        console.error('Failed to delete/undo delete sales transaction', err);
    }
}

export async function fetchExcessData(timestamp) {
    const pool = new Pool({
        user: process.env.DATABASE_USER,
        host: process.env.DATABASE_HOST,
        database: process.env.DATABASE_NAME,
        password: process.env.DATABASE_PASSWORD,
        port: 5432,
    });

    try {
        const formattedTimestamp = new Date(timestamp); // Ensure timestamp is a Date object
        const currentTime = new Date();
        const query = `
            SELECT ii.id, ii.item_name, ii.stock,
                   COALESCE(SUM(ing.num), 0) AS sold_stock
            FROM inventory_items ii
            LEFT JOIN ingredients ing ON ii.id = ing.item_id
            LEFT JOIN menu_items mi ON ing.menu_id = mi.id
            LEFT JOIN sales_items si ON mi.id = si.menu_id
            LEFT JOIN sales_transactions st ON si.sales_id = st.id
            WHERE st.purchase_time BETWEEN $1 AND $2 AND st.valid = TRUE
            GROUP BY ii.id
            ORDER BY ii.id ASC;
        `;

        const result = await pool.query(query, [
            formattedTimestamp.toISOString(),
            currentTime.toISOString()
        ]);
        return result.rows.map(row => ({
            id: row.id,
            item_name: row.item_name,
            stock: row.stock,
            sold_stock: row.sold_stock,
            sold_percentage: ((row.sold_stock / row.stock) * 100).toFixed(2) + '%'
        }));
    } catch (err) {
        console.error('Failed to fetch excess data', err);
        return [];
    }
}
