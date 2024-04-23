import psycopg2
from psycopg2 import sql
from faker import Faker
import psycopg2
import os
from dotenv import load_dotenv
from datetime import datetime, timedelta
import random
import sys

faker = Faker()
dotenv_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env.local')
load_dotenv(dotenv_path=dotenv_path)



"""
-------------------------------
    DEFINE HARD CODED DATA
-------------------------------
"""

conn_params = {
    "database": os.getenv("DATABASE_NAME"),
    "user": os.getenv("DATABASE_USER"),
    "password": os.getenv("DATABASE_PASSWORD"),
    "host": os.getenv("DATABASE_HOST"),
    "port": "5432"
}

menu_items = {
    "Bacon Cheeseburger": ["Buns", "patty", "cheese", "bacon", "tray", "napkin"],
    "Cheeseburger": ["Buns", "patty", "cheese", "tray", "napkin"],
    "Patty Melt": ["bread", "patty", "cheese", "tray", "napkin"],
    "Hamburger": ["Buns", "patty", "Lettuce", "tomato", "tray", "napkin"],
    "Aggie Chicken Club": ["Buns", "crispy chicken", "Lettuce", "bacon", "tray", "napkin"],
    "Revs Grilled Chicken Sandwich": ["Buns", "grilled chicken", "Lettuce", "tomato", "tray", "napkin"],
    "Spicy Chicken Sandwich": ["Buns", "spicy crispy chicken", "Lettuce", "tray", "napkin"],
    "Chicken Caesar Salad": ["grilled chicken", "Lettuce", "Lettuce", "Lettuce", "croutons", "salad bowl", "napkin"],
    "French Fries": ["fries", "tray", "napkin"],
    "Small Drink": ["small cup", "cup lid", "straw"],
    "Large Drink": ["large cup", "cup lid", "straw"],
    "Cookies": ["cookie", "cookie", "tray", "napkin"],
    "Chicken Tenders": ["chicken tender", "tray", "napkin"],
    "Corn Dogs": ["corn dog", "corn dog", "tray", "napkin"],
    "Hot Dogs": ["hot dog bun", "hot dog bun", "wiener", "wiener", "tray", "napkin"],
    "Chicken Wrap": ["tortilla", "grilled chicken", "salsa", "Lettuce", "tray", "napkin"],
    "Double Scoop Ice Cream": ["ice cream", "ice cream", "ice cream bowl"],
    "Aggie Shake": ["ice cream", "whipped cream", "shake cup", "straw"],
    "Cookie Ice Cream Melt": ["cookie", "cookie", "ice cream", "tray", "napkin"],
    "Yell BBQ Rib Sandwich": ["ribs", "onions", "pickles", "tray", "napkin"],
    "BLT Burger": ["Buns", "patty", "bacon", "Lettuce", "tomato", "tray", "napkin"],
    "Double Cheeseburger": ["Buns", "patty", "patty", "cheese", "tray", "napkin"]
}



