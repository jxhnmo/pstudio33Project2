CREATE TABLE employees (
    id INT PRIMARY KEY,
    name VARCHAR(50),
    salary NUMERIC,
    shift_start TIME,
    shift_end TIME,
    manager BOOLEAN
);

CREATE TABLE inventory_items (
    id INT PRIMARY KEY,
    item_name VARCHAR(50),
    stock INT,
    price NUMERIC
);

CREATE TABLE menu_items (
    id INT PRIMARY KEY,
    name VARCHAR(50),
    /* description TEXT,*/
    image_data BYTEA,
    available BOOLEAN,
    price NUMERIC,
    category VARCHAR(50)
);


CREATE TABLE ingredients (
    id INT PRIMARY KEY,
    item_id INT,
    menu_id INT,
    num INT,
    FOREIGN KEY (item_id) REFERENCES inventory_items(id),
    FOREIGN KEY (menu_id) REFERENCES menu_items(id)
);

CREATE TABLE inventory_transactions (
    id INT PRIMARY KEY,
    manager_id INT,
    transaction_date TIMESTAMP,
    price NUMERIC
);

CREATE TABLE inventory_item_orders (
    id INT PRIMARY KEY,
    transaction_id INT,
    item_id INT,
    stock INT,
    price NUMERIC,
    FOREIGN KEY (transaction_id) REFERENCES inventory_transactions(id),
    FOREIGN KEY (item_id) REFERENCES inventory_items(id)
);

CREATE TABLE sales_transactions (
    id INT PRIMARY KEY,
    cost NUMERIC,
    employee_id INT,
    purchase_time TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id)
);

CREATE TABLE sales_items (
    id INT PRIMARY KEY,
    sales_id INT,
    menu_id INT,
    FOREIGN KEY (sales_id) REFERENCES sales_transactions(id),
    FOREIGN KEY (menu_id) REFERENCES menu_items(id)
);