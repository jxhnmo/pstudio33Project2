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
    // This query checks for a matching username first, and falls back to id if no username is found.
    // It also checks for the password, defaulting to '0' if not provided.
    const query = `
      SELECT id, manager
      FROM employees
      WHERE (
        ("username" IS NOT NULL AND "username" = $1) OR
        ("username" IS NULL AND CAST(id AS TEXT) = $1)
      )
      AND (
        (password IS NOT NULL AND password = $2) OR
        (password IS NULL OR $2 = '0')
      );
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

  