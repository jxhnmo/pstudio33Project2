"use client";

import styles from "./styles/page.module.css";
import Link from 'next/link';
import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import { loginUser } from './login';
import { fetchWeather } from './weather';
const Sidebar = dynamic(() => import('../components/sidebar/Sidebar'), {
  ssr: false,
});
const Magnifier = dynamic(() => import('../components/magnifier/Magnifier'), {
  ssr: false,
});

export default function Home() {
  const [loginError, setLoginError] = useState(''); // State for the login error message
  useEffect(() => {
    const fetchData = async () => {
      try {
        localStorage.setItem('weatherData', JSON.stringify(await fetchWeather())); // Clear means weather is fine, else it's probably cloudy or sommething, rgiht? 
        return await fetchWeather();
      } catch (error) {
        console.error('Error fetching weather:', error);
      }
    };
    fetchData();
    //store the result of fetchData in local storage
  }
    )
  const handleSubmit = async (event:any) => {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value || '0';

    try {
      const { manager } = await loginUser(username, password);

      document.cookie = `isManager=${manager}; path=/; max-age=3600; SameSite=Lax`;

      window.location.href = `/staff/order`;
    } catch (error) {
      console.error("Login failed:", error);
      setLoginError("Invalid login, try again."); // Set the error message
    }
  };
  
  return (
    <>
      <Sidebar />
      <main>
        <div>
          <h1 className={styles.h1}>Welcome to REV&apos;S</h1>
        </div>
        <div className="container">
          <Link href="/order" className={styles.square}>Customer Order</Link>
          <Link href="/menu" className={styles.square}>Menu</Link>
          <div className={styles.square}>
            <form onSubmit={handleSubmit}>
              <h1>Staff</h1>
              <label htmlFor="username">Username:</label><br />
              <input type="text" id="username" name="username" /><br />
              <label htmlFor="password">Password:</label><br />
              <input type="password" id="password" name="password" /><br />
              <button type="submit" className={styles.loginButton}>Login</button>
            </form>
            {loginError && <div className={styles.loginError}>{loginError}</div>}
          </div>
        </div>
      </main>
    </>
 );
}