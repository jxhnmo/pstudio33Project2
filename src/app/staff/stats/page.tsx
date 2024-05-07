"use client";

import Link from 'next/link';
import styles from "@/app/staff/stats/staffStats.module.css";
import dynamic from 'next/dynamic';
import { ClipLoader } from 'react-spinners';
import { useEffect, useState } from 'react';


import { fetchData, fetchIngredientsUsedToday, fetchXData, fetchZData, setSalesTransactionValid, fetchExcessData, fetchSalesData } from '../../analytics';
import { integrations_v1alpha } from 'googleapis';

const Sidebar = dynamic(() => import('../../../components/sidebar/Sidebar'), {
  ssr: false
});

interface ExcessData {
  id: number;
  item_name: string;
  stock: number;
  sold_stock: number;
  sold_percentage: string;
}

interface SalesTransaction {
  id: number;
  takeout: boolean;
  cost: number;
  purchase_time: string;
  name: string;
  shift_start: string;
  shift_end: string;
  items: string[];
  valid: boolean;
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
  item_name: string;
  stock: number;
  max_stock: number;
  price: number;
}

interface ProductUsage {
  item_name: string;
  count: number;
}

interface SalesFreq {
  menu_id: number;
  item_name: string;
  category: string;
  num_sales: number;
}


