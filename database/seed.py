import psycopg2
from psycopg2 import sql
from faker import Faker
import psycopg2
import os
from dotenv import load_dotenv
from datetime import datetime, timedelta
import random
import sys
from zoneinfo import ZoneInfo  # Python 3.9 and later

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

employees = [
    (1, 'Chee Surger', 31.5, '9:30:00', '23:30:00', True, 'burger_man', '0'),
    (2, 'Chic Ken', 14.5, '10:00:00', '23:30:00', False, 'chickman', 'password'),
    (3, 'Tenz Ders', 11.5, '10:00:00', '23:30:00', False, 'user1', 'pw1'),
    (4, 'Man Ger', 10.0, '10:00:00', '23:30:00', False, 'zero', 'zero'),
    (5, 'Han Surger', 12.0, '10:00:00', '23:30:00', False, 'ilovekids', 'password'),
    (6, 'Ethan Van', 10.0, '10:00:00', '23:30:00', True, 'zero', 'pw'),
    (7, 'John Mo', 10.0, '10:00:00', '23:30:00', True, 'zero', 'pw'),
    (8, 'Grant Oxford', 10.0, '10:00:00', '23:30:00', True, 'zero', 'pw'),
    (9, 'Thomas Bolf', 10.0, '10:00:00', '23:30:00', False, 'zero', 'pw'),
    (10, 'Jeffrey Cheung', 10.0, '10:00:00', '23:30:00', False, 'zero', 'pw'),
    (11, 'Joseph Chau', 10.0, '10:00:00', '23:30:00', False, 'zero', 'pw')
]

menu_items = {
    "Bacon Cheeseburger":["Buns","patty","cheese","bacon","tray","napkin"],
    "Cheeseburger":["Buns","patty","cheese","tray","napkin"],
    "Patty Melt":["bread","patty","cheese","tray","napkin"],
    "Hamburger":["Buns","patty","Lettuce","tomato","tray","napkin"],
    "Aggie Chicken Club":["Buns","crispy chicken","Lettuce","bacon","tray","napkin"],
    "Revs Grilled Chicken Sandwich":["Buns","grilled chicken","Lettuce","tomato","tray","napkin"],
    "Spicy Chicken Sandwich":["Buns","spicy crispy chicken","Lettuce","tray","napkin"],
    "Chicken Caesar Salad":["grilled chicken","Lettuce","Lettuce","Lettuce","croutons","salad bowl","napkin"],
    "French Fries":["fries","tray","napkin"],
    "Small Drink":["small cup","cup lid","straw"],
    "Large Drink":["large cup","cup lid","straw"],
    "Cookies":["cookie","cookie","tray","napkin"],
    "Chicken Tenders":["chicken tender","tray","napkin"],
    "Corn Dogs":["corn dog","corn dog","tray","napkin"],
    "Hot Dogs":["hot dog bun","hot dog bun","wiener","wiener","tray","napkin"],
    "Chicken Wrap":["tortilla","grilled chicken","salsa","Lettuce","tray","napkin"],
    "Double Scoop Ice Cream":["ice cream","ice cream","ice cream bowl"],
    "Aggie Shake":["ice cream","whipped cream","shake cup","straw"],
    "Cookie Ice Cream Melt":["cookie","cookie","ice cream","tray","napkin"],
    "Yell BBQ Rib Sandwich":["ribs","onions","pickles","tray","napkin"],
    "BLT Burger":["Buns","patty","bacon","Lettuce","tomato","tray","napkin"],
    "Double Cheeseburger":["Buns","patty","patty","cheese","tray","napkin"]
}

menu_item_costs = {
    "Bacon Cheeseburger":8.65,
    "Cheeseburger":7.45,
    "Patty Melt":5.45,
    "Hamburger":8.45,
    "Aggie Chicken Club":6.75,
    "Revs Grilled Chicken Sandwich":6.60,
    "Spicy Chicken Sandwich":6.30,
    "Chicken Caesar Salad":6.80,
    "French Fries":3.50,
    "Small Drink": 1.50,
    "Large Drink": 2.50,
    "Cookies":2.00,
    "Chicken Tenders":5.60,
    "Corn Dogs":4.45,
    "Hot Dogs":5.75,
    "Chicken Wrap":6.45,
    "Double Scoop Ice Cream":4.25,
    "Aggie Shake":4.50,
    "Cookie Ice Cream Melt":5.25,
    "Yell BBQ Rib Sandwich":7.30,
    "BLT Burger":9.25,
    "Double Cheeseburger":8.45
}

