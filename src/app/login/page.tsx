import Image from "next/image";
import styles from "@/app/login/login.module.css";
import Link from 'next/link'



export default function Home() {
  return (
    <div className="container">
      <Link className={styles.square} href="/order"> Customer Order</Link>
      <Link className={styles.square} href="/menu"> Menu</Link>
      <Link className={styles.square} href="/staff"> Staff</Link>
    </div>
  );
}