"""
-------------------------------
    RESET DATABASE TABLES
-------------------------------
"""
def reset_database_tables(conn):
    cur = conn.cursor()

    commands = """
    DROP TABLE IF EXISTS employees CASCADE;
    DROP TABLE IF EXISTS inventory_items CASCADE;
    DROP TABLE IF EXISTS menu_items CASCADE;
    DROP TABLE IF EXISTS ingredients CASCADE;
    DROP TABLE IF EXISTS inventory_transactions CASCADE;
    DROP TABLE IF EXISTS inventory_item_orders CASCADE;
    DROP TABLE IF EXISTS sales_transactions CASCADE;
    DROP TABLE IF EXISTS sales_items CASCADE;
    DROP TABLE IF EXISTS irremovable_ingredients CASCADE;

    CREATE TABLE employees (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50),
        salary NUMERIC,
        shift_start TIME,
        shift_end TIME,
        manager BOOLEAN,
        username VARCHAR(50),
        password VARCHAR(50)
    );
    CREATE TABLE inventory_items (
        id SERIAL PRIMARY KEY,
        item_name VARCHAR(50),
        stock INT,
        price NUMERIC,
        max_stock INT
    );
    CREATE TABLE irremovable_ingredients (
        name VARCHAR(50) PRIMARY KEY
    );
    CREATE TABLE menu_items (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50),
        available BOOLEAN,
        price NUMERIC,
        category VARCHAR(50),
        description TEXT,
        calories INT
    );
    CREATE TABLE ingredients (
        id SERIAL PRIMARY KEY,
        item_id INT,
        menu_id INT,
        num INT,
        FOREIGN KEY (item_id) REFERENCES inventory_items(id),
        FOREIGN KEY (menu_id) REFERENCES menu_items(id)
    );
    CREATE TABLE inventory_transactions (
        id SERIAL PRIMARY KEY,
        manager_id INT,
        transaction_date TIMESTAMP,
        price NUMERIC
    );
    CREATE TABLE inventory_item_orders (
        id SERIAL PRIMARY KEY,
        transaction_id INT,
        item_id INT,
        stock INT,
        price NUMERIC,
        FOREIGN KEY (transaction_id) REFERENCES inventory_transactions(id),
        FOREIGN KEY (item_id) REFERENCES inventory_items(id)
    );
    CREATE TABLE sales_transactions (
        id SERIAL PRIMARY KEY,
        cost NUMERIC,
        employee_id INT,
        purchase_time TIMESTAMP,
        FOREIGN KEY (employee_id) REFERENCES employees(id)
    );
    CREATE TABLE sales_items (
        id SERIAL PRIMARY KEY,
        sales_id INT,
        menu_id INT,
        FOREIGN KEY (sales_id) REFERENCES sales_transactions(id),
        FOREIGN KEY (menu_id) REFERENCES menu_items(id)
    );
    """
    commands_list = commands.strip().split(';')
    for command in commands_list:
        if command.strip():  # Ensure the command is not just whitespace
            cur.execute(command + ';')  # Add back the semicolon for complete SQL statement

    conn.commit()
    print("Database tables reset successfully.")



"""
-------------------------------
    POPULATE TABLES
-------------------------------
"""

def populate_employees(conn):
    employees = [
        (1, 'Chee Surger', 31.5, '9:30:00', '23:30:00', True, 'burger_man', '0'),
        (2, 'Chic Ken', 14.5, '10:00:00', '23:30:00', False, 'chickman', 'password'),
        (3, 'Tenz Ders', 11.5, '10:00:00', '23:30:00', False, 'user1', 'pw1'),
        (4, 'Man Ger', 10.0, '10:00:00', '23:30:00', False, 'zero', 'zero'),
        (5, 'Han Surger', 12.0, '10:00:00', '23:30:00', False, 'ilovekids', 'password'),
        (6, 'Ethan Van', 10.0, '10:00:00', '23:30:00', True, 'zero', 'pw'),
        (7, 'John Mo', 10.0, '10:00:00', '23:30:00', False, 'zero', 'pw'),
        (8, 'Grant Oxford', 10.0, '10:00:00', '23:30:00', False, 'zero', 'pw'),
        (9, 'Thomas Bolf', 10.0, '10:00:00', '23:30:00', False, 'zero', 'pw'),
        (10, 'Jeffrey Cheung', 10.0, '10:00:00', '23:30:00', False, 'zero', 'pw'),
        (11, 'Joseph Chau', 10.0, '10:00:00', '23:30:00', False, 'zero', 'pw')
    ]
    with conn.cursor() as cur:
        cur.executemany(sql.SQL("""
            INSERT INTO employees (id, name, salary, shift_start, shift_end, manager, username, password)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """), employees)
        conn.commit()
        print("Employees data populated successfully.")

