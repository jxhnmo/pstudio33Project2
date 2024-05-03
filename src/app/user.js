'use server';

import { Pool } from 'pg';

export async function fetchAllEmployees() {
  const pool = new Pool({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: 5432,
  });

  try {
    const query = `SELECT * FROM employees;`;
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw new Error('Failed to fetch employees');
  }
}

export async function addEmployee(name, salary, shiftStart, shiftEnd, manager, username, password, email) {
  const pool = new Pool({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: 5432,
  });

  try {
    const query = `
      INSERT INTO employees (name, salary, shift_start, shift_end, manager, username, password, email)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id;
    `;
    const params = [name, salary, shiftStart, shiftEnd, manager, username, password, email];
    const result = await pool.query(query, params);
    return result.rows[0].id;  // Returns the id of the newly created employee
  } catch (error) {
    console.error('Error adding new employee:', error);
    throw new Error('Failed to add employee');
  }
}

  export async function removeEmployee(employeeId) {
    const pool = new Pool({
      user: process.env.DATABASE_USER,
      host: process.env.DATABASE_HOST,
      database: process.env.DATABASE_NAME,
      password: process.env.DATABASE_PASSWORD,
      port: 5432,
    });
    
    try {
      const query = `DELETE FROM employees WHERE id = $1;`;
      const params = [employeeId];
      const result = await pool.query(query, params);
      if (result.rowCount > 0) {
        return { success: true, message: 'Employee removed successfully' };
      } else {
        return { success: false, message: 'No employee found with the given ID' };
      }
    } catch (error) {
      console.error('Error removing employee:', error);
      throw new Error('Failed to remove employee');
    }
  }
  