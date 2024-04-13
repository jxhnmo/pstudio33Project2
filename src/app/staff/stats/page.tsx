"use client";

import Link from 'next/link';
import styles from "@/app/staff/stats/staffStats.module.css";
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import ApexCharts from 'apexcharts'

import { fetchData, fetchRestock, fetchSales } from '../../analytics';

const Sidebar = dynamic(() => import('../../../components/sidebar/Sidebar'), {
  ssr: false,
});

interface FetchedData {
  firstSale: string;
  lastSale: string;
  lastRestock: string;
  menuItems: MenuItem[];
  inventory: InventoryItem[];
}

interface orderData {
  id: number;
  cost: number;
  employee_id: number;
  purchase_time: string;
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




export default function StaffStats() {
  const [data, setData] = useState<FetchedData | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [firstSale, setFirstSale] = useState<string | null>(null);
  const [lastSale, setLastSale] = useState<string | null>(null);
  const [lastRestock, setLastRestock] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState('product_usage');
  const [startDateTime, setStartDateTime] = useState(null);
  const [endDateTime, setEndDateTime] = useState(null);
  const [salesTableData, setSalesTableData] = useState([]);
  const [excessTableData, setExcessTableData] = useState([]);
  const [restockTableData, setRestockTableData] = useState([]);
  const [pairSalesTableData, setPairSalesTableData] = useState([]);

  // useEffect(() => {
  //   const loadData = async () => {
  //     try {
  //       // Fetch data from the server
  //       const data = await fetchData();
  //       setData(data);

  //       const menuItems = processMenuItems(data.menuItems);
  //       setMenuItems(menuItems);

  //       const inventory = processInventory(data.inventory);
  //       setInventory(inventory);

  //       setFirstSale(data.firstSale);
  //       // console.log(data.firstSale);
  //       setLastSale(data.lastSale);
  //       // console.log(data.lastSale);
  //       setLastRestock(data.lastRestock);
        
  //       // Set default start and end dates
  //       setStartDateTime(data.firstSale);
  //       setEndDateTime(data.lastSale);
  //       setSalesTableData(prevState => ({
  //           options: {
  //               chart: {
  //                 type: 'line'
  //               },
  //               series: [{
  //                 name: 'Sales',
  //                 data: fetchSales(firstSale,lastSale,1)
  //               }],
  //               xaxis: {
  //                 x: new Date('01 Jan 2023').getTime(),
  //                 type: 'datetime',
  //                 min: new Date('01 Jan 2023').getTime()
  //               },
  //               dataLabels: {
  //                   enabled: false
  //               },
  //           }
  //       }));
  //       // const chart = new ApexCharts(document.querySelector('#sales_chart'), salesTableData.options);
  //       // chart.render();
  //     } catch (error) {
  //       console.error("Failed to fetch data", error);
  //     }
  //   }

  //   loadData();
  // }, []);
    useEffect(() => {
    const loadData = async () => {
      try {
        const fetchedData = await fetchData();
        if (fetchedData) {
          setData(fetchedData);
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
  }, []);

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
  /*
  setSalesTableData({
      options: {
        chart: {
          type: 'line'
        },
        series: [{
          name: 'Sales',
          data: [[ 1672552800000, 10 ], [ 1672639200000, 18 ], [ 1672725600000, 22 ],  [ 1672812000000, 41 ], [ 1672898400000, 63 ], [ 1672984800000, 41 ],  [ 1673071200000, 35 ], [ 1673157600000, 10 ], [ 1673244000000, 12 ], [ 1673330400000, 32 ], [ 1673416800000, 37 ]]
          // data: [30, 40, 35, 50, 49, 60, 70, 91, 125]
        }],
        xaxis: {
          x: new Date('01 Jan 2023').getTime(),// ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
          type: 'datetime',
          min: new Date('01 Jan 2023').getTime()
        },
        dataLabels: {
            enabled: false
        },
      }
    });
    */
    // Create and render the chart
    

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
    // Update statistics when a new option is selected
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
            <div>Sales Report Statistics</div>
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
