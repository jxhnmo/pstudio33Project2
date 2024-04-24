'use server';

import { google } from 'googleapis';
import { Pool } from 'pg'; // Connect to PostgreSQL

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL_LOCAL // Adjust based on environment
);

const pool = new Pool({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: 5432,
});

// Get Google OAuth URL
export async function getGoogleAuthURL() {
  const scopes = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
  ];

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: scopes.join(' '),
  });

  return authUrl; // Return the generated OAuth URL
}


// Handle OAuth Callback and validate email
export async function validateEmailAndLogin(code) {
  try {
    const { tokens } = await oauth2Client.getToken(code); // Get the OAuth tokens
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: 'v2',
    });

    const userInfo = await oauth2.userinfo.get(); // Get user info from Google
    const userEmail = userInfo.data.email;

    // Check if the email exists in the database
    const result = await pool.query('SELECT * FROM employees WHERE email = $1', [userEmail]);

    if (result.rows.length > 0) {
      const employee = result.rows[0];
      return {
        valid: true,
        manager: employee.manager, // Return whether the user is a manager
        email: employee.email,
      };
    } else {
      return {
        valid: false,
        error: 'Invalid email address',
      };
    }
  } catch (error) {
    console.error("Error handling OAuth callback:", error);
    throw error;
  }
}
