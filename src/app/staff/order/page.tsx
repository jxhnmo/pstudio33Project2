import Link from 'next/link';
import styles from "@/app/staff/order/staffOrder.module.css";

export default function StaffOrder() {
  return (
    <div>
      <p className={styles.p}>This is the Staff Order page.</p>
      
      {/* Navigation Buttons */}
      <div className={styles.buttonsContainer}>
        <Link href="/staff/order" legacyBehavior>
          <a className={styles.navButton}>Staff Order</a>
        </Link>
        <Link href="/staff/stats" legacyBehavior>
          <a className={styles.navButton}>Staff Stats</a>
        </Link>
        <Link href="/staff/inventory" legacyBehavior>
          <a className={styles.navButton}>Staff Inventory</a>
        </Link>
      </div>
    </div>
  );
}
