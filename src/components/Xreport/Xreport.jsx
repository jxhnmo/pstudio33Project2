import React from 'react';
import ReactApexChart from 'react-apexcharts';
import styles from './xreport.module.css';

const Xreport = ({ salesData }) => {
  return (
    <div>
      <h2>X-Report</h2>
      <div className={styles.chartContainer}>
      <div className={styles.inventoryTableContainer}>
              <table className={styles.inventoryTable}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Item Name</th>
                    <th>Max Stock</th>
                    <th>Price</th>
                    <th>Current Stock</th>
                    <th>Order Stock</th>
                    <th>Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((item: Item, index: number) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.item_name}</td>
                      <td>
                        {item.isEditing ? (
                          <input
                            type="number"
                            value={item.max_stock}
                            onChange={(e) => handleEditChange(e, index, 'max_stock')}
                          />
                        ) : (
                          item.max_stock
                        )}
                      </td>
                      <td>
                        {item.isEditing ? (
                          <input
                            type="number"
                            value={item.price}
                            onChange={(e) => handleEditChange(e, index, 'price')}
                          />
                        ) : (
                          `$${item.price}`
                        )}
                      </td>
                      <td>{item.stock}</td>

                      <td>
                        {/* <th>Order More</th> */}
                        <button onClick={() => adjustOrderQuantity(index, -50)}>-</button>
                        <input
                          type="number"
                          value={item.orderQuantity || 0}
                          onChange={(e) => handleOrderQuantityChange(e, index)}
                          style={{ width: "50px" }}
                        />
                        <button onClick={() => adjustOrderQuantity(index, 50)}>+</button>                      </td>

                      <td>
                        <button onClick={() => toggleEdit(index)}>{item.isEditing ? 'Save' : 'Edit'}</button>
                      </td>
                    </tr>
                  ))}

                  {/* New Item Row */}
                  <tr>
                    <td>New</td>
                    <td><input type="text" placeholder="Item Name" value={newItem.item_name || ''} onChange={(e) => setNewItem({ ...newItem, item_name: e.target.value })} /></td>
                    <td><input type="number" placeholder="Max Stock" value={newItem.max_stock || ''} onChange={(e) => setNewItem({ ...newItem, max_stock: parseInt(e.target.value) })} /></td>
                    <td><input type="number" placeholder="Price" value={newItem.price || ''} onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) })} /></td>
                    <td><input type="number" placeholder="Stock" value={newItem.stock || ''} onChange={(e) => setNewItem({ ...newItem, stock: parseInt(e.target.value) })} /></td>
                    <td><button onClick={handleAddNewItem}>Add</button></td>
                  </tr>

                </tbody>
              </table>
            </div>
      </div>
    </div>
  );
};

export default Xreport;
