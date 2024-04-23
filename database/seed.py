import psycopg2
from psycopg2 import sql
from faker import Faker
import psycopg2
import os
from dotenv import load_dotenv
from datetime import datetime
import random
import sys

fake = Faker()
dotenv_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env.local')
load_dotenv(dotenv_path=dotenv_path)

# Hard-coded data
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

conn_params = {
    "database": os.getenv("DATABASE_NAME"),
    "user": os.getenv("DATABASE_USER"),
    "password": os.getenv("DATABASE_PASSWORD"),
    "host": os.getenv("DATABASE_HOST"),
    "port": "5432"
} 

" " " 

" " "
def populate_employees(conn):
    """ Populate the employees table with hardcoded data """
    employees = [
        (1, 'Chee Surger', 31.5, '9:30:00', '23:30:00', True, 'burger_man', '0'),
        (2, 'Chic Ken', 14.5, '10:00:00', '23:30:00', False, 'chickman', 'password'),
        (3, 'Tenz Ders', 11.5, '10:00:00', '23:30:00', False, 'user1', 'pw1'),
        (4, 'Man Ger', 10.0, '10:00:00', '23:30:00', False, 'zero', 'zero'),
        (5, 'Han Surger', 12.0, '10:00:00', '23:30:00', False, 'ilovekids', 'password')
    ]
    with conn.cursor() as cur:
        cur.executemany(sql.SQL("""
            INSERT INTO employees (id, name, salary, shift_start, shift_end, manager, username, password)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """), employees)
        conn.commit()
        print("Employees data populated successfully.")

def populate_menu_items(conn):
    """ Populate the menu_items table from the dictionary """
    with conn.cursor() as cur:
        menu_id = 1
        for name, components in menu_items.items():
            price = round(random.uniform(5.0, 20.0), 2)  # Random price between $5 and $20
            category = random.choice(['Main Course', 'Side', 'Drink', 'Dessert'])  # Random category
            description = fake.sentence()  # Generate a fake description
            calories = random.randint(100, 1000)  # Random calories between 100 and 1000
            available = True  # Assume all items are available

            cur.execute("""
                INSERT INTO menu_items (id, name, available, price, category, description, calories)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (menu_id, name, available, price, category, description, calories))
            menu_id += 1
        conn.commit()
        print("Menu items data populated successfully.")


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

def main():
    # Database connection parameters
    conn_params = {
        "dbname": "your_database_name",
        "user": "your_database_user",
        "password": "your_database_password",
        "host": "localhost",
        "port": 5432
    }
    
    conn = create_connection(conn_params)
    try:
        populate_menu_items(conn)
    except (Exception, psycopg2.DatabaseError) as error:
        print(f"An error occurred: {error}")
        conn.rollback()
    finally:
        if conn is not None:
            conn.close()
            print("Database connection closed.")

if __name__ == '__main__':
    main()