def populate_inventory_items(conn):
    inventory_items = [
        (1, "Buns", 3200, 0.30, 3200),
        (2, "Lettuce", 3600, 0.25, 3600),
        (3, "patty", 2800, 1.50, 2800),
        (4, "cheese", 1600, 0.40, 1600),
        (5, "bacon", 1200, 0.50, 1200),
        (6, "bread", 400, 0.20, 400),
        (7, "tomato", 1200, 0.40, 1200),
        (8, "crispy chicken", 400, 0.75, 400),
        (9, "spicy crispy chicken", 400, 0.85, 400),
        (10, "grilled chicken", 1200, 0.75, 1200),
        (11, "croutons", 400, 0.10, 400),
        (12, "fries", 400, 1.20, 400),
        (13, "small cup", 400, 0.05, 400),
        (14, "large cup", 400, 0.08, 400),
        (15, "cookie", 1600, 0.25, 1600),
        (16, "chicken tender", 400, 0.80, 400),
        (17, "corn dog", 800, 1.10, 800),
        (18, "hot dog bun", 800, 0.25, 800),
        (19, "hot dog bun", 800, 0.25, 800),
        (20, "wiener", 800, 0.75, 800),
        (21, "tortilla", 400, 0.10, 400),
        (22, "salsa", 400, 0.05, 400),
        (23, "ice cream", 1600, 0.75, 1600),
        (24, "whipped cream", 400, 0.25, 400),
        (25, "ribs", 400, 1.50, 400),
        (26, "pickles", 400, 0.20, 400),
        (27, "onions", 400, 0.20, 400),
        (28, "napkin", 7200, 0.02, 7200),
        (29, "cup lid", 800, 0.10, 800),
        (30, "straw", 1200, 0.05, 1200),
        (31, "tray", 6800, 0.05, 6800),
        (32, "ice cream bowl", 400, 0.20, 400),
        (33, "shake cup", 400, 0.23, 400),
        (34, "salad bowl", 400, 0.18, 400)
    ]
    with conn.cursor() as cur:
        cur.executemany(sql.SQL("""
            INSERT INTO inventory_items (id, item_name, stock, price, max_stock)
            VALUES (%s, %s, %s, %s, %s)
        """), inventory_items)
        conn.commit()
        print("Inventory items data populated successfully.")

def populate_irremovable_ingredients(conn):
    irremovable_ingredients = [
        ("straw",),
        ("small cup",),
        ("large cup",),
        ("ice cream bowl",),
        ("tray",),
        ("cup lid",),
        ("shake cup",),
        ("napkin",)
    ]
    with conn.cursor() as cur:
        cur.executemany(sql.SQL("""
            INSERT INTO irremovable_ingredients (name)
            VALUES (%s)
        """), irremovable_ingredients)
        conn.commit()
        print("Irremovable ingredients data populated successfully.")

