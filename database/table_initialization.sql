DROP TABLE IF EXISTS 'employees';
CREATE TABLE employees (
    id INT PRIMARY KEY,
    name VARCHAR(50),
    salary NUMERIC,
    shift_start TIME,
    shift_end TIME,
    manager BOOLEAN,
    user VARCHAR(50),
    password VARCHAR(50)
);

DROP TABLE IF EXISTS 'inventory_items';
CREATE TABLE inventory_items (
    id INT PRIMARY KEY,
    item_name VARCHAR(50),
    stock INT,
    price NUMERIC
);

DROP TABLE IF EXISTS 'menu_items';
CREATE TABLE menu_items (
    id INT PRIMARY KEY,
    name VARCHAR(50),
    /* description TEXT,*/
    image_data BYTEA,
    available BOOLEAN,
    price NUMERIC,
    category VARCHAR(50)
);

DROP TABLE IF EXISTS 'ingredients';
CREATE TABLE ingredients (
    id INT PRIMARY KEY,
    item_id INT,
    menu_id INT,
    num INT,
    FOREIGN KEY (item_id) REFERENCES inventory_items(id),
    FOREIGN KEY (menu_id) REFERENCES menu_items(id)
);

DROP TABLE IF EXISTS 'inventory_transactions';
CREATE TABLE inventory_transactions (
    id INT PRIMARY KEY,
    manager_id INT,
    transaction_date TIMESTAMP,
    price NUMERIC
);

DROP TABLE IF EXISTS 'inventory_item_orders';
CREATE TABLE inventory_item_orders (
    id INT PRIMARY KEY,
    transaction_id INT,
    item_id INT,
    stock INT,
    price NUMERIC,
    FOREIGN KEY (transaction_id) REFERENCES inventory_transactions(id),
    FOREIGN KEY (item_id) REFERENCES inventory_items(id)
);

DROP TABLE IF EXISTS 'sales_transactions';
CREATE TABLE sales_transactions (
    id INT PRIMARY KEY,
    cost NUMERIC,
    employee_id INT,
    purchase_time TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id)
);

DROP TABLE IF EXISTS 'sales_items';
CREATE TABLE sales_items (
    id INT PRIMARY KEY,
    sales_id INT,
    menu_id INT,
    FOREIGN KEY (sales_id) REFERENCES sales_transactions(id),
    FOREIGN KEY (menu_id) REFERENCES menu_items(id),
);