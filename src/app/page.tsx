"use client";

import styles from "./styles/page.module.css";
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { loginUser } from './login';

const Sidebar = dynamic(() => import('../components/sidebar/Sidebar'), {
  ssr: false,
});
const Magnifier = dynamic(() => import('../components/magnifier/Magnifier'), {
  ssr: false,
});

export default function Home() {
  //Function needs backend connection so that 1. it takes username from DB
  //  and 2. it passes a boolean to the order page saying if it's a manager or not
  const handleSubmit = async (event: any) => {
    event.preventDefault();
  
    const username = event.target.username.value;
    const password = event.target.password.value || '0';
  
    try {
      const { manager } = await loginUser(username, password);
      window.location.href = `/staff/order?manager=${manager}`;
    } catch (error) {
      console.error("Login failed:", error);
      alert("Incorrect username or password or an error occurred.");
    }
  };
  
  return (
    <>
      <Sidebar />
      <main>
        <div>
          <div>
            <h1 className={styles.h1}>Welcome to REV&apos;S</h1>
          </div>
          <div className="container">
            <Link className={styles.square} href="/order"> Customer Order</Link>
            <Link className={styles.square} href="/menu"> Menu</Link>
            <div className={styles.square}>
              <form onSubmit={handleSubmit}>
                <h1>Staff</h1>
                <label htmlFor="username">Username:</label><br />
                <input type="text" id="username" name="username" /> <br />
                <label htmlFor="password">Password:</label><br />
                <input type="password" id="password" name="password" /> <br />
                <button type="submit">Login</button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
 );
}