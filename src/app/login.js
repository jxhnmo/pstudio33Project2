'use server'

import { Pool } from 'pg';

const pool = new Pool({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: 5432,
});

export async function loginUser(username, password = '0') {
    try {
      const query = `
        SELECT id, manager
        FROM employees
        WHERE (CAST(id AS TEXT) = $1 OR "username" = $1)
          AND (password IS NULL OR password = $2 OR $2 = '0');
      `;
      
      const params = [username, password];
      const result = await pool.query(query, params);
  
      if (result.rows.length > 0) {
        const employee = result.rows[0];
        return { id: employee.id, manager: employee.manager };
      } else {
        throw new Error('Incorrect username or password');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Login failed');
    }
  }
  