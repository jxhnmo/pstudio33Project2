"use client";

import Link from 'next/link';
import styles from "@/app/staff/stats/staffStats.module.css";
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

import { fetchData } from '../../analytics';

const Sidebar = dynamic(() => import('../../../components/sidebar/Sidebar'), {
  ssr: false,
});

interface orderData {
  id: number;
  cost: number;
  employee_id: number;
  purchase_time: string;

}

export default function StaffStats() {
  const [data, setData] = useState<[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchData();
        console.log(data);
        setData(data);
      }
      catch (error) {
        console.error("Failed to fetch", error);
      }
    }

    loadData();
  }, []);

  return (
    <>
      <Sidebar />
      <div>
        <p className={styles.p}>This is the Staff Stats page.</p>

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
    </>
  );
}
