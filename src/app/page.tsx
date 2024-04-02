"use client";

import Image from "next/image";
import styles from "./styles/page.module.css";
import DBConnection from "./DBConnection"; // Adjust the path as necessary
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useState } from "react";

export default function Home() {

  const handleSubmit = (event: any) => {
    event.preventDefault();

    // Get the values from the form
    const username = event.target.username.value;
    const password = event.target.password.value;

    if (username === '0' && password === '0') {
      window.location.href = '/staff/order';
    } else {
      alert("Incorrect username or password.");
    }
  }

  return (
    <main>
      <div>
        <div>
          <h1 className={styles.h1}>Welcome to REVS</h1>
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
 );
}