menu_item_categories = {
    "Bacon Cheeseburger":"burgers",
    "Cheeseburger":"burgers",
    "Patty Melt":"burgers",
    "Hamburger":"burgers",
    "Aggie Chicken Club":"sandwiches",
    "Revs Grilled Chicken Sandwich":"sandwiches",
    "Spicy Chicken Sandwich":"sandwiches",
    "Chicken Caesar Salad":"entrees",
    "French Fries":"sides",
    "Small Drink": "drinks",
    "Large Drink": "drinks",
    "Cookies":"desserts",
    "Chicken Tenders":"entrees",
    "Corn Dogs":"entrees",
    "Hot Dogs":"entrees",
    "Chicken Wrap":"entrees",
    "Double Scoop Ice Cream":"desserts",
    "Aggie Shake":"desserts",
    "Cookie Ice Cream Melt":"desserts",
    "Yell BBQ Rib Sandwich":"sandwiches",
    "BLT Burger":"burgers",
    "Double Cheeseburger":"burgers"
}

menu_item_descriptions = {
    "Bacon Cheeseburger": "A succulent beef patty topped with crispy bacon strips and melted cheese, served on a soft bun.",
    "Cheeseburger": "Classic grilled beef patty paired with a slice of creamy cheese, tucked in a toasted bun.",
    "Patty Melt": "Grilled beef patty with melted cheese between slices of golden-brown bread.",
    "Hamburger": "Simple yet delicious, this burger comes with a juicy beef patty, fresh lettuce, and ripe tomato.",
    "Aggie Chicken Club": "Crispy chicken, fresh lettuce, and smoky bacon stacked in a toasted bun.",
    "Revs Grilled Chicken Sandwich": "Tender grilled chicken breast with lettuce and tomato, served on a toasted bun.",
    "Spicy Chicken Sandwich": "Spicy fried chicken with crisp lettuce on a toasted bun for those who like it hot.",
    "Chicken Caesar Salad": "Chopped romaine lettuce, grilled chicken, croutons, and Parmesan cheese, all tossed in Caesar dressing.",
    "French Fries": "Golden and crispy on the outside, soft on the inside – the perfect side to any meal.",
    "Small Drink": "Your choice of any soft drink in a small cup.",
    "Large Drink": "Your choice of any soft drink in a large cup, for those extra thirsty moments.",
    "Cookies": "Two freshly baked Cookies, soft in the middle with a slight crunch on the outside.",
    "Chicken Tenders": "Crispy on the outside, juicy on the inside, these Chicken Tenders are a crowd pleaser.",
    "Corn Dogs": "Two classic Corn Dogs, deep-fried to golden perfection.",
    "Hot Dogs": "Twin beef wieners in soft buns, a simple pleasure for any meal.",
    "Chicken Wrap": "Grilled chicken wrapped in a soft tortilla with salsa and lettuce, for a light yet flavorful meal.",
    "Double Scoop Ice Cream": "Two generous scoops of creamy ice cream, choose your favorite flavor.",
    "Aggie Shake": "A thick and creamy shake topped with whipped cream, perfect for dessert or a treat.",
    "Cookie Ice Cream Melt": "Warm Cookies served with a scoop of vanilla ice cream, a heavenly combination.",
    "Yell BBQ Rib Sandwich": "BBQ ribs, caramelized onions, and pickles in a bun, for a tangy and sweet experience.",
    "BLT Burger": "A beef patty with crispy bacon, fresh lettuce, and tomato, a classic favorite.",
    "Double Cheeseburger": "Double the beef, double the cheese, for when you’re feeling extra hungry."
}

