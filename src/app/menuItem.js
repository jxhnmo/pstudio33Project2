export async function addMenuItem(menuItem) {
    const pool = new Pool({
        user: process.env.DATABASE_USER,
        host: process.env.DATABASE_HOST,
        database: process.env.DATABASE_NAME,
        password: process.env.DATABASE_PASSWORD,
        port: 5432,
    });

    try {
        // Fetch the maximum existing ID from the menu_items table
        const maxIdQuery = 'SELECT MAX(id) FROM menu_items';
        const maxIdResult = await pool.query(maxIdQuery);
        const maxId = maxIdResult.rows[0].max || 0; // If no items exist, start from 0

        // Generate a new unique ID
        const newId = maxId + 1;

        // Insert the new menu item with the generated ID
        const insertQuery = `
            INSERT INTO menu_items(
                id,
                name, 
                available, 
                price, 
                category, 
                description, 
                calories
            ) 
            VALUES($1, $2, $3, $4, $5, $6, $7) 
            RETURNING *;
        `;

        const values = [
            newId,
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

export async function addIngredient(params) {
    const pool = new Pool({
        user: process.env.DATABASE_USER,
        host: process.env.DATABASE_HOST,
        database: process.env.DATABASE_NAME,
        password: process.env.DATABASE_PASSWORD,
        port: 5432,
    });

    try {
        // Fetch the maximum existing ID from the ingredients table
        const maxIdQuery = 'SELECT MAX(id) FROM ingredients';
        const maxIdResult = await pool.query(maxIdQuery);
        const maxId = maxIdResult.rows[0].max || 0; // If no items exist, start from 0

        // Generate a new unique ID
        const newId = maxId + 1;

        // Insert the new menu item with the generated ID
        const insertQuery = `
            INSERT INTO ingredients(
                id,
                item_id,
                menu_id,
                num
            ) 
            VALUES($1, $2, $3, $4) 
            RETURNING *;
        `;

        const values = [
            newId,
            params.item_id,
            params.menu_id,
            params.num
        ];

        const insertResult = await pool.query(insertQuery, values);
        await pool.end();
        return insertResult.rows[0];
    } catch (error) {
        console.error('Failed to add ingredient', error);
        throw error;
    }
}
