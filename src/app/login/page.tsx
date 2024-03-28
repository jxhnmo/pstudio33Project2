import Image from "next/image";
import styles from "@/app/login/login.module.css";
import Link from 'next/link'



export default function Home() {
  return (
    <div>
      <div>
        <h1 className={styles.h1}>Welcome to REVS</h1>
      </div>
      <div className="container">
        <Link className={styles.square} href="/order"> Customer Order</Link>
        <Link className={styles.square} href="/menu"> Menu</Link>
        <div className={styles.square}>
          <form>
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
  );
}