menu_item_calories = {
    "Bacon Cheeseburger": 800,  
    "Cheeseburger": 600,
    "Patty Melt": 700,
    "Hamburger": 500,
    "Aggie Chicken Club": 750,
    "Revs Grilled Chicken Sandwich": 550,
    "Spicy Chicken Sandwich": 650,
    "Chicken Caesar Salad": 400,
    "French Fries": 300,
    "Small Drink": 150,
    "Large Drink": 250,
    "Cookies": 160,  
    "Chicken Tenders": 470,
    "Corn Dogs": 220, 
    "Hot Dogs": 500,  
    "Chicken Wrap": 600,
    "Double Scoop Ice Cream": 450,
    "Aggie Shake": 550,
    "Cookie Ice Cream Melt": 700,
    "Yell BBQ Rib Sandwich": 900,
    "BLT Burger": 800,
    "Double Cheeseburger": 900
}

inventory_item_costs = {
    "Buns": .30,
    "Lettuce": .25,
    "patty": 1.50,
    "cheese": .40,
    "bacon": .50,
    "bread": .20,
    "tomato": .40,
    "crispy chicken": .75,
    "spicy crispy chicken": .85,
    "grilled chicken": .75,
    "croutons": .10,
    "fries": 1.20,
    "small cup": .05,
    "large cup": .08,
    "cookie": .25,
    "chicken tender": .80,
    "corn dog": 1.10,
    "hot dog bun": .25,
    "wiener":.75,
    "tortilla":.10,
    "salsa":.05,
    "ice cream":.75,
    "whipped cream":.25,
    "ribs":1.50,
    "pickles":.20,
    "onions":.20,
    "napkin":.02,
    "cup lid":.10,
    "straw":.05,
    "tray":.05,
    "ice cream bowl":.20,
    "shake cup":.23,
    "salad bowl":.18
}

inventory_items = [
    (1, "Buns", 3200, inventory_item_costs["Buns"], 3200),
    (2, "Lettuce", 3600, inventory_item_costs["Lettuce"], 3600),
    (3, "patty", 2800, inventory_item_costs["patty"], 2800),
    (4, "cheese", 1600, inventory_item_costs["cheese"], 1600),
    (5, "bacon", 1200, inventory_item_costs["bacon"], 1200),
    (6, "bread", 400, inventory_item_costs["bread"], 400),
    (7, "tomato", 1200, inventory_item_costs["tomato"], 1200),
    (8, "crispy chicken", 400, inventory_item_costs["crispy chicken"], 400),
    (9, "spicy crispy chicken", 400, inventory_item_costs["spicy crispy chicken"], 400),
    (10, "grilled chicken", 1200, inventory_item_costs["grilled chicken"], 1200),
    (11, "croutons", 400, inventory_item_costs["croutons"], 400),
    (12, "fries", 400, inventory_item_costs["fries"], 400),
    (13, "small cup", 400, inventory_item_costs["small cup"], 400),
    (14, "large cup", 400, inventory_item_costs["large cup"], 400),
    (15, "cookie", 1600, inventory_item_costs["cookie"], 1600),
    (16, "chicken tender", 400, inventory_item_costs["chicken tender"], 400),
    (17, "corn dog", 800, inventory_item_costs["corn dog"], 800),
    (18, "hot dog bun", 800, inventory_item_costs["hot dog bun"], 800),
    (19, "wiener", 800, inventory_item_costs["wiener"], 800),
    (20, "tortilla", 400, inventory_item_costs["tortilla"], 400),
    (21, "salsa", 400, inventory_item_costs["salsa"], 400),
    (22, "ice cream", 1600, inventory_item_costs["ice cream"], 1600),
    (23, "whipped cream", 400, inventory_item_costs["whipped cream"], 400),
    (24, "ribs", 400, inventory_item_costs["ribs"], 400),
    (25, "pickles", 400, inventory_item_costs["pickles"], 400),
    (26, "onions", 400, inventory_item_costs["onions"], 400),
    (27, "napkin", 7200, inventory_item_costs["napkin"], 7200),
    (28, "cup lid", 800, inventory_item_costs["cup lid"], 800),
    (29, "straw", 1200, inventory_item_costs["straw"], 1200),
    (30, "tray", 6800, inventory_item_costs["tray"], 6800),
    (31, "ice cream bowl", 400, inventory_item_costs["ice cream bowl"], 400),
    (32, "shake cup", 400, inventory_item_costs["shake cup"], 400),
    (33, "salad bowl", 400, inventory_item_costs["salad bowl"], 400),
]

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

