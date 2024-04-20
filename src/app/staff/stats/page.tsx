"use client";

import Link from 'next/link';
import styles from "@/app/staff/stats/staffStats.module.css";
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

import { fetchData, fetchRestock, fetchSales, fetchSalesData } from '../../analytics';

const Sidebar = dynamic(() => import('../../../components/sidebar/Sidebar'), {
  ssr: false
});

interface SalesTransaction {
  id: number;
  cost: number;
  employee_id: number;
  purchase_time: string;
  name: string;
  shift_start: string;
  shift_end: string;
  manager: boolean;
  salary: number;
}


interface MenuItem {
  id: number;
  name: string;
  available: boolean;
  price: number;
  category: string;
}

interface InventoryItem {
  id: number;
  itemName: string;
  stock: number;
  maxStock: number;
  deficit?: number;
  unitCost: number;
  totalCost?: number;
  price: number;
}

interface SaleData {
  transaction_id: number;
  employee_name: string;
  manager_status: boolean;
  cost: number;
  purchase_time: string;
}

export default function StaffStats() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [firstSale, setFirstSale] = useState<string | null>(null);
  const [lastSale, setLastSale] = useState<string | null>(null);
  const [lastRestock, setLastRestock] = useState<string | null>(null);
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');
  const [salesTableData, setSalesTableData] = useState([]);
  const [excessTableData, setExcessTableData] = useState([]);
  const [restockTableData, setRestockTableData] = useState([]);
  const [pairSalesTableData, setPairSalesTableData] = useState([]);
  const [selectedOption, setSelectedOption] = useState('product_usage');
  const [salesData, setSalesData] = useState<SalesTransaction[]>([]);

  useEffect(() => {
    const loadSalesData = async () => {
      try {
        const data = await fetchSalesData();
        console.log(data);
        setSalesData(data);
      }
      catch (error) {
        console.error("Failed to fetch sales data", error);
      }
    };

    loadSalesData();
  }, [selectedOption, salesData]);

  useEffect(() => {
    console.log('Current sales data:', salesData);
  }, [salesData]);
  
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchedData = await fetchData();
        if (fetchedData) {
          setMenuItems(fetchedData.menuItems);
          setInventory(fetchedData.inventory);
          setFirstSale(fetchedData.firstSale);
          setLastSale(fetchedData.lastSale);
          setLastRestock(fetchedData.lastRestock);
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };
    loadData();
  });

  useEffect(() => {
    // Update statistics when startDateTime or endDateTime changes
    updateStatistics();
  }, [startDateTime, endDateTime]);

  const processMenuItems = (menuItemsData: MenuItem[]) => {
    return menuItemsData.map(item => ({
      id: item.id,
      name: item.name,
      available: item.available,
      price: item.price,
      category: item.category
    }));
  }

  const processInventory = (inventoryData: InventoryItem[]) => {
    return inventoryData.map(item => ({
      id: item.id,
      itemName: item.itemName,
      stock: item.stock,
      maxStock: item.maxStock,
      deficit: item.maxStock-item.stock,
      unitCost: item.price,
      totalCost: item.price*(item.maxStock-item.stock),
    }));
  }    

  const updateStatistics = () => {
    if (selectedOption === 'product_usage') {
      // Update product usage statistics
      // Implement your logic here
    } else if (selectedOption === 'sales_report') {
      // Update sales report statistics
      // Implement your logic here
    } else if (selectedOption === 'restock_report') {
      // Update restock report statistics
      // Implement your logic here
    } else if (selectedOption === 'excess_report') {
      // Update excess report statistics
      // Implement your logic here
    } else if (selectedOption === 'sells_together') {
      // Update paired sales statistics
      // Implement your logic here
    }
  }

  const handleButtonSelect = (option: any) => {
    setSelectedOption(option);
    updateStatistics();
  }

  return (
    <>
      <Sidebar />
      <div className={styles.main}>
        <div className={styles.stats}>
          <div className={styles.statsOptions}>
            <button
              className={selectedOption === 'product_usage' ? styles.selectedOption : styles.option}
              onClick={() => handleButtonSelect('product_usage')}
            >
              Product Usage
            </button>
            <button
              className={selectedOption === 'sales_report' ? styles.selectedOption : styles.option}
              onClick={() => handleButtonSelect('sales_report')}
            >
              Sales Report
            </button>
            <button
              className={selectedOption === 'x_report' ? styles.selectedOption : styles.option}
              onClick={() => handleButtonSelect('x_report')}
            >
              X-Report
            </button>
            <button
              className={selectedOption === 'restock_report' ? styles.selectedOption : styles.option}
              onClick={() => handleButtonSelect('restock_report')}
            >
              Restock Report
            </button>
            <button
              className={selectedOption === 'excess_report' ? styles.selectedOption : styles.option}
              onClick={() => handleButtonSelect('excess_report')}
            >
              Excess Report
            </button>
            <button
              className={selectedOption === 'sells_together' ? styles.selectedOption : styles.option}
              onClick={() => handleButtonSelect('sells_together')}
            >
              Paired Menu Items
            </button>
          </div>
        </div>

        <div className={styles.statsContent}>
          {/* Display statistics based on selected option */}
          {selectedOption === 'product_usage' && (
            // Implement UI for product usage statistics
            <div>Product Usage Statistics</div>
          )}
          {selectedOption === 'sales_report' && (
            // Implement UI for sales report statistics
            <div>Sales report</div>
          )}
          {selectedOption === 'x_report' && (
            <div>
              <h2>X-Report for Today</h2>
              <div className={styles.xreportTableContainer}>
                <table className={styles.xreportTable}>
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>Employee ID</th>
                    <th>Employee Name</th>
                    <th>Shift Start</th>
                    <th>Shift End</th>
                    <th>Manager</th>
                    <th>Salary</th>
                    <th>Cost</th>
                    <th>Time of Transaction</th>
                  </tr>
                </thead>
                <tbody>
                  {salesData && salesData.length > 0 ? (
                    salesData.map((order: SalesTransaction, index: number) => (
                      <tr key={index}>
                        <td>{order.id}</td>
                        <td>{order.employee_id}</td>
                        <td>{order.name}</td>
                        <td>{order.shift_start}</td>
                        <td>{order.shift_end}</td>
                        <td>{order.manager ? 'Yes' : 'No'}</td>
                        <td>{order.salary}</td>
                        <td>{order.cost}</td>
                        <td>{new Date(order.purchase_time).toLocaleTimeString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9}>No sales data available for today.</td>
                    </tr>
                  )}
                </tbody>
                </table>
              </div>
            </div>
          )}
          {selectedOption === 'restock_report' && (
            // Implement UI for restock report statistics
            <div>
                <div>Restock Report Statistics</div>
                <div className={styles.tableContainer}>
                  <table className={styles.restockTable}>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Item Name</th>
                        <th>Stock</th>
                        <th>Max Stock</th>
                        <th>Deficit</th>
                        <th>Unit Cost</th>
                        <th>Total Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventory.map((item: InventoryItem, index: number) => (
                        <tr key={item.id}>
                          <td>{item.id}</td>
                          <td>{item.itemName}</td>
                          <td>{item.stock}</td>
                          <td>{item.maxStock}</td>
                          <td>{item.deficit}</td>
                          <td>{item.unitCost}</td>
                          <td>{item.totalCost}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
            </div>
          )}
          {selectedOption === 'excess_report' && (
            // Implement UI for excess report statistics
            <div>Excess Report Statistics</div>
          )}
          {selectedOption === 'sells_together' && (
            // Implement UI for paired menu items statistics
            <div>Paired Menu Items Statistics</div>
          )}
        </div>
        {/* // <div id="sales_chart"></div> */}
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