def populate_menu_items(conn):
    with conn.cursor() as cur:
        menu_id = 1
        for name, components in menu_items.items():
            price = round(random.uniform(5.0, 20.0), 2)  # Random price between $5 and $20
            category = random.choice(['Main Course', 'Side', 'Drink', 'Dessert'])  # Random category
            description = faker.sentence()  # Generate a fake description
            calories = random.randint(100, 1000)  # Random calories between 100 and 1000
            available = True  # Assume all items are available

            cur.execute("""
                INSERT INTO menu_items (id, name, available, price, category, description, calories)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (menu_id, name, available, price, category, description, calories))
            menu_id += 1
        conn.commit()
        print("Menu items data populated successfully.")

def populate_ingredients(conn):
    ingredients = [("Buns",), ("Lettuce",), ("patty",), ("cheese",), ("bacon",), ("bread",), ("tomato",), ("crispy chicken",), ("spicy crispy chicken",), ("grilled chicken",), ("croutons",), ("fries",), ("small cup",), ("large cup",), ("cookie",), ("chicken tender",), ("corn dog",), ("hot dog bun",), ("wiener",), ("tortilla",), ("salsa",), ("ice cream",), ("whipped cream",), ("ribs",), ("pickles",), ("onions",), ("napkin",), ("cup lid",), ("straw",), ("tray",), ("ice cream bowl",), ("shake cup",), ("salad bowl",)]
    with conn.cursor() as cur:
        cur.executemany(sql.SQL("""
            INSERT INTO ingredients (name)
            VALUES (%s)
        """), ingredients)
        conn.commit()
        print("Ingredients data populated successfully.")

def populate_inventory_transactions(conn):
    faker = Faker()
    with conn.cursor() as cur:
        # Fetch manager IDs from employees table
        cur.execute("SELECT id FROM employees WHERE manager = TRUE;")
        manager_ids = [row[0] for row in cur.fetchall()]

        # Fetch item IDs from inventory_items table
        cur.execute("SELECT id, max_stock FROM inventory_items;")
        item_data = [(row[0], row[1]) for row in cur.fetchall()]

        # Generate transactions for the past 5 years
        start_date = datetime.now() - timedelta(days=5 * 365)
        end_date = datetime.now()
        delta = timedelta(days=1)

        transaction_id = 1
        while start_date < end_date:
            # Choose a random manager
            manager_id = random.choice(manager_ids)

            # Generate transaction date
            transaction_date = start_date + timedelta(days=random.randint(1, 7))

            # Generate a random transaction
            num_items = random.randint(1, 5)  # Number of different items to order
            total_price = 0

            # Prepare a batch of order insertions
            order_values = []
            for _ in range(num_items):
                item_id, max_stock = random.choice(item_data)
                quantity = random.randint(1, 20)  # Logical amount to order
                price_per_unit = faker.random_number(digits=2) / 100.0
                total_price += price_per_unit * quantity
                order_values.append((transaction_id, item_id, quantity, price_per_unit))

            # Insert transaction record
            cur.execute(sql.SQL("""
                INSERT INTO inventory_transactions (id, manager_id, transaction_date, price)
                VALUES (%s, %s, %s, %s)
            """), (transaction_id, manager_id, transaction_date, total_price))

            # Insert corresponding item orders
            cur.executemany(sql.SQL("""
                INSERT INTO inventory_item_orders (transaction_id, item_id, stock, price)
                VALUES (%s, %s, %s, %s)
            """), order_values)

            transaction_id += 1
            start_date = transaction_date  # Move to the next transaction date

        conn.commit()
        print("Inventory transactions and item orders populated successfully.")

def populate_sales_transactions(conn):
    faker = Faker()
    with conn.cursor() as cur:
        # Fetch employee IDs from employees table
        cur.execute("SELECT id FROM employees;")
        employee_ids = [row[0] for row in cur.fetchall()]

        # Fetch menu item IDs from menu_items table
        cur.execute("SELECT id FROM menu_items;")
        menu_item_ids = [row[0] for row in cur.fetchall()]

        # Generate transactions for the past 5 years
        start_date = datetime.now() - timedelta(days=5 * 365)
        end_date = datetime.now()
        transaction_date = start_date

        transaction_id = 1
        while transaction_date < end_date:
            # Choose a random employee
            employee_id = random.choice(employee_ids)

            # Generate transaction date
            transaction_date += timedelta(days=random.randint(1, 7))

            # Determine number of items bought (at least one)
            num_items = random.randint(1, 5)
            total_cost = 0

            # Prepare a batch of item insertions
            item_values = []
            for _ in range(num_items):
                menu_id = random.choice(menu_item_ids)
                item_price = faker.random_int(min=1, max=20)  # Simulating a cost per item
                total_cost += item_price
                item_values.append((transaction_id, menu_id))

            # Insert transaction record
            cur.execute(sql.SQL("""
                INSERT INTO sales_transactions (id, cost, employee_id, purchase_time)
                VALUES (%s, %s, %s, %s)
            """), (transaction_id, total_cost, employee_id, transaction_date))

            # Insert corresponding sales items
            cur.executemany(sql.SQL("""
                INSERT INTO sales_items (sales_id, menu_id)
                VALUES (%s, %s)
            """), item_values)

            transaction_id += 1

        conn.commit()
        print("Sales transactions and items populated successfully.")

"""
-------------------------------
    CONNECT TO DATABASE
-------------------------------
"""

def create_connection(params):
    """ Create a database connection """
    conn = None
    try:
        print('Connecting to the PostgreSQL database...')
        conn = psycopg2.connect(**params)
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
        sys.exit(1) 
    print("Connection successful")
    return conn



"""
-------------------------------
    SEED DATABASE
-------------------------------
"""

def main():   
    conn = create_connection(conn_params)
    try:
        reset_database_tables(conn)
        populate_employees(conn)
        populate_inventory_items(conn)
        populate_irremovable_ingredients(conn)
        populate_menu_items(conn)
        populate_ingredients(conn)
        populate_inventory_transactions(conn)
        populate_sales_transactions(conn)
    except (Exception, psycopg2.DatabaseError) as error:
        print(f"An error occurred: {error}")
        conn.rollback()
    finally:
        if conn is not None:
            conn.close()
            print("Database connection closed.")

if __name__ == '__main__':
    main()