ingredients_data = [
    (1, 1, 1, 1),
    (2, 3, 1, 1),
    (3, 4, 1, 1),
    (4, 5, 1, 1),
    (5, 31, 1, 1),
    (6, 28, 1, 1),
    (7, 1, 2, 1),
    (8, 3, 2, 1),
    (9, 4, 2, 1),
    (10, 31, 2, 1),
    (11, 28, 2, 1),
    (12, 6, 3, 1),
    (13, 3, 3, 1),
    (14, 4, 3, 1),
    (15, 31, 3, 1),
    (16, 28, 3, 1),
    (17, 1, 4, 1),
    (18, 3, 4, 1),
    (19, 2, 4, 1),
    (20, 7, 4, 1),
    (21, 31, 4, 1),
    (22, 28, 4, 1),
    (23, 1, 5, 1),
    (24, 8, 5, 1),
    (25, 2, 5, 1),
    (26, 5, 5, 1),
    (27, 31, 5, 1),
    (28, 28, 5, 1),
    (29, 1, 6, 1),
    (30, 10, 6, 1),
    (31, 2, 6, 1),
    (32, 7, 6, 1),
    (33, 31, 6, 1),
    (34, 28, 6, 1),
    (35, 1, 7, 1),
    (36, 9, 7, 1),
    (37, 2, 7, 1),
    (38, 31, 7, 1),
    (39, 28, 7, 1),
    (40, 10, 8, 1),
    (41, 2, 8, 3),
    (42, 11, 8, 1),
    (43, 33, 8, 1),
    (44, 28, 8, 1),
    (45, 12, 9, 1),
    (46, 31, 9, 1),
    (47, 28, 9, 1),
    (48, 13, 10, 1),
    (49, 29, 10, 1),
    (50, 30, 10, 1),
    (51, 14, 11, 1),
    (52, 29, 11, 1),
    (53, 30, 11, 1),
    (54, 15, 12, 2),
    (55, 31, 12, 1),
    (56, 28, 12, 1),
    (57, 17, 13, 1),  # Adjusted ID for "corn dog"
    (58, 31, 13, 1),
    (59, 28, 13, 1),
    (60, 18, 14, 2),  # Adjusted ID for "hot dog bun"
    (61, 31, 14, 1),
    (62, 28, 14, 1),
    (63, 19, 15, 2),  # Adjusted ID for "wiener"
    (64, 20, 15, 2),  # Adjusted ID for "tortilla"
    (65, 31, 15, 1),
    (66, 28, 15, 1),
    (67, 21, 16, 1),  # Adjusted ID for "salsa"
    (68, 10, 16, 1),
    (69, 22, 16, 1),  # Adjusted ID for "ice cream"
    (70, 2, 16, 1),
    (71, 31, 16, 1),
    (72, 28, 16, 1),
    (73, 23, 17, 2),  # Adjusted ID for "whipped cream"
    (74, 32, 17, 1),  # Adjusted ID for "ribs"
    (75, 23, 18, 1),  # Adjusted ID, repeats "whipped cream"
    (76, 24, 18, 1),  # Adjusted ID for "pickles"
    (77, 33, 18, 1),  # Adjusted ID for "salad bowl"
    (78, 30, 18, 1),  # Adjusted ID for "straw"
    (79, 15, 19, 2),  # Adjusted ID for "cookie"
    (80, 23, 19, 1),  # Adjusted ID, repeats "whipped cream"
    (81, 31, 19, 1),
    (82, 28, 19, 1),
    (83, 25, 20, 1),  # Adjusted ID for "onions"
    (84, 27, 20, 1),  # Adjusted ID for "napkin"
    (85, 26, 20, 1),  # Adjusted ID for "cup lid"
    (86, 31, 20, 1),
    (87, 28, 20, 1),
    (88, 1, 21, 1),
    (89, 3, 21, 1),
    (90, 5, 21, 1),
    (91, 2, 21, 1),
    (92, 7, 21, 1),
    (93, 31, 21, 1),
    (94, 28, 21, 1),
    (95, 1, 22, 1),
    (96, 3, 22, 2),
    (97, 4, 22, 1),
    (98, 31, 22, 1),
    (99, 28, 22, 1)
]

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
    with conn.cursor() as cur:
        cur.executemany(sql.SQL("""
            INSERT INTO employees (id, name, salary, shift_start, shift_end, manager, username, password)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """), employees)
        conn.commit()
        print("Employees data populated successfully.")

