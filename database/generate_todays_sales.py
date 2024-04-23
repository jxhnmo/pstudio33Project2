import psycopg2
import os
from dotenv import load_dotenv
from datetime import datetime
import random

# Specify the path to your .env.local file
dotenv_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env.local')
load_dotenv(dotenv_path=dotenv_path)

# Database connection parameters
conn_params = {
    "database": os.getenv("DATABASE_NAME"),
    "user": os.getenv("DATABASE_USER"),
    "password": os.getenv("DATABASE_PASSWORD"),
    "host": os.getenv("DATABASE_HOST"),
    "port": "5432"
}
print('here')
def fetch_employee_ids(conn):
    with conn.cursor() as cur:
        cur.execute("SELECT id FROM employees")
        employee_ids = [row[0] for row in cur.fetchall()]
        return employee_ids

def create_sales_transaction(conn, employee_id):
    with conn.cursor() as cur:
        insert_transaction = """
            SELECT setval('sales_transactions_id_seq', (SELECT MAX(id) FROM sales_transactions));
            INSERT INTO sales_transactions (cost, employee_id, purchase_time)
            VALUES (%s, %s, %s) RETURNING id;
        """

        cost = random.uniform(5.0, 200.0)
        purchase_time = datetime.now()
        cur.execute(insert_transaction, (cost, employee_id, purchase_time))
        transaction_id = cur.fetchone()[0]
        conn.commit()
        return transaction_id

def main():
    conn = None
    try:
        conn = psycopg2.connect(**conn_params)
        print("Connected to the database.")

        employee_ids = fetch_employee_ids(conn)
        for employee_id in employee_ids:
            transaction_id = create_sales_transaction(conn, employee_id)
            print(f"Created transaction {transaction_id} for employee {employee_id}")

    except Exception as e:
        print("An error occurred:", e)
    finally:
        if conn:
            conn.close()
            print("Database connection closed.")

if __name__ == "__main__":
    main()
