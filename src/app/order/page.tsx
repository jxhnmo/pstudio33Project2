import Image from "next/image";
import styles from "@/app/order/order.module.css";

export default function Home() {
  return (
    <div className={styles.main}>
      {/* Categories Column */}
      <div className={styles.categories}>
        <h2 className={styles.categoriesHeader}>Categories</h2>
        <div className={styles.categoriesList}>
          {['Category 1', 'Category 2', 'Category 3'].map((category) => (
            <button key={category} className={styles.categoryButton}>
              {category}
            </button>
          ))}
        </div>
      </div>
      {/* Order Menu */}
      <div className={styles.orderMenu}>
        {Array.from({ length: 16 }).map((_, index) => (
          <button key={index}>Menu Item {index + 1}</button>
        ))}
      </div>
      {/* Current Order Column */}
      <div className={styles.currentOrder}>
        <h2 className={styles.currentOrderTitle}>Current Order</h2>
        <div className={styles.orderList}>
          {/* Dynamic list of order items would go here */}
          <div>Item 1 - $2.99</div>
          <div>Item 2 - $1.99</div>
          {/* ... more items ... */}
        </div>
        <textarea
          className={styles.currentOrderTextarea}
          disabled
          value="Order Details"
        />
        <div className={styles.total}>
          Total: $<span>4.98</span> {/* This would be calculated */}
        </div>
        <button className={styles.confirmOrderButton}>Confirm Order</button>
      </div>
    </div>
  );
}