def populate_inventory_items(conn):
    with conn.cursor() as cur:
        cur.executemany(sql.SQL("""
            INSERT INTO inventory_items (id, item_name, stock, price, max_stock)
            VALUES (%s, %s, %s, %s, %s)
        """), inventory_items)
        conn.commit()
        print("Inventory items data populated successfully.")

def populate_irremovable_ingredients(conn):
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
            price = menu_item_costs[name]
            category = menu_item_categories[name]
            description = menu_item_descriptions[name]
            calories = menu_item_calories[name]
            available = True  # Assume all items are available

            cur.execute("""
                INSERT INTO menu_items (id, name, available, price, category, description, calories)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (menu_id, name, available, price, category, description, calories))
            menu_id += 1
        conn.commit()
        print("Menu items data populated successfully.")

def populate_ingredients(conn):
    with conn.cursor() as cur:
        cur.executemany(sql.SQL("""
            INSERT INTO ingredients (id, item_id, menu_id, num)
            VALUES (%s, %s, %s, %s)
        """), ingredients_data)
        conn.commit()
        print("Ingredients data populated successfully.")

def populate_inventory_transactions(conn):
    with conn.cursor() as cur:
        # Fetch manager IDs from employees table
        cur.execute("SELECT id FROM employees WHERE manager = TRUE;")
        manager_ids = [row[0] for row in cur.fetchall()]

        # Fetch item IDs and their prices from inventory_items table
        cur.execute("SELECT id, price, max_stock FROM inventory_items;")
        item_data = [(row[0], row[1], row[2]) for row in cur.fetchall()]

        # Define the date range for transactions
        start_date = datetime.now() - timedelta(days=90) # 6 months ago
        end_date = datetime.now().replace(hour=23, minute=59, second=59)  # end of today

        transaction_id = 1
        while start_date < end_date:
            # Choose a random manager
            manager_id = random.choice(manager_ids)

            # Generate transaction date within defined range
            transaction_date = start_date + timedelta(days=random.randint(1, 7))

            # Generate a random transaction
            num_items = random.randint(1, 5)  # Number of different items to order
            total_price = 0

            # Prepare a batch of order insertions
            order_values = []
            for _ in range(num_items):
                item_id, price_per_unit, max_stock = random.choice(item_data)
                quantity = random.randint(1, min(20, max_stock))  # Logical amount to order, capped at max_stock
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
    with conn.cursor() as cur:
        cur.execute("SELECT id FROM employees;")
        employee_ids = [row[0] for row in cur.fetchall()]

        cur.execute("SELECT id, price FROM menu_items;")
        menu_items_with_prices = {row[0]: row[1] for row in cur.fetchall()}

        # Define operation hours and date range
        start_date = datetime.now() - timedelta(days=90)
        end_date = datetime.now().replace(hour=23, minute=59, second=59) + timedelta(days=1)

        sql_commands = []
        transaction_id = 1

        while start_date < end_date:
            weekday = start_date.weekday()
            hours = range(11, 20) if weekday >= 5 else range(10, 21)

            for hour in hours:
                num_transactions = random.randint(3, 5) if hour in [12, 13, 18, 19] else random.randint(1, 2)
                for _ in range(num_transactions):
                    employee_id = random.choice(employee_ids)
                    minute, second = random.randint(0, 59), random.randint(0, 59)
                    transaction_date = start_date.replace(hour=hour, minute=minute, second=second).isoformat()
                    total_cost = sum(random.choice(list(menu_items_with_prices.values())) for _ in range(random.randint(1, 5)))

                    sql_commands.append(f"INSERT INTO sales_transactions (id, cost, employee_id, purchase_time) VALUES ({transaction_id}, {total_cost}, {employee_id}, '{transaction_date}');")
                    transaction_id += 1

            start_date += timedelta(days=1)

        with open('sales_transactions.sql', 'w') as file:
            file.write("\n".join(sql_commands))

        with open('sales_transactions.sql', 'r') as file:
            cur.execute(file.read())
        conn.commit()
        os.remove('sales_transactions.sql')

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
        print("(Populating inventory transactions sometimes takes a while...)")
        populate_inventory_transactions(conn)
        print("(Populating sales transactions sometimes takes a while...)")
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

