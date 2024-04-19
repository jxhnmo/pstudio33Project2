import psycopg2
import os
from dotenv import load_dotenv
from datetime import datetime, timedelta
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

def create_employee(conn):
    with conn.cursor() as cur:
        insert_employee = """
            INSERT INTO employees (name, salary, shift_start, shift_end, manager, username, password)
            VALUES (%s, %s, '08:00', '16:00', %s, %s, 'password') RETURNING id;
        """
        employee_name = f"Employee_{random.randint(1000, 9999)}"
        salary = random.randint(30000, 60000)
        manager = random.choice([True, False])
        username = employee_name.lower()
        cur.execute(insert_employee, (employee_name, salary, manager, username))
        employee_id = cur.fetchone()[0]
        conn.commit()
        return employee_id


def create_sales_transaction(conn, employee_id):
    with conn.cursor() as cur:
        insert_transaction = """
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
    try:
        conn = psycopg2.connect(**conn_params)
        print("Connected to the database.")

        for _ in range(10):
            employee_id = create_employee(conn)
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