export default function StaffStats() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [firstSale, setFirstSale] = useState<Date>(new Date());
  const [lastSale, setLastSale] = useState<Date>(new Date());
  const [lastRestock, setLastRestock] = useState<string | null>(null);
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');
  const [salesTableData, setSalesTableData] = useState([]);
  const [excessTableData, setExcessTableData] = useState([]);
  const [restockTableData, setRestockTableData] = useState([]);
  const [pairSalesTableData, setPairSalesTableData] = useState([]);
  const [selectedOption, setSelectedOption] = useState('product_usage');

  const [salesData, setSalesData] = useState<SalesFreq[]>([]);
  const [productUsageData, setProductUsageData] = useState<ProductUsage[]>([]);

  const [xData, setXData] = useState<SalesTransaction[]>([]);
  const [zData, setZData] = useState<SalesTransaction[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [salesStartDate, setSalesStart] = useState<Date>(new Date('Jan 01 2023'));
  const [salesEndDate, setSalesEnd] = useState<Date>(new Date('Dec 31 2023'));
  const [isLoading, setIsLoading] = useState(false);

  const [excessData, setExcessData] = useState<ExcessData[]>([]);

  const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(event.target.value);
  };
  
  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(event.target.value);
  };

  const handleSalesStartChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
    setSalesStart(new Date(event.target.value));
  };

  const handleSalesEndChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSalesEnd(new Date(event.target.value));
  };

  const handleDelete = async (id: number) => {
    setIsLoading(true);
    await setSalesTransactionValid(id);
    // Refetch the data after updating
    if (selectedOption === 'x_report') {
        fetchXData().then(data => {
            setXData(data);
            setIsLoading(false);
        }).catch(error => {
            console.error("Failed to fetch sales data after update", error);
            setIsLoading(false);
        });
    } else if (selectedOption === 'z_report') {
        // Assuming you might want to do this in Z-Report as well
        fetchZData(startDate, endDate).then(data => {
            setZData(data);
            setIsLoading(false);
        }).catch(error => {
            console.error("Failed to fetch sales data after update", error);
            setIsLoading(false);
        });
    }
  };

  // Excess data effect
  useEffect(() => {
    const loadExcessData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchExcessData(startDate);
        setExcessData(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch excess data", error);
        setIsLoading(false);
      }
    };

    if (selectedOption === 'excess_report') {
      loadExcessData();
    }
  }, [selectedOption, startDate]);

  // X report data effect
  useEffect(() => {
    const loadXData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchXData();
        console.log(data);
        setXData(data);
        setIsLoading(false);
      }
      catch (error) {
        console.error("Failed to fetch sales data", error);
        setIsLoading(false);
      }
    };

    if (selectedOption === 'x_report') {
      loadXData();
    }
  }, [selectedOption]);

  // Z report data effect
  useEffect(() => {
    const loadZData = async () => {
        if (!startDate || !endDate || startDate > endDate) {
            return;
        }
        setIsLoading(true); // Set loading to true when fetch begins
        try {
            const data = await fetchZData(startDate, endDate);
            setZData(data);
            setIsLoading(false); // Set loading to false when fetch completes
        } catch (error) {
            console.error("Failed to fetch sales data", error);
            setIsLoading(false); // Ensure loading is turned off if there's an error
        }
    };

    if (selectedOption === 'z_report') {
        loadZData();
    }
}, [selectedOption, startDate, endDate]);

  useEffect(() => {
    const loadSalesData = async () => {
      if (!salesStartDate || !salesEndDate || salesStartDate.getTime() > salesEndDate.getTime() || 
      salesStartDate.getTime() > lastSale.getTime() || salesEndDate.getTime() < firstSale.getTime()) {
        return;
      }
      try {
        const sales_data = await fetchSalesData(salesStartDate, salesEndDate);
        setSalesData(sales_data);
      } catch (err) {
        console.error('Failed to fetch sales data', err);
      }
    };

    if (selectedOption === 'sales_report') {
      loadSalesData();
    }
  }, [selectedOption, salesStartDate,salesEndDate, firstSale, lastSale]);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchedData = await fetchData();
        if (fetchedData) {
          setMenuItems(fetchedData.menuItems);
          setInventory(fetchedData.inventory);
          setFirstSale(new Date(fetchedData.firstSale));
          setLastSale(new Date(fetchedData.lastSale));
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

  useEffect(() => {
    const fetchProductUsage = async () => {
      try {
        const usageData = await fetchIngredientsUsedToday();
        setProductUsageData(usageData);
      } catch (error) {
        console.error("Failed to fetch product usage data", error);
      }
    };
  
    if (selectedOption === 'product_usage') {
      fetchProductUsage();
    }
  }, [selectedOption]); 

  const updateStatistics = () => {
    if (selectedOption === 'product_usage') {
      // Update product usage statistics
      // Implement your logic here
    } else if (selectedOption === 'restock_report') {
      // Update restock report statistics
      // Implement your logic here
    } else if (selectedOption === 'excess_report') {
      // Update excess report statistics
      // Implement your logic here
    }
  }

  const handleButtonSelect = (option: any) => {
    setSelectedOption(option);
    updateStatistics();
  }

  const sortedExcessData = excessData.sort((a, b) => {
    const percentageA = parseFloat(a.sold_percentage.replace('%', ''));
    const percentageB = parseFloat(b.sold_percentage.replace('%', ''));
    return percentageA - percentageB; // Descending order
  });

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
              className={selectedOption === 'x_report' ? styles.selectedOption : styles.option}
              onClick={() => handleButtonSelect('x_report')}
            >
              X-Report
            </button>
            <button
              className={selectedOption === 'z_report' ? styles.selectedOption : styles.option}
              onClick={() => handleButtonSelect('z_report')}
            >
              Z-Report
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
          </div>
        </div>

        <div className={styles.statsContent}>
          {/* Display statistics based on selected option */}
          {selectedOption === 'product_usage' && (
            <div>
              <h2>Product Usage Statistics</h2>
              <div className={styles.xreportTableContainer}>
                <table className={styles.xreportTable}>
                  <thead>
                    <tr>
                      <th>Inventory Item</th>
                      <th>Amount Used Today</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productUsageData.length > 0 ? (
                      productUsageData.map((item, index) => (
                        <tr key={index}>
                          <td>{item.item_name}</td>
                          <td>{item.count}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={2}>No product usage data available for today.</td>
                      </tr>
                    )}

                  </tbody>
                </table>
              </div>
            </div>
          )}

          {selectedOption === 'x_report' && (
            <div>
              <h2>X-Report</h2>
              {isLoading ? (
                <ClipLoader loading={isLoading} size={150} />
              ) : (
              <div className={styles.xreportTableContainer}>
                <table className={styles.xreportTable}>
                  <thead>
                    <tr>
                      <th>Transaction ID</th>
                      <th>Items Ordered</th>
                      <th>Takeout/Dine-In</th>  {/* New column */}
                      <th>Cost</th>
                      <th>Time</th>
                      <th>Date</th>
                      <th>Employee</th>
                      <th>Shift Start</th>
                      <th>Shift End</th>
                      <th>Delete Order</th>
                    </tr>
                  </thead>
                  <tbody>
                    {xData && xData.length > 0 ? (
                      xData.map((order: SalesTransaction, index: number) => (
                        <tr key={index} className={order.valid ? "" : styles.invalidRow}>
                          <td>{order.id}</td>
                          <td>
                            {order.items.map((item, idx) => (
                              <div key={idx}>{item}</div> // Each item is a string formatted as "2x Burger"
                            ))}
                          </td>
                          <td>{order.takeout ? 'Takeout' : 'Dine-In'}</td>  {/* New display logic */}
                          <td>{Number(order.cost).toFixed(2)}</td>
                          <td>{new Date(order.purchase_time).toLocaleTimeString()}</td>
                          <td>{new Date(order.purchase_time).toLocaleDateString()}</td>
                          <td>{order.name}</td>
                          <td>{order.shift_start}</td>
                          <td>{order.shift_end}</td>
                          <td className="centered-cell">
                          <button onClick={() => handleDelete(order.id)} className={styles.deleteButton}>
                              {order.valid ? "Delete" : "Add"}
                          </button>
                          </td>
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
              )}
            </div>
          )}

          {selectedOption === 'z_report' && (
          <div>
            <h2>Z-Report</h2>
            <div>
              <label>Start Date:</label>
              <input type="date" id="startDate" onChange={handleStartDateChange} />
              <label>End Date:</label>
              <input type="date" id="endDate" onChange={handleEndDateChange} />
            </div>
            {isLoading ? (
                <ClipLoader loading={isLoading} size={150} />
            ) : (
            <div className={styles.xreportTableContainer}>
              <table className={styles.xreportTable}>
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>Items Ordered</th>
                    <th>Cost</th>
                    <th>Time</th>
                    <th>Date</th>
                    <th>Employee</th>
                    <th>Shift Start</th>
                    <th>Shift End</th>
                    <th>Delete Order</th>
                  </tr>
                </thead>
                <tbody>
                  {zData && zData.length > 0 ? (
                    zData.map((order: SalesTransaction, index: number) => (
                      <tr key={index} className={order.valid ? "" : styles.invalidRow}>
                        <td>{order.id}</td>
                        <td>
                          {order.items.map((item, idx) => (
                            <div key={idx}>{item}</div>
                          ))}
                        </td>
                        <td>{Number(order.cost).toFixed(2)}</td>
                        <td>{new Date(order.purchase_time).toLocaleTimeString()}</td>
                        <td>{new Date(order.purchase_time).toLocaleDateString()}</td>
                        <td>{order.name}</td>
                        <td>{order.shift_start}</td>
                        <td>{order.shift_end}</td>
                        <td className="centered-cell">
                        <button onClick={() => handleDelete(order.id)} className={styles.deleteButton}>
                            {order.valid ? "Delete" : "Add"}
                        </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9}>No sales data available for selected dates.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            )}
          </div>
          )}
          
          {selectedOption === 'sales_report' && (
            <div>
                <h2>Sales Report Statistics</h2>
                <div>
                  <label>Start Date:</label>
                  <input type="date" id="startSalesDate" onChange={handleSalesStartChange} />
                  <label>End Date:</label>
                  <input type="date" id="endSalesDate" onChange={handleSalesEndChange} />
                </div>
                <div className={styles.tableContainer}>
                  <table className={styles.restockTable}>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Item Name</th>
                        <th>Category</th>
                        <th>Num Sales</th>
                      </tr>
                    </thead>
                    <tbody>
                      {salesData.map((item: SalesFreq, index: number) => (
                        <tr key={item.menu_id}>
                          <td>{item.menu_id}</td>
                          <td>{item.item_name}</td>
                          <td>{item.category}</td>
                          <td>{item.num_sales}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
            </div>
          )}

          {selectedOption === 'restock_report' && (
            // Implement UI for restock report statistics
            <div>
                <h2>Restock Report Statistics</h2>
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
                          <td>{item.item_name}</td>
                          <td>{item.stock}</td>
                          <td>{item.max_stock}</td>
                          <td>{item.max_stock-item.stock}</td>
                          <td>{Number(item.price).toFixed(2)}</td>
                          <td>{(Number(item.max_stock-item.stock)*item.price).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
            </div>
          )}

          {selectedOption === 'excess_report' && (
            <div>
              <h2>Excess Report</h2>
              <div>
                <p className={styles.description}>
                Given a timestamp, display the list of items that only sold less than 
                10% of their inventory between the timestamp and the current time, assuming 
                no restocks have happened during the window.
                </p>
                <p className={styles.description}>
                Items in <strong>bold</strong> have sold 10% or less of their stock.
                </p>
                <label>Start Date:</label>
                <input type="date" id="startDate" onChange={handleStartDateChange} />
              </div>
              {isLoading ? (
                <ClipLoader loading={isLoading} size={150} />
              ) : (
                <div className={styles.excessTableContainer}>
                  <table className={styles.xreportTable}>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Item Name</th>
                        <th>Stock</th>
                        <th>Sold Stock</th>
                        <th>Sold Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedExcessData.map((item) => {
                        const isBold = parseFloat(item.sold_percentage.replace('%', '')) <= 10;
                        return (
                          <tr key={item.id} className={isBold ? styles.boldRow : ''}>
                            <td>{item.id}</td>
                            <td>{item.item_name}</td>
                            <td>{item.stock}</td>
                            <td>{item.sold_stock}</td>
                            <td>{item.sold_percentage}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

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
          <Link href="/staff/users" legacyBehavior>
            <a className={styles.navButton}>Users</a>
          </Link>
        </div>
      </div>
    </>
  );
}